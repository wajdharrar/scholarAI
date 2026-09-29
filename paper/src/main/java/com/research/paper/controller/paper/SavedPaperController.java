package com.research.paper.controller.paper;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.paper.savedPaper.AddPaperToCollectionRequest;
import com.research.paper.impl.paper.SavedPaperServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/saved_paper")
@Tag(name = "Saved Paper",description = "Saved Paper API")
public class SavedPaperController {
    private final SavedPaperServiceImpl savedPaperService;
    private final Utility utility;

    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addPaperToCollection(
            @RequestBody
            @Valid
            AddPaperToCollectionRequest request,
            final Authentication principal) {
        this.savedPaperService.addPaperToCollection(request, utility.getUserId(principal));

    }

    @PostMapping("/remove")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void removePaperFromCollection(
            @RequestBody
            @Valid
            AddPaperToCollectionRequest request) {
        this.savedPaperService.removePaperFromCollection(request);
    }
}
