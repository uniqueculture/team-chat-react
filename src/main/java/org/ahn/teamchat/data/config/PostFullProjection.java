/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data.config;

import java.util.Date;
import org.ahn.teamchat.data.Channel;
import org.ahn.teamchat.data.Post;
import org.ahn.teamchat.data.User;
import org.springframework.data.rest.core.config.Projection;

/**
 *
 * @author me
 */
@Projection(name = "fullPost", types = {Post.class})
public interface PostFullProjection {

    public String getMessage();

    public Channel getChannel();

    public User getAuthor();

    public Date getCreatedAt();

    public Date getUpdateAt();
}
