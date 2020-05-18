/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;

/**
 *
 * @author me
 */
@Component
public class RepositoryRestConfig implements RepositoryRestConfigurer {

    @Value("${app.allowed-origins}")
    private String[] allowedOrigins;
    
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {

        config.getCorsRegistry().addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("*")
                .exposedHeaders("Location")
                //.allowedHeaders("header1", "header2", "header3")
                //.exposedHeaders("header1", "header2")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
