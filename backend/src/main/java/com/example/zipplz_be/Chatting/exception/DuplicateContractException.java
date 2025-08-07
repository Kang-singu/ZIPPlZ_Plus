package com.example.zipplz_be.Chatting.exception;

public class DuplicateContractException extends RuntimeException{
    public DuplicateContractException(String message) {
        super(message);
    }
}
