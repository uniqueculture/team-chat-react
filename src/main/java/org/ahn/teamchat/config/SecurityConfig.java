/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.config;

import org.ahn.teamchat.auth.JwtAuthenticationEntryPoint;
import org.ahn.teamchat.auth.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * This application is secured at both the URL level for some parts, and the
 * method level for other parts. The URL security is shown inside this code,
 * while method-level annotations are enabled at by
 * {@link EnableGlobalMethodSecurity}.
 *
 * @author Sergei Izvorean
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * This section defines the user accounts which can be used for
     * authentication as well as the roles each user has.
     */
    /*@Bean
    InMemoryUserDetailsManager userDetailsManager() {
        UserBuilder builder = User.withDefaultPasswordEncoder();

        UserDetails greg = builder.username("user").password("password").roles("USER").build();
        UserDetails ollie = builder.username("admin").password("password").roles("USER", "ADMIN").build();

        return new InMemoryUserDetailsManager(greg, ollie);
    }*/

    /**
     * Override default Spring Boot 2 behavior: To disable default user creation, 
     * provide a bean of type AuthenticationManager, AuthenticationProvider or UserDetailsService.
     * 
     * See: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide#authenticationmanager-bean
     * 
     * @return
     * @throws Exception 
     */
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    
    /*@Bean
    BindAuthenticator authenticator(BaseLdapPathContextSource contextSource) {
        BindAuthenticator authenticator = new BindAuthenticator(contextSource);
        authenticator.setUserDnPatterns(new String[]{"uid={0},ou=people"});
        return authenticator;
    }*/

    @Bean
    ActiveDirectoryLdapAuthenticationProvider authenticationProvider() {
        throw new UnsupportedOperationException("TBI");
    }

    /**
     * This section defines the security policy for the app.
     * <p>
     * <ul>
     * <li>BASIC authentication is supported (enough for this REST-based
     * demo).</li>
     * <li>/employees is secured using URL security shown below.</li>
     * <li>CSRF headers are disabled since we are only testing the REST
     * interface, not a web one.</li>
     * </ul>
     * NOTE: GET is not shown which defaults to permitted.
     *
     * @param http
     * @throws Exception
     * @see
     * org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter#configure(org.springframework.security.config.annotation.web.builders.HttpSecurity)
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // We don't need CSRF for this example
        http.csrf().disable()
                // dont authenticate this particular request to authenticate or SockJS info request
                // WebSocket security is handled within WS connection
                .authorizeRequests().antMatchers("/api/authenticate", WebSocketConfig.WS_ENDPOINT + "/**").permitAll().
                // all other requests need to be authenticated
                anyRequest().authenticated().and().
                //exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and().
                // make sure we use stateless session; session won't be used to
                // store user's state.
                sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        // cors() method will add the Spring-provided CorsFilter to the application 
        // context which in turn bypasses the authorization checks for OPTIONS requests.
        http.cors();

        /*
        http.httpBasic().and().authorizeRequests().//
                antMatchers("/**").authenticated().and().
                formLogin()
                .loginPage("/login")
                .permitAll()
                .and().
                logout()
                .permitAll()
                .and().
                sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().
                csrf().disable();*/
    }
}
