package com.example.zipplz_be.Chatting.controller;

import com.example.zipplz_be.Chatting.dto.ChatroomDetailDTO;
import com.example.zipplz_be.Chatting.dto.ChatroomListDTO;
import com.example.zipplz_be.Chatting.dto.CreateChatroomDTO;
import com.example.zipplz_be.Chatting.dto.CreateChatroomResponseDTO;
import com.example.zipplz_be.Chatting.service.ChatroomService;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/chatroom")
public class ChatroomController {

    private final ChatroomService chatroomService;
    private int chatroomSerial;

    @PostMapping("")
    public ResponseEntity<ResponseDTO> createChatroom(Authentication authentication, @RequestBody CreateChatroomDTO createChatroomDTO) {

        ResponseDTO responseDTO;
        HttpStatus status;

        try {
            int userSerial = getUserSerial(authentication);
            int chatroomSerial = chatroomService.createChatroom(userSerial, createChatroomDTO);
            if (chatroomSerial < 0) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "채팅방 생성 실패");
            } else {
                status = HttpStatus.OK;
                CreateChatroomResponseDTO createChatroomResponseDTO = CreateChatroomResponseDTO.builder().chatroomSerial(chatroomSerial).build();
                responseDTO = new ResponseDTO<>(status.value(), "채팅방 생성 성공", createChatroomResponseDTO);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    @GetMapping("")
    public ResponseEntity<ResponseDTO> getChatroomList(Authentication authentication, Pageable pageable) {
    
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            List<ChatroomListDTO> chatroomList = chatroomService.getChatroomList(getUserSerial(authentication), getUserRole(authentication), pageable);
            if (chatroomList == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "채팅방 목록 조회 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "채팅방 목록 조회 성공", chatroomList);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
    
        return new ResponseEntity<>(responseDTO, status);
    }

    @GetMapping("/{chatroomSerial}")
    public ResponseEntity getChatroomDetail(Authentication authentication, @PathVariable int chatroomSerial) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            ChatroomDetailDTO chatroomDetail = chatroomService.getChatroomDetail(chatroomSerial, getUserSerial(authentication));
            if (chatroomDetail == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "메세지들 조회 실패");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "메세지들 조회 성공", chatroomDetail);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @GetMapping("/{chatroomSerial}/name")
    public ResponseEntity getOtherUserName(Authentication authentication, @PathVariable int chatroomSerial) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            String name = chatroomService.getOtherUserName(chatroomSerial, getUserSerial(authentication));

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "메세지들 조회 성공", name);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    @PatchMapping("/{chatroomSerial}")
    public ResponseEntity deleteChatRoom(Authentication authentication, @PathVariable int chatroomSerial) {
        ResponseDTO responseDTO;
        HttpStatus status;
        try {
            chatroomService.deleteChatroom(chatroomSerial, getUserSerial(authentication));

            status = HttpStatus.OK;
            // responseDTO 생성
            responseDTO = new ResponseDTO<>(status.value(), "채팅룸 INACTIVE");

        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    public int getUserSerial(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getUserSerial();
    }

    public String getUserRole(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getRole();
    }
}
