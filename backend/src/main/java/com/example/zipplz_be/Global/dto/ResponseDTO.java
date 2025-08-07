package com.example.zipplz_be.Global.dto;

import com.example.zipplz_be.Global.util.NetworkUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ResponseDTO<T> {
    private Conn conn;
    private Proc proc;
    private T data;

    public ResponseDTO() {
        this.conn = new Conn();
        this.proc = new Proc();
    }

    public ResponseDTO(int errorCode, String errorMessage) {
        this.conn = new Conn();
        this.proc = new Proc(errorCode, errorMessage);
    }

    public ResponseDTO(int code, String message, T data) {
        this.conn = new Conn();
        this.proc = new Proc(code, message);
        this.data = data;
    }


    public static class Conn {
        private boolean networkConnected;

        public Conn() {
            this.networkConnected = NetworkUtil.isNetworkConnected();
        }

        // Getter and Setter methods
        public boolean isNetworkConnected() {
            return networkConnected;
        }

        public void setNetworkConnected(boolean networkConnected) {
            this.networkConnected = networkConnected;
        }
    }

    @Getter
    @Setter
    public static class Proc {
        private int code;
        private String message;

        public Proc() {
            this.code = HttpStatus.OK.value(); // 기본값으로 에러 코드 200 (정상)으로 설정
            this.message = "Success";
        }

        public Proc(int errorCode, String errorMessage) {
            this.code = errorCode;
            this.message = errorMessage;
        }
    }
}
