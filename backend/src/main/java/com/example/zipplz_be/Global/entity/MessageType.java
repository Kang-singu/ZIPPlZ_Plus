package com.example.zipplz_be.Global.entity;

public enum MessageType {
    TALK,
    IMAGE,
    FILE,
    UNREAD_MESSAGE_COUNT_ALARM,
    CONTRACT,               // 계약서 초안 요청, 수정 요청 (도장 안찍힘)
    CONTRACT_ACCEPTED,      // 계약서 초안, 수정 승인 (Accepted 도장)
    CONTRACT_REJECTED       // 계약서 초안, 수정 거절 (Rejected 도장)
}
