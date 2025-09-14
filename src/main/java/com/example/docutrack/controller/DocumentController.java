package com.example.docutrack.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.docutrack.repository.DocumentRepository;
import com.example.docutrack.repository.DocumentStatusHistoryRepository;
import com.example.docutrack.repository.DocumentStatusTypeRepository;
import com.example.docutrack.services.AuthService;
import com.example.docutrack.services.DocumentStatusService;
import com.example.docutrack.types.dtos.CreateNewDocumentResponseDTO;
import com.example.docutrack.types.dtos.DeleteDocumentResponseDTO;
import com.example.docutrack.types.dtos.DocumentStatusChangeResponseDTO;
import com.example.docutrack.types.dtos.DocumentStatusHistoryResponse;
import com.example.docutrack.types.dtos.DocumentStatusUpdateDTO;
import com.example.docutrack.types.entities.Document;
import com.example.docutrack.types.entities.DocumentStatusHistory;
import com.example.docutrack.types.entities.DocumentStatusType;
import com.example.docutrack.types.entities.User;
import com.example.docutrack.types.enums.EStatus;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired(required = true)
    private AuthService authService;

    @Autowired(required = true)
    private DocumentRepository documentRepository;
    
    @Autowired(required = true)
    private DocumentStatusTypeRepository documentStatusTypeRepository;

    @Autowired(required = true)
    private DocumentStatusHistoryRepository documentStatusRepository;

    @Autowired
    private DocumentStatusService documentStatusService;

    @GetMapping("/my-documents")
    public ResponseEntity<Map<String, Object>> getDocuments() {
        
        User currentUser = authService.getCurrentUser();

        List<Document> userDocuments = documentRepository.findByUserUserId(currentUser.getUserId());
        
        if (userDocuments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        Map<String, Object> response = new LinkedHashMap<>();

        List<Map<String, Object>> documents = userDocuments.stream()
            .map(document -> {
                List<DocumentStatusHistoryResponse> statusList = documentStatusRepository
                    .findByDocumentId(document.getId())
                    .stream()
                    .map(DocumentStatusHistoryResponse::new)
                    .toList();

                    Map<String, Object> docMap = new LinkedHashMap<>();
                    
                    docMap.put("title", document.getTitle());
                    docMap.put("status", statusList);
                    docMap.put("documentId", document.getId());
                    docMap.put("createdAt", document.getDocumentCreatedAt());
                    docMap.put("expiresAt", document.getDocumentExpiresAt());

                    return docMap;
            })
            .toList();

        response.put("data", Map.of("documents", documents));


        return ResponseEntity.ok(response);
    }


    @PostMapping("/new")
    public ResponseEntity<CreateNewDocumentResponseDTO> createDocument(
        @RequestBody DocumentRequest documentRequest){
        try {
            User currentUser = authService.getCurrentUser();
            
            Document savedDocument = documentRepository.save(
                Document.fromData(
                    currentUser,                                    // User who owns this Document
                    documentRequest.getTitle(),                     // Document Title
                    LocalDateTime.now(),                            // Document Created-at 
                    (LocalDateTime) documentRequest.getExpiresAt()  // Document Expires-at
                )
            );

            DocumentStatusHistory savedDocumentStatusHistory = documentStatusRepository.save(
                    DocumentStatusHistory.fromData(
                    savedDocument, 
                    (DocumentStatusType) documentStatusTypeRepository.findByName(EStatus.UPTODATE)
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Something went wrong while initializing role: " + EStatus.UPTODATE + " for the user."
                    )),
                    null
                )
            );
            
            CreateNewDocumentResponseDTO responseDto = new CreateNewDocumentResponseDTO(
                savedDocument.getId(),
                savedDocument.getTitle(),
                savedDocumentStatusHistory.getStatusType(),
                savedDocument.getDocumentExpiresAt().toString()
            );

            return ResponseEntity.ok(responseDto);
            
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<?> deleteDocument(
        @RequestParam Integer id) {
        try {
            User currentUser = authService.getCurrentUser();

            Document documentToDelete = documentRepository.findByIdAndUserUserId(id, currentUser.getUserId());

            if (documentToDelete == null) {
                return ResponseEntity.notFound().build();
            }

            documentRepository.delete(documentToDelete);

            DeleteDocumentResponseDTO response = new DeleteDocumentResponseDTO(
                documentToDelete.getId(), 
                documentToDelete.getTitle()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateDocumentStatus(
        @PathVariable Integer id,
        @RequestBody DocumentStatusUpdateDTO updateDto){
        try {
            User currentUser = authService.getCurrentUser();
            Document documentToSetState = documentRepository.findByIdAndUserUserId(id, currentUser.getUserId());

            if (documentToSetState == null) {
                return ResponseEntity.notFound().build();
            }

            documentStatusService.changeStatus(
                documentToSetState,
                updateDto.getStatusName(),
                updateDto.getComment()
            );

            DocumentStatusChangeResponseDTO responseDto =
                new DocumentStatusChangeResponseDTO(documentToSetState.getId(), updateDto.getStatusName());

            Map<String, Object> responseWrapper = new HashMap<>();
            responseWrapper.put("data", responseDto);

 
            return ResponseEntity.ok(responseWrapper);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}