package com.example.zipplz_be.Global.exception;

public class LocalNotFoundException extends RuntimeException{
    public LocalNotFoundException(String message) {
        super(message);
    }
}
