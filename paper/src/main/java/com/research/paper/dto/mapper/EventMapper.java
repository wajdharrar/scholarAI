package com.research.paper.dto.mapper;

import com.research.paper.dto.request.event.EventCreationRequest;
import com.research.paper.dto.request.event.EventUpdateRequest;
import com.research.paper.dto.response.EventResponse;
import com.research.paper.dto.response.UserResponse;


import com.research.paper.entity.Event;


import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class EventMapper {
    private final UserMapper userMapper;
    public Event toEvent(EventCreationRequest eventCreationRequest){
        return Event.builder()
                .title(eventCreationRequest.getTitle())
                .description(eventCreationRequest.getDescription())
                .eventType(eventCreationRequest.getEventType())
                .eventFormat(eventCreationRequest.getEventFormat())
                .location(eventCreationRequest.getLocation())
                .startDateTime(eventCreationRequest.getStartDateTime())
                .endDateTime(eventCreationRequest.getEndDateTime())
                .registrationDeadline(eventCreationRequest.getRegistrationDeadline())
                .eventType(eventCreationRequest.getEventType())
                .price(eventCreationRequest.getPrice())
                .currency(eventCreationRequest.getCurrency())
                .virtualLink(eventCreationRequest.getVirtualLink())
                .build();
    }
    public void mergeEventInfo(Event event, EventUpdateRequest request) {
        if (StringUtils.isNotBlank(request.getTitle())
                && !event.getTitle().equals(request.getTitle())) {
            event.setTitle(request.getTitle());
        }
        if (StringUtils.isNotBlank(request.getDescription())
                && !event.getDescription().equals(request.getDescription())) {
            event.setDescription(request.getDescription());
        }
        if (StringUtils.isNotBlank(request.getCurrency())
                && !event.getCurrency().equals(request.getCurrency())) {
            event.setCurrency(request.getCurrency());
        }
        if (StringUtils.isNotBlank(request.getLocation())
                && !event.getLocation().equals(request.getLocation())) {
            event.setLocation(request.getLocation());
        }
        if (StringUtils.isNotBlank(request.getVirtualLink())
                && !event.getVirtualLink().equals(request.getVirtualLink())) {
            event.setVirtualLink(request.getVirtualLink());
        }
        if ( request.getStartDateTime()!=null
                && !event.getStartDateTime().equals(request.getStartDateTime())) {
            event.setStartDateTime(request.getStartDateTime());
        }
        if ( request.getEndDateTime()!=null
                && !event.getEndDateTime().equals(request.getEndDateTime())) {
            event.setEndDateTime(request.getEndDateTime());
        }
        if ( request.getRegistrationDeadline()!=null
                && !event.getRegistrationDeadline().equals(request.getRegistrationDeadline())) {
            event.setRegistrationDeadline(request.getRegistrationDeadline());
        }
        if(request.getSpeakerCount()!= 0
                && event.getSpeakerCount() != request.getSpeakerCount()){
            event.setSpeakerCount(request.getSpeakerCount());
        }
        if(request.getPrice()!= 0
                && event.getPrice() != request.getPrice()){
            event.setPrice(request.getPrice());
        }
    }
    public EventResponse toEventResponse(Event event){
        EventResponse eventResponse = EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .registrationDeadline(event.getRegistrationDeadline())
                .eventType(event.getEventType())
                .eventFormat(event.getEventFormat())
                .location(event.getLocation())
                .virtualLink(event.getVirtualLink())
                .imageUrl(event.getImageUrl())
                .price(event.getPrice())
                .currency(event.getCurrency())
                .speakerCount(event.getSpeakerCount())
                .organizer(event.getOrganizer().getFirstname()+" "+event.getOrganizer().getLastname())
                .status(event.getStatus())
                .build();
        Set<UserResponse> attendees = new HashSet<>();
        event.getAttendees().forEach(
                user->attendees.add(this.userMapper.toUserResponse(user))
        );
        eventResponse.setAttendees(attendees);
        return eventResponse;
    }
}
