package com.research.paper.entity.paper;

import com.research.paper.common.BaseEntity;
import com.research.paper.entity.user.Domains;
import com.research.paper.enumeration.paper.PaperCategory;
import com.research.paper.enumeration.paper.PaperStatus;
import com.research.paper.entity.feedback.Citation;
import com.research.paper.entity.user.User;
import com.research.paper.entity.feedback.Comment;
import com.research.paper.entity.feedback.Like;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "RESEARCH_PAPER")
@EntityListeners(AuditingEntityListener.class)
public class ResearchPaper extends BaseEntity {
    @Column(name = "TITLE", nullable = false)
    private String title;
    @Column(name = "ABSTRACT_TEXT",columnDefinition = "TEXT")
    private String abstractText;
    @Column(name = "THUMBNAIL")
    private String thumbnail;
    @Column(name = "PUBLICATION_DATE")
    private LocalDate publicationDate;
    @Column(name = "PAPER_STATUS",nullable = false)
    @Enumerated(EnumType.STRING)
    private PaperStatus status;
    @Column(name = "PAPER_CATEGORY",nullable = false)
    @Enumerated(EnumType.STRING)
    private PaperCategory category;
    @Column(name="VIEW_COUNT",nullable = false)
    private int viewCount;
    @Column(name="DOWNLOAD_COUNT",nullable = false)
    private int downloadCount;
    @Column(name="CITATION_COUNT",nullable = false)
    private int citationCount;
    @Column(name="LIKE_COUNT",nullable = false)
    private int likeCount;
    @Column(name="COMMENT_COUNT",nullable = false)
    private int commentCount;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="corresponding_author_id")
    private User correspondingAuthor;
    @ManyToMany
    @JoinTable(
            name="paper_authors",
            joinColumns = @JoinColumn(name = "paper_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> authors = new HashSet<>();
    @ElementCollection
    @CollectionTable(name = "paper_keywords", joinColumns = @JoinColumn(name = "paper_id"))
    @Column(name = "keyword")
    private Set<String> keywords = new HashSet<>();

    @Column(length = 10000,nullable = false)
    private String document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain_id", nullable = false)
    private Domains domain;

    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL)
    private List<Like> likes = new ArrayList<>();
    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL)
    private List<SavedPaper> savedByUsers = new ArrayList<>();

    @OneToMany(mappedBy = "citingPaper", cascade = CascadeType.ALL)
    private List<Citation> citations = new ArrayList<>();

    @OneToMany(mappedBy = "citedPaper", cascade = CascadeType.ALL)
    private List<Citation> citedBy = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "paper_guest_authors", joinColumns = @JoinColumn(name = "paper_id"))
    private Set<String> guestAuthors = new HashSet<>();

}
