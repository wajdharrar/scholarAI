package com.research.paper.service.paper;

import com.research.paper.dto.request.paper.collection.CollectionCreationRequest;
import com.research.paper.dto.request.paper.collection.CollectionUpdateRequest;
import com.research.paper.dto.response.paper.CollectionResponse;

import java.util.List;

public interface CollectionService {
    void addCollection(CollectionCreationRequest collectionCreationRequest);
    void updateCollection(CollectionUpdateRequest collectionUpdateRequest , String collectionId);
    void deleteCollection(String collectionId);
    List<CollectionResponse> getAllCollectionsByUserId(String userId);
    CollectionResponse getCollectionById(String collectionId);
}
