package com.research.paper.dto.mapper;

import com.research.paper.dto.request.user.DomainCreationRequest;
import com.research.paper.dto.request.user.DomainUpdateRequest;
import com.research.paper.dto.response.DomainResponse;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.user.Domains;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
public class DomainMapper{
    public Domains toDomain(DomainCreationRequest domainCreationRequest){
        return Domains.builder()
                .name(domainCreationRequest.getName())
                .logo(domainCreationRequest.getLogo())
                .build();
    }
    public void mergeDomainInfo(Domains domains, DomainUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getName())
                && !domains.getName().equals(request.getName())) {
            domains.setName(request.getName());
        }
        if (StringUtils.isNotBlank(request.getLogo())
                && !domains.getLogo().equals(request.getLogo())) {
            domains.setLogo(request.getLogo());
        }
    }
    public DomainResponse toDomainResponse(Domains domains){
        return DomainResponse.builder()
                .id(domains.getId())
                .name(domains.getName())
                .logo(domains.getLogo())
                .researchPaperTitles(domains.getPapers().stream().map(ResearchPaper::getTitle).collect(Collectors.toList()))
                .build();
    }
}
