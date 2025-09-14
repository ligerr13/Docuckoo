package com.example.docutrack.types.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "document_notifications_email")
public class DocumentNotificationsEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "email_id")
    private Integer emailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notifications_id", nullable = false)
    private DocumentNotification notification;

    @Column(name = "email_address", nullable = false)
    private String emailAddress;

    @Column(name = "sent_status")
    private String sentStatus;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;
}
