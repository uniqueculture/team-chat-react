/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.json;

import java.util.Date;

/**
 *
 * @author me
 */
public class PostRequest {
    
    String chatUri;
    String authorUri;
    String message;
    Date dateTime;
    
    public PostRequest() {
    }

    public String getChatUri() {
        return chatUri;
    }

    public String getAuthorUri() {
        return authorUri;
    }

    public String getMessage() {
        return message;
    }

    public Date getDateTime() {
        return dateTime;
    }
}
