package com.example.zipplz_be.Openvidu.service;

import com.example.zipplz_be.Chatting.entity.Chatroom;
import com.example.zipplz_be.Chatting.entity.RecordingFile;
import com.example.zipplz_be.Chatting.repository.ChatroomRepository;
import com.example.zipplz_be.Openvidu.repository.RecordingFileRepository;
import com.example.zipplz_be.Global.relation.UserToChatroom;
import com.example.zipplz_be.Global.repository.UserToChatroomRepository;
import io.openvidu.java.client.Recording;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenviduService {
    private final ChatroomRepository chatroomRepository;
    private final UserToChatroomRepository userToChatroomRepository;
    private final RecordingFileRepository recordingFileRepository;

    OpenviduService(ChatroomRepository chatroomRepository, UserToChatroomRepository userToChatroomRepository, RecordingFileRepository recordingFileRepository) {
        this.chatroomRepository = chatroomRepository;
        this.userToChatroomRepository = userToChatroomRepository;
        this.recordingFileRepository = recordingFileRepository;
    }

    @Transactional
    public boolean initializeSession(int chatroomSerial, String newSessionId) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);

        if(chatroom == null) return false;
        chatroom.setSessionId(newSessionId);
        chatroomRepository.save(chatroom);
        return true;
    }


    @Transactional
    public void createConnection(String token,int userSerial, int chatroomSerial) {
        //1. 우선 해당 userSerial과 chatroomSerial을 갖는 객체가 있는지 찾는다.
        //2. 있다면, 업데이트
        //3. 없다면, 새로 생성


            userToChatroomRepository.insertToken(token, userSerial, chatroomSerial);

            //업데이트
            //userToChatroomRepository.updateToken(token, userSerial, chatroomSerial);


    }

    @Transactional
    public Boolean checkToken(int userSerial, Integer chatroomSerial) {
        UserToChatroom userToChatroom = userToChatroomRepository.findByuserSerialAndChatroomSerial(userSerial, chatroomSerial);

        return userToChatroom != null;
    }

    @Transactional
    public String deleteConnection(String sessionId, int userSerial) {
        Chatroom chatroom = chatroomRepository.findBySessionId(sessionId);

        System.out.println(chatroom.getChatroomSerial() + " " + userSerial);


        UserToChatroom userToChatroom = userToChatroomRepository.findToken(chatroom.getChatroomSerial(),userSerial);

        String token = userToChatroom.getToken();

        //userToChatroomRepository.delete(userToChatroom);
        userToChatroomRepository.deleteToken(userSerial, chatroom.getChatroomSerial());
        return token;
    }

    @Transactional
    public void insertRecordingFile(Recording recording, String sessionId) {
        //만약, recording_id로 검색해본 파일이 존재하면 업데이트.
        //존재하지 않으면 새로 만들기
        RecordingFile recordingFile = recordingFileRepository.findByRecordingId(recording.getId());

        if(recordingFile == null) {
            Chatroom chatroom = chatroomRepository.findBySessionId(sessionId);
            recordingFile = new RecordingFile(chatroom, recording);
        } else {
            recordingFile.setUrl(recording.getUrl());
        }

        recordingFileRepository.save(recordingFile);
    }

    @Transactional
    public List<RecordingFile> getRecordingFiles(int chatroomSerial) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);

        return recordingFileRepository.findByChatroomSerial(chatroom);
    }

    @Transactional
    public List<RecordingFile> deleteRecordingFile(int chatroomSerial) {
        Chatroom chatroom = chatroomRepository.findByChatroomSerial(chatroomSerial);

        List<RecordingFile> recordingFileList = recordingFileRepository.findByChatroomSerial(chatroom);

        //db에서 삭제
        for(RecordingFile recordingFile: recordingFileList) {
            recordingFileRepository.deleteByRecordingId(recordingFile.getRecordingId());
        }

        return recordingFileList;

    }

}
