package com.research.paper.impl.paper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.research.paper.dto.mapper.paper.ResearchPaperMapper;
import com.research.paper.dto.request.paper.researchPaper.PaperCreationRequest;
import com.research.paper.dto.request.paper.researchPaper.PaperUpdateRequest;
import com.research.paper.dto.response.paper.ResearchPaperResponse;
import com.research.paper.entity.user.Domains;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.enumeration.paper.PaperStatus;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.paper.ResearchPaper;
import com.research.paper.entity.user.User;
import com.research.paper.repository.User.DomainRepository;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.repository.paper.ResearchPaperRepository;
import com.research.paper.service.paper.ResearchPaperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResearchPaperServiceImpl implements ResearchPaperService {
    private final UserRepository userRepository;
    private final ResearchPaperRepository researchPaperRepository;
    private final ResearchPaperMapper researchPaperMapper;
    private final DomainRepository domainRepository;
    @Override
    public void addResearchPaper(PaperCreationRequest paperCreationRequest, String userId) {

        final ResearchPaper researchPaper = new ResearchPaper();

        researchPaper.setTitle(paperCreationRequest.getTitle());
        researchPaper.setAbstractText(paperCreationRequest.getAbstractText());
        researchPaper.setCategory(paperCreationRequest.getCategory());
        researchPaper.setPublicationDate(paperCreationRequest.getPublicationDate());

        // Keywords — was missing entirely
        researchPaper.setKeywords(new HashSet<>(paperCreationRequest.getKeywords()));

        // Save PDF
        MultipartFile pdfFile = paperCreationRequest.getDocument();
        if (pdfFile != null && !pdfFile.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + pdfFile.getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(pdfFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                researchPaper.setDocument(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save PDF file");
            }
        }

        // Save thumbnail
        MultipartFile thumbnail = paperCreationRequest.getThumbnail();
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                String fileName = "thumb_" + System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(thumbnail.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                researchPaper.setThumbnail(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save thumbnail");
            }
        }

        // Guest authors
        researchPaper.setGuestAuthors(new HashSet<>(paperCreationRequest.getGuestAuthors()));

        // Counters and status
        researchPaper.setStatus(PaperStatus.DRAFT);
        researchPaper.setCitationCount(0);
        researchPaper.setCommentCount(0);
        researchPaper.setDownloadCount(0);
        researchPaper.setLikeCount(0);
        researchPaper.setViewCount(0);

        // Domain
        Domains domains = this.domainRepository
                .findByName(paperCreationRequest.getDomainName())
                .orElseThrow(() -> new BusinessException(ErrorCode.DOMAIN_NOT_FOUND));
        researchPaper.setDomain(domains);

        // Corresponding author
        User correspondingAuthor = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTHOR_NOT_FOUND));
        researchPaper.setCorrespondingAuthor(correspondingAuthor);

        // Registered co-authors — empty list is valid (solo paper)
        Set<User> authors = new HashSet<>();
        for (String authorId : paperCreationRequest.getAuthorIds()) {
            User author = userRepository.findById(authorId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.AUTHORS_NOT_FOUND));
            authors.add(author);
        }
        researchPaper.setAuthors(authors);

        researchPaperRepository.save(researchPaper);
    }

    @Override
    public void updateResearchPaper(PaperUpdateRequest paperUpdateRequest, String paperId) {
        ResearchPaper researchPaperSaved = researchPaperRepository.findById(paperId)
                .orElseThrow(()->new BusinessException(ErrorCode.PAPER_NOT_FOUND,paperId));
        this.researchPaperMapper.mergePaperInfo(researchPaperSaved,paperUpdateRequest);
        // Replace document only if a new one is uploaded
        if (paperUpdateRequest.getDocument() != null && !paperUpdateRequest.getDocument().isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + paperUpdateRequest.getDocument().getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(paperUpdateRequest.getDocument().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                researchPaperSaved.setDocument(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save PDF file");
            }
        }
        // Replace thumbnail only if a new one is uploaded
        if (paperUpdateRequest.getThumbnail() != null && !paperUpdateRequest.getThumbnail().isEmpty()) {
            try {
                String fileName = "thumb_" + System.currentTimeMillis() + "_" + paperUpdateRequest.getThumbnail().getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(paperUpdateRequest.getThumbnail().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                researchPaperSaved.setThumbnail(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save thumbnail");
            }
        }
        researchPaperSaved.setKeywords(new HashSet<>(paperUpdateRequest.getKeywords()));

        this.researchPaperRepository.save(researchPaperSaved);
    }

    @Override
    public void validateResearchPaper(String paperId) {
        ResearchPaper researchPaperSaved = researchPaperRepository.findById(paperId)
                .orElseThrow(()->new BusinessException(ErrorCode.PAPER_NOT_FOUND,paperId));
        researchPaperSaved.setStatus(PaperStatus.PUBLISHED);
        researchPaperSaved.setPublicationDate(LocalDate.now());
        researchPaperRepository.save(researchPaperSaved);
    }

    @Override
    public void rejectResearchPaper(String paperId) {
        ResearchPaper researchPaperSaved = researchPaperRepository.findById(paperId)
                .orElseThrow(()->new BusinessException(ErrorCode.PAPER_NOT_FOUND,paperId));
        researchPaperSaved.setStatus(PaperStatus.REJECTED);
        researchPaperRepository.save(researchPaperSaved);
    }

    @Override
    public void deleteResearchPaper(String paperId) {

    }

    @Override
    public List<ResearchPaperResponse> getAllResearchPaper(String id) throws Exception {
            String response = sendWithBuilder(id,5,false,"hybrid");
            List<String> itemIds = new ObjectMapper()
                    .readTree(response)
                    .get("recommendations")
                    .findValuesAsText("item_id");
            List<ResearchPaperResponse> recomendations = new ArrayList<>();
            itemIds.forEach(itemId->{
                recomendations.add(this.researchPaperMapper.toResearchPaperResponse(this.researchPaperRepository.findById(itemId).orElseThrow(()->new RuntimeException("Paper not found"))));
            });
            return recomendations;
    }

    @Override
    public ResearchPaperResponse getResearchPaperById(String paperId) {
        return researchPaperRepository.findById(paperId)
                .map(researchPaperMapper :: toResearchPaperResponse)
                .orElseThrow(()-> new BusinessException(ErrorCode.PAPER_NOT_FOUND,paperId));
    }
    @Override
    public List<ResearchPaperResponse> getResearchPaperByUserId(String userId) {
        return researchPaperRepository.findByUserId(userId)
                .stream().map(researchPaperMapper::toResearchPaperResponse)
                .collect(Collectors.toList());

    }
    // Using a builder pattern for dynamic fields
    public  String sendWithBuilder(String userId, int limit,
                                       boolean includeScores, String strategy) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        String jsonBody = String.format("""
            {
                "user_id": "%s",
                "limit": %d,
                "include_scores": %s,
                "strategy": "%s"
            }
            """, userId, limit, includeScores, strategy);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:5000/api/v1/recommendations"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        System.out.println("Response: " + response.body());

        return response.body();

    }
    public List<ResearchPaperResponse>getAllResearchPaperAdmin(){
        return researchPaperRepository.findAll()
                .stream().map(researchPaperMapper::toResearchPaperResponse)
                .collect(Collectors.toList());

    }
}
