package com.example.zipplz_be.Openvidu.repository;

import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Chatting.entity.RecordingFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordingFileRepository extends JpaRepository<RecordingFile, Integer> {
    RecordingFile findByRecordingId(String recordingId);
    List<RecordingFile> findByChatroomSerial(Chatroom chatroomSerial);

    void deleteByRecordingId(String recordingId);
}
