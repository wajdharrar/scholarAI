package com.research.paper.impl.paper;

import com.research.paper.dto.mapper.paper.CollectionMapper;
import com.research.paper.dto.request.paper.collection.CollectionCreationRequest;
import com.research.paper.dto.request.paper.collection.CollectionUpdateRequest;
import com.research.paper.dto.response.paper.CollectionResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.paper.Collection;
import com.research.paper.repository.paper.CollectionRepository;
import com.research.paper.service.paper.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {
    private final CollectionMapper collectionMapper;
    private final CollectionRepository collectionRepository;
    @Override
    public void addCollection(CollectionCreationRequest collectionCreationRequest) {
        Collection collection = new Collection();
        collection = collectionMapper.toCollection(collectionCreationRequest);
        collectionRepository.save(collection);
    }

    @Override
    public void updateCollection(CollectionUpdateRequest collectionUpdateRequest, String collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND,collectionId));
        collectionMapper.mergeCollectionInfo(collection,collectionUpdateRequest);
        this.collectionRepository.save(collection);
    }

    @Override
    public void deleteCollection(String collectionId) {

    }

    @Override
    public List<CollectionResponse> getAllCollectionsByUserId(String userId) {
        return collectionRepository.findAllCollectionsByUserId(userId)
                .stream()
                .map(collectionMapper :: toCollectionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CollectionResponse getCollectionById(String collectionId) {
        return collectionMapper.toCollectionResponse(collectionRepository.findById(collectionId)
                .orElseThrow(()-> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND,collectionId)));
    }
}
