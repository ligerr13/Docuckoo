package com.example.docutrack.scheduler;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.docutrack.repository.DocumentRepository;
import com.example.docutrack.services.DocumentStatusService;
import com.example.docutrack.types.entities.Document;


@Component
public class ScheduledTasks {
    private final long finalOneMinuteRefreshInterval = 60000;

    private static final org.slf4j.Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private final DocumentRepository documentRepo;
    private final DocumentStatusService statusService;

    public ScheduledTasks(DocumentRepository documentRepo, DocumentStatusService statusService) {
        this.documentRepo = documentRepo;
        this.statusService = statusService;
    }

    @Scheduled(fixedRate = finalOneMinuteRefreshInterval)
    public void runStatusUpdate() {
        log.info("Starting scheduled document status update...");

        List<Document> documents = documentRepo.findAll();
        
        for (Document doc : documents) {
            statusService.updateStateScheduleTask(doc);
        }

        log.info("Document status update finished. Processed {} documents.", documents.size());
    }
}