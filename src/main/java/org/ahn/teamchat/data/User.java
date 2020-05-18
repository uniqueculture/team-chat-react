/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
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
public class User implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String principal;

    private String displayName;
    
    private String statusLine;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    @OneToMany(mappedBy = "user")
    private List<ServerUser> servers;
    
    @OneToMany(mappedBy = "author")
    private List<Post> posts;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActivityAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLoginAt;

    public User() {
    }

    public User(String principal, String displayName) {
        this.principal = principal;
        this.displayName = displayName;
    }

    public void setPrincipal(String principal) {
        this.principal = principal;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setStatusLine(String statusLine) {
        this.statusLine = statusLine;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public void setLastActivityAt(Date lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }

    public void setLastLoginAt(Date lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
    
    public Long getId() {
        return id;
    }

    public String getPrincipal() {
        return principal;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getStatusLine() {
        return statusLine;
    }

    public UserStatus getStatus() {
        return status;
    }
    
    public List<ServerUser> getServers() {
        return servers;
    }

    @JsonIgnore
    public List<Post> getPosts() {
        return posts;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public Date getLastActivityAt() {
        return lastActivityAt;
    }

    public Date getLastLoginAt() {
        return lastLoginAt;
    }
    
    
}
