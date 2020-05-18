/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.ahn.teamchat.data;

import org.ahn.teamchat.data.config.PostFullProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 *
 * @author me
 */
@RepositoryRestResource(collectionResourceRel = "posts", path = "posts")
public interface PostRepository extends PagingAndSortingRepository<Post, Long> {
    
    Slice<Post> findByChannel(Channel channel, Pageable page);
    
}
