package com.example.zipplz_be.Portfolio.exception;

public class PortfolioNotFoundException extends RuntimeException{
    public PortfolioNotFoundException(String message) {
        super(message);
    }
}
