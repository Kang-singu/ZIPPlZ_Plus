package com.example.zipplz_be.Schedule.exception;

public class WorkerNotFoundException extends RuntimeException{
    public WorkerNotFoundException(String message) {
        super(message);
    }

}
