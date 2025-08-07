package com.example.zipplz_be.Global.controller;

import com.example.zipplz_be.User.dto.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class MainController {

    @GetMapping("/")
    public String mainP() {
        Authentication authentication  = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        int userSerial = customUserDetails.getUserSerial();
        String role = customUserDetails.getRole();

        return "main Controller -> userSerial : " + userSerial + " | role : " + role;
    }
}
