/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 *
 * @author me
 */
@Entity
public class Server implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String imagePath;

    @OneToMany(mappedBy = "server")
    private List<Channel> channels;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL)
    private List<ServerUser> users;
    
    @Enumerated(EnumType.STRING)
    private ServerAccessType accessType;

    @Column(nullable = false)
    private String createdBy;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastMessageAt;

    public Server() {
    }

    public Server(String name) {
        this.name = name;
        this.createdBy = "";
        this.createdAt = new Date();
        this.updateAt = new Date();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImagePath() {
        return imagePath;
    }

    public List<Channel> getChannels() {
        return channels;
    }

    public List<ServerUser> getUsers() {
        return users;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public Date getLastMessageAt() {
        return lastMessageAt;
    }

    public ServerAccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(ServerAccessType accessType) {
        this.accessType = accessType;
    }

    public void setUsers(List<ServerUser> users) {
        this.users = users;
    }
    
}
