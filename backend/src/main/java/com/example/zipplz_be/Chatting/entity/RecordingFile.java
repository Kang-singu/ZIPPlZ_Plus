package com.example.zipplz_be.Chatting.entity;

import io.openvidu.java.client.Recording;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class RecordingFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="recording_file_serial")
    private int recordingFileSerial;
    @ManyToOne
    @JoinColumn(name= "chatroom_serial")
    private Chatroom chatroomSerial;
    @Column(name="url")
    private String url;
    @Column(name="recording_id")
    private String recordingId;
    @Column(name="recording_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp recordingDate;

    public RecordingFile() {
    }

    @Builder
    public RecordingFile(Chatroom chatroom, Recording recording) {
        this.recordingId = recording.getId();
        this.chatroomSerial = chatroom;
        this.url = recording.getUrl();
        this.recordingDate = new Timestamp(recording.getCreatedAt());
    }
}
