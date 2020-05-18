/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.config;

import static org.ahn.teamchat.config.WebSocketConfig.APP_PREFIX;
import org.springframework.context.annotation.Configuration;
import static org.springframework.messaging.simp.SimpMessageType.MESSAGE;
import static org.springframework.messaging.simp.SimpMessageType.SUBSCRIBE;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

/**
 *
 * @author me
 */
@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                // Any message without a destination (i.e. anything other than Message type of MESSAGE or SUBSCRIBE) 
                // will require the user to be authenticated
                .nullDestMatcher().authenticated()
                // Anyone can subscribe to /user/queue/errors
                .simpSubscribeDestMatchers("/user/queue/errors").permitAll()
                // Any message that has a destination starting with "/app/" 
                // will be require the user to have the role ROLE_USER
                .simpDestMatchers(APP_PREFIX + "/**").hasRole("USER")
                // Any message that starts with "/user/" or "/topic/friends/" 
                // that is of type SUBSCRIBE will require ROLE_USER
                .simpSubscribeDestMatchers("/user/**", "/topic/**").hasRole("USER")
                // Any other message of type MESSAGE or SUBSCRIBE is rejected. 
                .simpTypeMatchers(MESSAGE, SUBSCRIBE).denyAll()
                // Any other Message is rejected.
                .anyMessage().denyAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true;
    }
    
    
}
