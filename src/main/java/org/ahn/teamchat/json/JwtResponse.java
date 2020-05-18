/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.json;

/**
 *
 * @author me
 */
public class JwtResponse {

    private final String jwttoken;
    private final String user;

    public JwtResponse(String jwttoken, String user) {
        this.jwttoken = jwttoken;
        this.user = user;
    }

    public String getToken() {
        return this.jwttoken;
    }

    public String getUser() {
        return user;
    }
    
}
