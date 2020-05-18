/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 *
 * @author me
 */
//@Embeddable
@Deprecated
public class ServerUserKey implements Serializable {
    
    @Column(name = "server_id")
    private Long serverId;
    
    @Column(name = "user_id")
    private Long userId;
    
    public ServerUserKey() {
    }

    public ServerUserKey(Long serverId, Long userId) {
        this.serverId = serverId;
        this.userId = userId;
    }

    public Long getServerId() {
        return serverId;
    }

    public void setServerId(Long serverId) {
        this.serverId = serverId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 53 * hash + Objects.hashCode(this.serverId);
        hash = 53 * hash + Objects.hashCode(this.userId);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final ServerUserKey other = (ServerUserKey) obj;
        if (!Objects.equals(this.serverId, other.serverId)) {
            return false;
        }
        if (!Objects.equals(this.userId, other.userId)) {
            return false;
        }
        return true;
    }
    
}
