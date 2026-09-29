package com.research.paper.controller.feedback;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.feedback.likes.LikeCreationRequest;
import com.research.paper.dto.response.feedback.LikeResponse;
import com.research.paper.impl.feedback.LikeServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/like")
@RequiredArgsConstructor
@Tag(name = "Like",description = "Like API")
public class LikeController {
    private final LikeServiceImpl likeService;
    private final Utility utility;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addLike(
            @RequestBody
            @Valid
            LikeCreationRequest request,
            final Authentication principal){
        this.likeService.addLike(request,utility.getUserId(principal));
    }
    @GetMapping("/{like_id}")
    public ResponseEntity<LikeResponse> getLikeById(
            @PathVariable(name = "like_id")
            String likeId
    ){
        return ResponseEntity.ok(this.likeService.getLikeById(likeId));
    }
    @GetMapping("/{user_id}")
    public ResponseEntity<List<LikeResponse>> getAllLikesByUserId(
            @PathVariable(name = "user_id")
            String userId
    ){
        return ResponseEntity.ok(this.likeService.getAllLikesByUserId(userId));
    }
    @GetMapping("/{paper_id}")
    public ResponseEntity<List<LikeResponse>> getAllComments(
            @PathVariable(name = "paper_id")
            String paperId
    ){
        return ResponseEntity.ok(this.likeService.getAllLikesByPaperId(paperId));
    }
}
