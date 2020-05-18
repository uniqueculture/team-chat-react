/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author me
 */
@RepositoryRestResource(collectionResourceRel = "servers", path = "servers")
public interface ServerRepository extends CrudRepository<Server, Long> {
    
    //List<Server> findAllServersByUsersIn(List<User> user);
    
}
