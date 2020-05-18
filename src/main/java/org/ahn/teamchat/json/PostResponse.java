/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.json;

import java.util.Date;
import org.ahn.teamchat.data.Channel;
import org.ahn.teamchat.data.Post;
import org.ahn.teamchat.data.User;
import org.springframework.hateoas.Link;

/**
 *
 * @author me
 */
public class PostResponse {
    
    private final String uri;
    private final String message;
    private final Author author;
    private final String authorUri;
    private final Date createdAt;
    private final Date updatedAt;

    public PostResponse(String uri, String message, String authorPrincipal, String authorDisplayName, String authorUri, Date createdAt, Date updatedAt) {
        this.uri = uri;
        this.message = message;
        this.author = new Author(authorPrincipal, authorDisplayName);
        this.authorUri = authorUri;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getUri() {
        return uri;
    }

    public String getMessage() {
        return message;
    }

    public Author getAuthor() {
        return author;
    }
    
    public String getAuthorUri() {
        return authorUri;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public class Author {
        private final String principal;
        private final String displayName;

        public Author(String principal, String displayName) {
            this.principal = principal;
            this.displayName = displayName;
        }

        public String getPrincipal() {
            return principal;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
    
}
