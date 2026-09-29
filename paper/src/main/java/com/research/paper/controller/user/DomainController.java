package com.research.paper.controller.user;

import com.research.paper.dto.request.user.DomainCreationRequest;
import com.research.paper.dto.request.user.DomainUpdateRequest;
import com.research.paper.dto.response.DomainResponse;
import com.research.paper.service.user.DomainService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/domains")
@Tag(name = "Domain",description = "Domain API")
public class DomainController {
    private final DomainService domainService;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addDomain(
            @RequestBody
            @Valid
            DomainCreationRequest request){
        this.domainService.addDomain(request);
    }
    @PatchMapping("/{domain_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateDomain(
            @RequestBody
            @Valid
            DomainUpdateRequest request,
            @PathVariable(name = "domain_id")
            String domainId){
        this.domainService.updateDomain(request,domainId);
    }
    @GetMapping("/{domain_id}")
    public ResponseEntity<DomainResponse> getDomainById(
            @PathVariable(name = "domain_id")
            String domainId
    ){
        return ResponseEntity.ok(this.domainService.getDomainById(domainId));
    }
    @GetMapping("/")
    public ResponseEntity<List<DomainResponse>> getAllDomains(){
        return ResponseEntity.ok(this.domainService.getAllDomains());
    }
}
