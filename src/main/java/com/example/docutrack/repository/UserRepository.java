package com.example.docutrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.docutrack.types.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
   Optional<User> findByUserEmail(String userEmail);
   Optional<User> findByUserName(String userUserName);
   Optional<User> findById(Integer userId);

   @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.userName = :username")
   Optional<User> findByUsernameWithRoles(@Param("username") String username);
   
   Boolean existsByUserId(Integer userId); 
   Boolean existsByUserName(String userName); 
   Boolean existsByUserEmail(String userEmail);
}