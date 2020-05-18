/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.controller;

import io.jsonwebtoken.JwtException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.Date;
import org.ahn.teamchat.auth.JwtUtils;
import org.ahn.teamchat.json.PostRequest;
import org.ahn.teamchat.json.PostResponse;
import org.ahn.teamchat.data.Channel;
import org.ahn.teamchat.data.Post;
import org.ahn.teamchat.data.PostRepository;
import org.ahn.teamchat.data.User;
import org.ahn.teamchat.data.UserRepository;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.mapping.context.PersistentEntities;
import org.springframework.data.repository.support.DefaultRepositoryInvokerFactory;
import org.springframework.data.repository.support.Repositories;
import org.springframework.data.rest.core.UriToEntityConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

/**
 *
 * @author me
 */
@Controller
public class PostsController {

    static final Logger LOGGER = LoggerFactory.getLogger(PostsController.class);

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    @Qualifier("clientOutboundChannel")
    private MessageChannel clientOutboundChannel;

    @Autowired
    private PostRepository posts;
    
    @Autowired
    private UserRepository users;

    @Autowired
    private JwtUtils jwtUtils;

    private final UriToEntityConverter uriToEntityConverter;

    private final Repositories repositories;

    private final PolicyFactory policy;

    @Autowired
    public PostsController(ApplicationContext applicationContext, MappingContext<?, ?> mappingContext) {
        this.repositories = new Repositories(applicationContext);
        this.uriToEntityConverter = new UriToEntityConverter(
                new PersistentEntities(Collections.singleton(mappingContext)),
                new DefaultRepositoryInvokerFactory(repositories),
                repositories);
        this.policy = new HtmlPolicyBuilder().toFactory();
    }

    @MessageMapping("/post/{chatUri}")
    public void makePost(@Payload PostRequest payload,
            @Header("simpSessionId") String sessionId,
            @Header("X-Authorization") String authorizationHeader,
            @DestinationVariable("chatUri") String encodedChatUri,
            @AuthenticationPrincipal UserDetails user) throws URISyntaxException {
        LOGGER.info("Making a post");

        try {
            // Validate the authorization header
            validateAuthorizationHeader(authorizationHeader, user);
        } catch (Exception ex) {
            // Send an error on invalid token
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
            headerAccessor.setMessage(ex.getMessage());
            headerAccessor.setSessionId(sessionId);
            clientOutboundChannel.send(MessageBuilder.createMessage(new byte[0], headerAccessor.getMessageHeaders()));
            LOGGER.error("Exception making a post", ex);
            return;
        }

        try {
            // Validate
            if (payload.getMessage() == null || payload.getMessage().isEmpty()) {
                throw new IllegalArgumentException("Post message is required");
            }

            // Get channeland author entity
            URI channelUri = URI.create(URLDecoder.decode(encodedChatUri, Charset.defaultCharset()));
            URI authorUri = URI.create(payload.getAuthorUri());

            Channel channel = (Channel) uriToEntityConverter.convert(channelUri, TypeDescriptor.valueOf(URI.class), TypeDescriptor.valueOf(Channel.class));
            User author = (User) uriToEntityConverter.convert(authorUri, TypeDescriptor.valueOf(URI.class), TypeDescriptor.valueOf(User.class));
            
            if (!author.getPrincipal().equals(user.getUsername())) {
                throw new RuntimeException("User miss-match");
            }

            // Create a new post
            Post saved = posts.save(new Post(channel, policy.sanitize(payload.getMessage()), author));
            
            // Mark as user activity
            author.setLastActivityAt(new Date());
            users.save(author);

            // Respond with the saved entity
            simpMessagingTemplate.convertAndSend("/topic/" + encodedChatUri,
                    new PostResponse(
                            String.valueOf(saved.getId()),
                            saved.getMessage(),
                            author.getPrincipal(),
                            author.getDisplayName(),
                            payload.getAuthorUri(),
                            saved.getCreatedAt(),
                            saved.getUpdateAt()));
        } catch (Exception ex) {
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.create(StompCommand.ERROR);
            headerAccessor.setMessage(ex.getMessage());
            headerAccessor.setSessionId(sessionId);
            clientOutboundChannel.send(MessageBuilder.createMessage(new byte[0], headerAccessor.getMessageHeaders()));
            LOGGER.error("Exception making a post", ex);
        }
    }

    protected void validateAuthorizationHeader(String header, UserDetails user) {
        if (header == null || header.isEmpty()) {
            throw new IllegalArgumentException("Authorization header is empty");
        }

        String accessToken = header.split(" ")[1];
        if (!jwtUtils.validateToken(accessToken, user)) {
            throw new JwtException("Invalid token");
        }
    }
}
