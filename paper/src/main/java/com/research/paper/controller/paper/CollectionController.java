package com.research.paper.controller.paper;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.paper.collection.CollectionCreationRequest;
import com.research.paper.dto.request.paper.collection.CollectionUpdateRequest;

import com.research.paper.dto.response.paper.CollectionResponse;

import com.research.paper.impl.paper.CollectionServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/collection")
@Tag(name = "Collection",description = "Collection API")
public class CollectionController {
    private final Utility utility;
    private final CollectionServiceImpl collectionService;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addCollection(
            @RequestBody
            @Valid
            CollectionCreationRequest request){
        this.collectionService.addCollection(request);
    }
    @PatchMapping("{collection_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateResearchPaper(
            @RequestBody
            @Valid
            CollectionUpdateRequest request,
            @PathVariable(name = "collection_id")
            String collectionId){
        this.collectionService.updateCollection(request,collectionId);
    }
    @GetMapping("/user")
    public ResponseEntity<List<CollectionResponse>> getAllCollectionsByUserId(
            final Authentication principal
    ){
        return ResponseEntity.ok(this.collectionService.getAllCollectionsByUserId(utility.getUserId(principal)));
    }
    @GetMapping("/{collection_id}")
    public ResponseEntity<CollectionResponse> getCollectionById(
            @PathVariable(name = "collection_id")
            String collectionId
    ){
        return ResponseEntity.ok(this.collectionService.getCollectionById(collectionId));
    }
}
