package com.research.paper.controller;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.event.EventCreationRequest;
import com.research.paper.dto.request.event.EventUpdateRequest;
import com.research.paper.dto.response.EventResponse;
import com.research.paper.impl.EventServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/event")
@RequiredArgsConstructor
@Tag(name = "Event",description = "Event API")
public class EventController {
    private final EventServiceImpl eventService;
    private final Utility utility;
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addEvent(
            @ModelAttribute
            @Valid
            EventCreationRequest request,
            final Authentication principal){
        this.eventService.addEvent(request,utility.getUserId(principal));
    }
    @PatchMapping("{event_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateEvent(
            @RequestBody
            @Valid
            EventUpdateRequest request,
            @PathVariable(name = "event_id")
            String eventId){
        this.eventService.updateEvent(request,eventId);
    }
    @PatchMapping("/validate/{event_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void validateEvent(
            @PathVariable(name = "event_id")
            String eventId){
        this.eventService.validateEvent(eventId);
    }
    @PatchMapping("/reject/{event_id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateEvent(
            @PathVariable(name = "event_id")
            String eventId){
        this.eventService.rejectEvent(eventId);
    }
    @GetMapping("/{event_id}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable(name = "event_id")
            String eventId
    ){
        return ResponseEntity.ok(this.eventService.getEventById(eventId));
    }
    @GetMapping("/")
    public ResponseEntity<List<EventResponse>> getAllEvent(){
        return ResponseEntity.ok(this.eventService.getAllEvents());
    }
    @GetMapping("/me")
    public ResponseEntity<List<EventResponse>>getEventByOrganizerId(final Authentication principal){
        return ResponseEntity.ok(this.eventService.getEventByOrganizerId(this.utility.getUserId(principal)));
    }
}
