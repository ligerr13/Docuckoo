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
@Table(name = "document_notifications_sms")
public class DocumentNotificationsSms {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "sms_id")
    private Integer smsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notifications_id", nullable = false)
    private DocumentNotification notification;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "sent_status")
    private String sentStatus;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;
}
