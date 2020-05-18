/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data.config;

import org.ahn.teamchat.data.ServerUser;
import org.ahn.teamchat.data.ServerUserRole;
import org.ahn.teamchat.data.User;
import org.springframework.data.rest.core.config.Projection;

/**
 *
 * @author me
 */
@Projection(name = "inlineUser", types = {ServerUser.class})
public interface InlineUserServerProjection {
    
    ServerUserRole getRole();
    
    User getUser();
    
}
