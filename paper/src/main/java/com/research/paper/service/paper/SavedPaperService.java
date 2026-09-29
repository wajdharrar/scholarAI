package com.research.paper.service.paper;

import com.research.paper.dto.request.paper.savedPaper.AddPaperToCollectionRequest;

public interface SavedPaperService {
    void addPaperToCollection(AddPaperToCollectionRequest addPaperToCollectionRequest, String userId);
    void removePaperFromCollection(AddPaperToCollectionRequest removePaperToCollectionRequest);
}
