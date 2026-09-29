package com.research.paper.impl;

import com.research.paper.dto.mapper.EventMapper;
import com.research.paper.dto.request.event.EventCreationRequest;
import com.research.paper.dto.request.event.EventUpdateRequest;
import com.research.paper.dto.response.EventResponse;
import com.research.paper.enumeration.ErrorCode;
import com.research.paper.enumeration.event.EventStatus;
import com.research.paper.exception.BusinessException;
import com.research.paper.entity.Event;
import com.research.paper.entity.user.User;
import com.research.paper.repository.EventRepository;
import com.research.paper.repository.User.UserRepository;
import com.research.paper.service.EventService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {
    final private EventMapper eventMapper;
    final private EventRepository eventRepository;
    final private UserRepository userRepository;
    @Override
    @Transactional
    public void addEvent(EventCreationRequest eventCreationRequest, String userId) {

        Event event = this.eventMapper.toEvent(eventCreationRequest);
        event.setStatus(EventStatus.DRAFT);
        event.setCurrentAttendees(0);
        event.setOrganizer(this.userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORGANIZER_NOT_FOUND, userId)));

        // Save image
        MultipartFile image = eventCreationRequest.getImageUrl();
        if (image != null && !image.isEmpty()) {
            try {
                System.out.println("Saving image path");
                String fileName = "event_" + System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                event.setImageUrl(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save event image");
            }
        }

        Set<User> attendees = new HashSet<>();
        eventCreationRequest.getAttendeesIds().forEach(
                id -> attendees.add(this.userRepository.findById(id)
                        .orElseThrow(() -> new BusinessException(ErrorCode.ATTENDEE_NOT_FOUND, id)))
        );
        event.setAttendees(attendees);

        this.eventRepository.save(event);
    }

    @Override
    public void updateEvent(EventUpdateRequest eventUpdateRequest, String eventId) {
        Event eventSaved = this.eventRepository.findById(eventId)
                .orElseThrow(()->new BusinessException(ErrorCode.EVENT_NOT_FOUND));
        this.eventMapper.mergeEventInfo(eventSaved,eventUpdateRequest);
        MultipartFile image = eventUpdateRequest.getImageUrl();
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = "event_" + System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                eventSaved.setImageUrl(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save event image");
            }
        }
        this.eventRepository.save(eventSaved);
    }

    @Override
    public void validateEvent(String eventId) {
        Event eventSaved = eventRepository.findById(eventId)
                .orElseThrow(()->new BusinessException(ErrorCode.EVENT_NOT_FOUND,eventId));
        eventSaved.setStatus(EventStatus.UPCOMING);
        eventRepository.save(eventSaved);
    }

    @Override
    public void rejectEvent(String eventId) {
        Event eventSaved = eventRepository.findById(eventId)
                .orElseThrow(()->new BusinessException(ErrorCode.EVENT_NOT_FOUND,eventId));
        eventSaved.setStatus(EventStatus.CANCELLED);
        eventRepository.save(eventSaved);
    }

    @Override
    public void deleteEvent(String eventId) {

    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream().map(eventMapper :: toEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponse getEventById(String eventId) {
        return eventRepository.findById(eventId)
                .map(eventMapper :: toEventResponse)
                .orElseThrow(()-> new BusinessException(ErrorCode.EVENT_NOT_FOUND,eventId));
    }
    @Override
    public List<EventResponse> getEventByOrganizerId(String organizerId){
        return eventRepository.findByOrganizerId(organizerId)
                .stream().map(eventMapper :: toEventResponse)
                .collect(Collectors.toList());
    }
}
