/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 *
 * @author me
 */
@RepositoryRestResource(collectionResourceRel = "channels", path = "channels")
public interface ChannelRepository extends CrudRepository<Channel, Long> {
 
    public List<Channel> findByServer(Server server);
    
}
