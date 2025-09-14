package com.example.docutrack.types.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "document_notifications")
public class DocumentNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "notifications_id")
    private Integer notificationsId;

    @Column(name = "notify_before_expire", nullable = false)
    private boolean notifyBeforeExpire;

    @Column(name = "notify_on_status_change", nullable = false)
    private boolean notifyOnStatusChange;

    @Column(name = "notify_before_days")
    private LocalDateTime notifyBeforeDays;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL)
    private List<DocumentNotificationsEmail> emails = new ArrayList<>();

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL)
    private List<DocumentNotificationsSms> smsMessages = new ArrayList<>();
}

