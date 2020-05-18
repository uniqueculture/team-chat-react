/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data.config;

import org.ahn.teamchat.data.Server;
import org.ahn.teamchat.data.ServerUser;
import org.ahn.teamchat.data.ServerUserRole;
import org.springframework.data.rest.core.config.Projection;

/**
 *
 * @author me
 */
@Projection(name = "inlineServer", types = {ServerUser.class})
public interface InlineServerUserProjection {
    
    ServerUserRole getRole();
    
    Server getServer();
    
}
