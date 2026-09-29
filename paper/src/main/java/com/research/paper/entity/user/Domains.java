package com.research.paper.entity.user;

import com.research.paper.common.BaseEntity;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.paper.SavedPaper;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
public class Domains extends BaseEntity {
    @Column(name = "NAME")
    private String name;
    @Column(name = "LOGO")
    private String logo;
    @ManyToMany(mappedBy = "domains")
    private List<User> users;
    @OneToMany(mappedBy = "domain", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResearchPaper> papers = new ArrayList<>();
}
