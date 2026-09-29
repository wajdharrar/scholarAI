package com.research.paper.enumeration;



import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum ErrorCode {
    USER_NOT_FOUND("USER_NOT_FOUND","User not found with id %s",NOT_FOUND),
    CHANGE_PASSWORD_MISMATCH("CHANGE_PASSWORD_MISMATCH","The two passwords are different",BAD_REQUEST ),
    INVALID_CURRENT_PASSWORD("INVALID_CURRENT_PASSWORD","The password provided and the old password don't match" ,BAD_REQUEST ),
    ACCOUNT_ALREADY_DEACTIVATED("ACCOUNT_ALREADY_DEACTIVATED","The account is already deactivated" ,BAD_REQUEST ),
    ACCOUNT_ALREADY_ACTIVATED("ACCOUNT_ALREADY_ACTIVATED","The account is already activated" ,BAD_REQUEST ),
    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS","This email already exists",BAD_REQUEST),
    PASSWORD_MISMATCH("PASSWORD_MISMATCH","Password and Confirm Password are different" , BAD_REQUEST),
    ERROR_USER_DISABLED("ERROR_USER_DISABLED","This user account is disabled" , UNAUTHORIZED),
    ERROR_BAD_CREDENTIALS("ERROR_BAD_CREDENTIALS","Username and / or password is incorrect" , UNAUTHORIZED),
    USERNAME_NOT_FOUND("USERNAME_NOT_FOUND","Username not found" , NOT_FOUND),
    INTERNAL_EXCEPTION("INTERNAL_EXCEPTION","Internal server error",INTERNAL_SERVER_ERROR),
    AUTHOR_NOT_FOUND("AUTHOR_NOT_FOUND","Corresponding author not found" ,NOT_FOUND ),
    AUTHORS_LIST_EMPTY("AUTHORS_LIST_EMPTY","The other authors list is empty" ,BAD_REQUEST ),
    AUTHORS_NOT_FOUND("AUTHORS_NOT_FOUND","One of the authors is not found" , NOT_FOUND),
    PAPER_NOT_FOUND("PAPER_NOT_FOUND","User not found with id %s" ,NOT_FOUND ),
    ATTENDEE_NOT_FOUND("ATTENDEE_NOT_FOUND","Attendee not found with id %s" ,NOT_FOUND ),
    EVENT_NOT_FOUND("EVENT_NOT_FOUND","Event not found with id %s" ,NOT_FOUND ),
    ORGANIZER_NOT_FOUND("ORGANIZER_NOT_FOUND","Organizer not found with id %s" ,NOT_FOUND ),
    PARENT_COMMENT_NOT_FOUND("PARENT_COMMENT_NOT_FOUND","Parent comment not found with id %s" ,NOT_FOUND ),
    COMMENT_NOT_FOUND("COMMENT_NOT_FOUND", "Comment not found with id %s", NOT_FOUND),
    ERROR_COMMENT_MISMATCH("ERROR_COMMENT_MISMATCH","The parent comment does not belong to the specified research paper." , BAD_REQUEST),
    LIKE_NOT_FOUND("LIKE_NOT_FOUND","Like not found with id %s" ,NOT_FOUND ),
    SAVED_PAPER_NOT_FOUND("SAVED_PAPER_NOT_FOUND","Saved paper not found with id %s" , NOT_FOUND),
    COLLECTION_NOT_FOUND("COLLECTION_NOT_FOUND","Collection not found with id %s" , NOT_FOUND),
    CHAT_SESSION_NOT_FOUND("CHAT_SESSION_NOT_FOUND","Chat session not found with id %s" , NOT_FOUND),
    CHAT_MESSAGE_NOT_FOUND("CHAT_MESSAGE_NOT_FOUND","Chat message not found with id %s" , NOT_FOUND),
    DOMAIN_NOT_FOUND("DOMAIN_NOT_FOUND","Domain not found with id %s" , NOT_FOUND );


    private final String code;
    private final String defaultMessage;
    //i18n | l10n
    private final HttpStatus status;
    ErrorCode(final String code,
              final String defaultMessage,
              final HttpStatus status){
        this.code=code;
        this.defaultMessage=defaultMessage;
        this.status=status;
    }
}
