package com.research.paper.service.user;

import com.research.paper.dto.request.user.DomainCreationRequest;
import com.research.paper.dto.request.user.DomainUpdateRequest;
import com.research.paper.dto.response.DomainResponse;


import java.util.List;

public interface DomainService {
    void addDomain(DomainCreationRequest domainCreationRequest);
    void updateDomain(DomainUpdateRequest domainUpdateRequest , String domainId);
    void deleteDomain(String domainId);
    DomainResponse getDomainById(String domainId);
    List<DomainResponse> getAllDomains();
}
