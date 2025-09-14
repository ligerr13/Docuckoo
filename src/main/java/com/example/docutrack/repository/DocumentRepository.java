package com.example.docutrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.docutrack.types.entities.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer>{
    List<Document> findByUserUserId(Integer userId);
    Document findByIdAndUserUserId(Integer id, Integer userId);

    // @Transactional
    // long deleteByUserIdAndIdIn(Integer userId, List<Integer> documentIds);
}