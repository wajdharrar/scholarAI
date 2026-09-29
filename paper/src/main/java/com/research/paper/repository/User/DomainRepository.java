package com.research.paper.repository.User;

import com.research.paper.entity.user.Domains;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DomainRepository extends JpaRepository<Domains,String> {
    Optional<Domains> findByName(String name);
}
