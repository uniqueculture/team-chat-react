/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 *
 * @author me
 */
@Entity
public class Post implements Serializable {

    @Id
    @GeneratedValue
    private Long id;

    @Lob
    @Column(nullable = false, length = 3000)
    private String message;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @JsonBackReference
    private Channel channel;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    @JsonBackReference
    private User author;
    
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateAt;

    public Post() {
    }

    public Post(Channel channel, String message, User author) {
        this.channel = channel;
        this.message = message;
        this.author = author;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public Channel getChannel() {
        return channel;
    }

    public User getAuthor() {
        return author;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }
    
    
}
