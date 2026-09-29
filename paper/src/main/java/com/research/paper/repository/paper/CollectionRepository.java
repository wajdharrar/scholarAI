package com.research.paper.repository.paper;

import com.research.paper.entity.paper.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection,String> {
    @Query("select c from Collection c join c.papers p where p.user.id = ?1")
    List<Collection> findAllCollectionsByUserId(String userId);
}
