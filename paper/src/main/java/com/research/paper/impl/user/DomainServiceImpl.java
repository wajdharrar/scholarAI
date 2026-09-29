package com.research.paper.impl.user;

import com.research.paper.dto.mapper.DomainMapper;
import com.research.paper.dto.request.user.DomainCreationRequest;
import com.research.paper.dto.request.user.DomainUpdateRequest;
import com.research.paper.dto.response.DomainResponse;
import com.research.paper.entity.user.Domains;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.repository.User.DomainRepository;
import com.research.paper.service.user.DomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DomainServiceImpl implements DomainService {

    final private DomainRepository domainRepository;
    final private DomainMapper domainMapper;

    @Override
    public void addDomain(DomainCreationRequest domainCreationRequest) {
        this.domainRepository.save(this.domainMapper.toDomain(domainCreationRequest));
    }

    @Override
    public void updateDomain(DomainUpdateRequest domainUpdateRequest , String domainId) {
        Domains domainSaved = this.domainRepository.findById(domainId)
                .orElseThrow(()-> new BusinessException(ErrorCode.DOMAIN_NOT_FOUND,domainId));
        this.domainMapper.mergeDomainInfo(domainSaved,domainUpdateRequest);
        this.domainRepository.save(domainSaved);
    }

    @Override
    public void deleteDomain(String domainId) {

    }

    @Override
    public DomainResponse getDomainById(String domainId) {
        return this.domainMapper.toDomainResponse(
                this.domainRepository.findById(domainId)
                        .orElseThrow(()-> new BusinessException(ErrorCode.USER_NOT_FOUND,domainId))
        );
    }

    @Override
    public List<DomainResponse> getAllDomains() {
        return this.domainRepository.findAll()
                .stream()
                .map(domainMapper::toDomainResponse)
                .collect(Collectors.toList());
    }
}
