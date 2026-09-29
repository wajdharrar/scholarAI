package com.research.paper.service;



import com.research.paper.dto.request.event.EventCreationRequest;
import com.research.paper.dto.request.event.EventUpdateRequest;
import com.research.paper.dto.response.EventResponse;

import java.util.List;

public interface EventService {
    void addEvent(EventCreationRequest paperCreationRequest , String userId);
    void updateEvent(EventUpdateRequest paperUpdateRequest , String paperId);
    void validateEvent(String paperId);
    void rejectEvent(String paperId);
    void deleteEvent(String paperId);
    List<EventResponse> getAllEvents();
    EventResponse getEventById(String paperId);
    public List<EventResponse> getEventByOrganizerId(String organizerId);
}
