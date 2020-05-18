/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import java.io.Serializable;
import org.springframework.data.rest.webmvc.spi.BackendIdConverter;
import org.springframework.stereotype.Component;

/**
 *
 * @author me
 */
//@Component
@Deprecated
public class ServerUserIdConverter implements BackendIdConverter {

    @Override
    public Serializable fromRequestId(String id, Class<?> entityType) {
        String[] split = id.split("-");
        return new ServerUserKey(Long.valueOf(split[0]), Long.valueOf(split[1]));
    }

    @Override
    public String toRequestId(Serializable id, Class<?> entityType) {
        ServerUserKey key = (ServerUserKey) id;
        return key.getServerId() + "-" + key.getUserId();
    }

    @Override
    public boolean supports(Class<?> s) {
        return s.equals(ServerUser.class);
    }
    
}
