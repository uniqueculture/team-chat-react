/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * As Spring Data Rest lacks an elegant support for extra fields in an entity
 * associated, this entity is a full-featured entity with its own ID (not
 * composite)
 *
 * @author me
 */
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"server_id", "user_id"})})
public class ServerUser implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    //@MapsId("server_id")
    @JoinColumn(name = "server_id")
    private Server server;

    @ManyToOne
    //@MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ServerUserRole role;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateAt;

    public ServerUser() {
    }

    public ServerUser(Server server, User user, ServerUserRole role) {
        this.server = server;
        this.user = user;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ServerUserRole getRole() {
        return role;
    }

    public void setRole(ServerUserRole role) {
        this.role = role;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Date updateAt) {
        this.updateAt = updateAt;
    }

    /*@PrePersist
    private void prePersist() {
        if (getId() == null) {
            ServerUserKey key = new ServerUserKey(server.getId(), user.getId());
            this.id = key;
        }
    }*/
}
