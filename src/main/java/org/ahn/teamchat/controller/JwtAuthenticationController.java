/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.controller;

import java.util.Date;
import org.ahn.teamchat.auth.JwtRequestFilter;
import org.ahn.teamchat.auth.JwtUtils;
import org.ahn.teamchat.data.User;
import org.ahn.teamchat.data.UserRepository;
import org.ahn.teamchat.json.JwtRequest;
import org.ahn.teamchat.json.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author me
 */
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class JwtAuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtTokenUtil;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private UserRepository users;

    @Autowired
    private RepositoryEntityLinks entityLinks;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = jwtRequestFilter
                .getUserDetails(authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);

        // Check the local database and create the user if necessary
        User user = users.findByPrincipal(userDetails.getUsername());
        if (user == null) {
            // Create a new user record
            user = new User(userDetails.getUsername(), userDetails.getUsername());
        }

        Date now = new Date();
        user.setLastLoginAt(now);
        user.setLastActivityAt(now);
        User saved = users.save(user);

        return ResponseEntity.ok(
                new JwtResponse(token,
                        entityLinks.linkForItemResource(
                                User.class,
                                saved.getId()).toUri().toString()));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            Object details = auth.getDetails();
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
