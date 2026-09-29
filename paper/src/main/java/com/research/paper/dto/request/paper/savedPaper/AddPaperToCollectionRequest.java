package com.research.paper.dto.request.paper.savedPaper;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddPaperToCollectionRequest {
    private String paperId;
    private String collectionId;
}
