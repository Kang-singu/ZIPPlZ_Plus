package com.example.zipplz_be.Global.config;

import com.example.zipplz_be.Openvidu.handler.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

// WebSocketMessageBrokerConfigurer를 상속받아 STOMP로 메시지 처리 방법을 구성
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    // 클라이언트에서 WebSocket에 접속할 수 있는 endpoint를 지정한다
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")     // ex. ws://localhost:5000/ws
                .setAllowedOrigins("*");
    }

    // 파일 최대 크기 설정
    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(10485760);  // 10 MB
    }

    // 메세지를 중간에서 라우팅할 때 사용하는 메세지 브로커를 구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        /*
        enableSimpleBroker에서는 해당 주소를 구독하는 클라이언트에 메시지를 보냄
        즉, 인자에는 구독 요청의 prefix를 넣고, 클라이언트에서 1번 채널을 구독하고자 할 때는 /sub/1 형식과 같은 규칙을 따라야 함
         */
        registry.enableSimpleBroker("/sub");

        /*
        setApplicationDestinationPrefixes에는 메시지 발행 요청의 prefix를 넣음
        즉, /pub로 시작하는 메시지만 해당 Broker에서 받아서 처리
         */
        registry.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }

}
