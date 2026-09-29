package com.research.paper.dto.response.paper;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionResponse {
    private String name;
    private String description;
    private boolean aiEnabled;
    private List<String> savedPapersTitles;
}
