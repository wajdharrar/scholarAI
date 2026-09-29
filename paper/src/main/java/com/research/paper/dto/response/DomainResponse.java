package com.research.paper.dto.response;


import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainResponse {
    private String id;
    private String name;
    private String logo ;
    private List<String> researchPaperTitles = new ArrayList<>();
}
