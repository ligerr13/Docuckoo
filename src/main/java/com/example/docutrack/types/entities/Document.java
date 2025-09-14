package com.example.docutrack.types.entities;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;
    
    @Column(name = "document_title")
    private String title;

    @Column(name = "document_created_at", nullable = false)
    private LocalDateTime documentCreatedAt;

    @Column(name = "document_expires_at")
    private LocalDateTime documentExpiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_status_type_id")
    private DocumentStatusType currentStatus;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "notification_id", referencedColumnName = "notifications_id")
    private DocumentNotification notification;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle(){
        return this.title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public LocalDateTime getDocumentCreatedAt() {
        return documentCreatedAt;
    }

    public void setDocumentCreatedAt(LocalDateTime documentCreatedAt) {
        this.documentCreatedAt = documentCreatedAt;
    }

    public LocalDateTime getDocumentExpiresAt() {
        return documentExpiresAt;
    }

    public void setDocumentExpiresAt(LocalDateTime documentExpiresAt) {
        this.documentExpiresAt = documentExpiresAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DocumentNotification getNotification() {
        return notification;
    }

    public void setNotification(DocumentNotification notification) {
        this.notification = notification;
    }

    static public Document fromData(
        User currentUser, 
        String title, 
        LocalDateTime createdAt, 
        LocalDateTime expiresAt
    ){
        Document newDocument = new Document();

        newDocument.setUser(currentUser);
        newDocument.setTitle(title);
        newDocument.setDocumentCreatedAt(createdAt);
        newDocument.setDocumentExpiresAt(expiresAt);

        return newDocument;
    }
    
}

