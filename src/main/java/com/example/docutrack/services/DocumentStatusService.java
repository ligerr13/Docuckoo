package com.example.docutrack.services;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.example.docutrack.repository.DocumentStatusHistoryRepository;
import com.example.docutrack.repository.DocumentStatusTypeRepository;
import com.example.docutrack.types.entities.Document;
import com.example.docutrack.types.entities.DocumentStatusHistory;
import com.example.docutrack.types.entities.DocumentStatusType;
import com.example.docutrack.types.enums.EStatus;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentStatusService {

    private final DocumentStatusHistoryRepository historyRepo;
    private final DocumentStatusTypeRepository typeRepo;

    public Optional<DocumentStatusHistory> getCurrentStatus(Document document) {
        return historyRepo.findByDocumentId(document.getId());
    }

    @Transactional
    public void changeStatus(Document document, EStatus statusName, String comment) {
        DocumentStatusType statusType = typeRepo.findByName(statusName)
            .orElseThrow(() -> new IllegalArgumentException(
                "No status has been found with the name: " + statusName
            )
        );

        Optional<DocumentStatusHistory> latestOpt = getCurrentStatus(document);

        if (latestOpt.isPresent()) { //Is not null
            DocumentStatusHistory history = latestOpt.get();

            if (DocumentStatusHistory.isEqual(history.getStatusType().getName(), statusName)){ 
                return;
            }

            // Update the records

            history.setStatusType(statusType);
            history.setComment(comment);
            history.setStatusChangedAt(LocalDateTime.now());

            historyRepo.save(history);

        } else {
            DocumentStatusHistory newHistory = DocumentStatusHistory.fromData(
                document,
                statusType,
                comment
            );

            historyRepo.save(newHistory);
        }
    }


    @Transactional
    public void updateStateScheduleTask(Document document) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiry = document.getDocumentExpiresAt();

        EStatus newStatus;
        String comment = null;

        if (expiry.isBefore(now)) {
            newStatus = EStatus.EXPIRED;
            comment = "Document expired on " + expiry;
        } else if (expiry.isBefore(now.plusDays(30))) {
            newStatus = EStatus.NEAREXPIRY;
            comment = "Document will expire on " + expiry;
        } else {
            newStatus = EStatus.UPTODATE;
        }

        changeStatus(document, newStatus, comment);
    }

}
