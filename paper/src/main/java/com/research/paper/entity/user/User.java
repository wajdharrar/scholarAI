package com.research.paper.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="users")
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "FIRST_NAME", nullable = false)
    private String firstname;
    @Column(name = "LAST_NAME", nullable = false)
    private String lastname;
    @Column(name = "Email", nullable = false,unique = true)
    private String email;
    @Column(name = "PASSWORD", nullable = false)
    private String password;
    @Column(name = "INSTITUTION", nullable = false)
    private String institution;
    @Column(name = "COUNTRY", nullable = false)
    private String country;
    @Column(name = "IMAGE_URL", length = 13981013 )
    private String imageUrl;
    @Column(name = "PAPERS_COUNT")
    private int papersCount;
    @Column(name = "CITATION_COUNT")
    private int citationCount;
    @Column(name = "IS_ENABLED")
    private boolean enabled;
    @Column(name = "IS_LOCKED")
    private boolean locked;
    @Column(name = "IS_EXPIRED")
    private boolean expired;
    @Column(name = "IS_EMAIL_VERIFIED")
    private boolean emailVerified;
    @Column(name = "CREDENTIALS_EXPIRED")
    private boolean credentialsExpired;
    @Column(name = "BIO" , columnDefinition = "TEXT")
    private String bio;
    @CreatedDate
    @Column(name = "CREATED_DATE",updatable = false,nullable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(name = "LAST_MODIFIED_DATE",insertable = false)
    private LocalDateTime lastModifiedDate;
    @ManyToMany(
            cascade = {CascadeType.PERSIST,CascadeType.MERGE},
            fetch = FetchType.EAGER
    )
    @JoinTable(
            name = "USERS_ROLES",
            joinColumns = {
                    @JoinColumn(name = "USER_ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "ROLE_ID")
            }
    )
    private List<Role> roles;
    @ManyToMany(
            cascade = {CascadeType.PERSIST,CascadeType.MERGE},
            fetch = FetchType.EAGER
    )
    @JoinTable(
            name = "USERS_DOMAINS",
            joinColumns = {
                    @JoinColumn(name = "USER_ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "DOMAIN_ID")
            }
    )
    private List<Domains> domains;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(CollectionUtils.isEmpty(this.roles)){
            return List.of();
        }
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .toList();
    }
    @Override
    public String getPassword(){
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !this.credentialsExpired;
    }
}
