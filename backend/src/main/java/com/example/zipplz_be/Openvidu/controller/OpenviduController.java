package com.example.zipplz_be.Openvidu.controller;

import com.example.zipplz_be.Chatting.entity.RecordingFile;
import com.example.zipplz_be.Openvidu.service.OpenviduService;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.JWT.util.JWTUtil;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.View;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/openvidu")
public class OpenviduController {
    private final OpenviduService openviduService;
    private final View error;
    JWTUtil jwtUtil;

    public OpenviduController(OpenviduService openviduService, JWTUtil jwtUtil, View error) {
        this.openviduService = openviduService;
        this.jwtUtil = jwtUtil;
        this.error = error;
    }


    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    //세션 생성
    @PostMapping("/api/sessions")
    public ResponseEntity<ResponseDTO<?>> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        System.out.println("세션 생성 요청 받음!!!!!!!!!");
        System.out.println("세션 생성 진짜 요청 받음!!!");
        try {
            //openvidu.fetch();
            System.out.println("try문 들어옴!!!");

            // if (params.get("chatroomSerial") == null || params.get("customSessionId") == null || params.get("customSessionId") == "") {
            //     status = HttpStatus.BAD_REQUEST;
            //     responseDTO = new ResponseDTO<>(status.value(), "필수 항목을 입력해주세요.");
            // } else {
                
                System.out.println("채팅방 유효검사 통과!!!");
                int crSerial = (Integer) params.get("chatroomSerial");
                params.remove("chatroomSerial");
                System.out.println("params JSON = " + new com.google.gson.Gson().toJson(params));
                SessionProperties properties = SessionProperties.fromJson(params).build();
                System.out.println(properties.toString());

                Session session = openvidu.createSession(properties);
                
                System.out.println("세션 생성 성공!!!" + session.getSessionId());

                boolean flag = openviduService.initializeSession(crSerial, session.getSessionId());

                if (!flag) {
                    status = HttpStatus.NOT_FOUND;
                    responseDTO = new ResponseDTO<>(status.value(), "유효하지 않은 채팅방 번호");
                } else {
                    
                    System.out.println("세션 생성 리턴 간다!!!");
                    status = HttpStatus.OK;
                    responseDTO = new ResponseDTO<>(status.value(), "응답 성공", session.getSessionId());
                }
            //}

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("예외 발생 상세 메시지: " + e.getMessage());

            // OpenViduHttpException일 경우
            if (e instanceof OpenViduHttpException) {
                OpenViduHttpException ove = (OpenViduHttpException) e;
                System.out.println("OpenVidu 서버 응답 상태코드 = " + ove.getStatus());
                // 서버에서 보내는 JSON 메시지를 그냥 getMessage()로 확인
                System.out.println("OpenVidu 서버 응답 메시지/바디 = " + ove.getMessage());
            }

            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //세션 정보 조회
    @PostMapping("/api/sessions/info")
    public ResponseEntity<ResponseDTO<?>> getSessionInfo(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<Session> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            Session session = openvidu.getActiveSession((String) params.get("sessionId"));

            if (session == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "세션이 비활성화되었습니다! 갱신하세요.");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "조회 성공", session);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }


    //해당 클라이언트를 세션에서 연결 삭제
    @DeleteMapping("/api/sessions")
    public ResponseEntity<ResponseDTO<?>> deleteSession(Authentication authentication, @RequestBody(required = false) Map<String, Object> params, HttpServletRequest request)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<String> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        //1. 해당 세션 id에 해당하는 채팅방 번호를 가져온다.
        //2. 해당 채팅방 번호와 현재 로그인된 유저를 묶어 토큰을 찾는다.
        //3. 해당 레코드를 delete한다.
        //4. 해당 세션에서 해당 커넥션을 삭제한다.

        try {
            //토큰을 받고, 해당 토큰을 가진 connection 객체를 가져와서 그 연결을 session에서 해제한다.
            Session session = openvidu.getActiveSession((String) params.get("sessionId"));
            String connectionId = "";

            //세션이 없으면 404
            if (session == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "세션이 존재하지 않음");
            } else {
                CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
                int userSerial = customUserDetails.getUserSerial();

                String token = openviduService.deleteConnection((String) params.get("sessionId"), userSerial);

                //세션의 연결된 유저 리스트 중 해당 토큰과 똑같은 값을 가진 커넥션 아이디를 뽑아와야 한다!!
                List<Connection> connectionList = session.getConnections();

                for (Connection c : connectionList) {
                    if (c.getToken().equals(token)) {
                        connectionId = c.getConnectionId();
                        break;
                    }
                }

                if (connectionId.isEmpty()) {
                    status = HttpStatus.NOT_FOUND;
                    responseDTO = new ResponseDTO<>(status.value(), "해당 토큰을 가진 커넥션이 존재하지 않음");
                } else {
                    session.forceDisconnect(connectionId);

                    status = HttpStatus.OK;
                    responseDTO = new ResponseDTO<>(status.value(), "삭제 완료");
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //connection 생성, 토큰 발급
    @PostMapping("/api/sessions/connections")
    public ResponseEntity<ResponseDTO<String>> createConnection(Authentication authentication, @RequestBody(required = false) Map<String, Object> params, HttpServletRequest request)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<String> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            Session session = openvidu.getActiveSession((String) params.get("sessionId"));

            if (session == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "그런 세션은 없습니다.");
            } else {
                CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
                int userSerial = customUserDetails.getUserSerial();

                Boolean flag = openviduService.checkToken(userSerial, (Integer) params.get("chatroomSerial"));

                //해당 유저 토큰이 db에 없다면?
                if(flag == false) {
                    //발급
                    ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
                    Connection connection = session.createConnection(properties);

                    //토큰 암호화 필요?
                    openviduService.createConnection(connection.getToken(), userSerial, (Integer) params.get("chatroomSerial"));

                    status = HttpStatus.OK;
                    responseDTO = new ResponseDTO<>(status.value(), "응답 성공", connection.getToken());
                }
                else {
                    status = HttpStatus.BAD_REQUEST;
                    responseDTO = new ResponseDTO<>(status.value(), "이미 토큰이 존재합니다.");
                }
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //녹화 시작
    @PostMapping("/api/sessions/recording")
    public ResponseEntity<ResponseDTO<?>> startRecording(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;
        try {
            Session session = openvidu.getActiveSession((String) params.get("sessionId"));

            if (session == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "그런 세션은 없습니다.");
            } else {
                //String recordingFileName = session.getSessionId() +
                       // LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

                //video, audio 둘 다 녹음, composed로, best-fit으로 디폴트 설정됨
                RecordingProperties recordingProperties = new RecordingProperties.Builder()
                        .hasAudio(true)
                        .hasVideo(true)
                        .name("nsdjifnisndfisjndfj")
                       // .name(recordingFileName)
                        .build();


                Recording recording = openvidu.startRecording(session.getSessionId(), recordingProperties);


                System.out.println("녹화 시작 확인: " + recording.getCreatedAt());

                //시작 시 채팅방 연번과 recording_id, 시작시간 모두 넣어두기
                openviduService.insertRecordingFile(recording, (String) params.get("sessionId"));

                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "녹화 시작 완료", recording);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());

            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    //녹화 종료
    @PostMapping("/api/sessions/recording/stop")
    public ResponseEntity<ResponseDTO<?>> stopRecording(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            String recordingId = (String) params.get("recordingId");
            Recording recording = openvidu.stopRecording(recordingId);

            //갱신된 URL 저장 필요
            openviduService.insertRecordingFile(recording, null);

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "녹화 중지 완료", recording);

        } catch (Exception e) {
            if (e.getMessage().equals("404")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "id 존재하지 않음");
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
            }
        }

        return new ResponseEntity<>(responseDTO, status);
    }


    //채팅방별 녹화된 파일 조회
    //채팅방 연번 받으면, 그거에 대한 recording 객체들을 다 가져온다!!
    @GetMapping("/api/sessions/recording/{chatroomSerial}")
    public ResponseEntity<ResponseDTO<?>> getRecording(@PathVariable("chatroomSerial") int chatroomSerial)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;

        try {
            //채팅방 번호 전달하면 해당 번호에 맞는 recording 객체들 모두 가져옴!!
            List<RecordingFile> recordingFileList = openviduService.getRecordingFiles(chatroomSerial);
            List<Recording> recordingList = new ArrayList<Recording>();


            for(RecordingFile recordingFile : recordingFileList) {
                recordingList.add(openvidu.getRecording(recordingFile.getRecordingId()));
            }

            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "조회 완료", recordingList);
        } catch (Exception e) {
            if (e.getMessage().equals("404")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "id 존재하지 않음");
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
            }
        }

        return new ResponseEntity<>(responseDTO, status);
    }


    //채팅방별 녹화된 파일 일괄 삭제
    @DeleteMapping("/api/sessions/recording/{chatroomSerial}")
    public ResponseEntity<ResponseDTO<?>> deleteRecording(@PathVariable("chatroomSerial") int chatroomSerial)
            throws OpenViduJavaClientException, OpenViduHttpException {
        ResponseDTO<?> responseDTO;
        HttpStatus status = HttpStatus.ACCEPTED;
        try {
            List<RecordingFile> recordingFileList = openviduService.deleteRecordingFile(chatroomSerial);

            for(RecordingFile recordingFile : recordingFileList) {
                openvidu.deleteRecording(recordingFile.getRecordingId());
            }

            status = HttpStatus.NO_CONTENT;

            responseDTO = new ResponseDTO<>(status.value(), "삭제 완료!!");
        } catch (Exception e) {
            if (e.getMessage().equals("404")) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "id 존재하지 않음");
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
            }
        }

        return new ResponseEntity<>(responseDTO, status);
    }

}
