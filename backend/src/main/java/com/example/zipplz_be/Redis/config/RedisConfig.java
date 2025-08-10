package com.example.zipplz_be.Redis.config;

import com.example.zipplz_be.Redis.service.RedisSubscriber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    // 아래 사항을 적어주지 않으면 localhost로 연결해서 오류 발생
    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(redisHost, redisPort);
    }


    /*
    - 역할: Redis에서 발행된 메시지를 수신하고, 해당 메시지를 구독하는 리스너(Subscriber)에게 전달합니다.
    - 사용: 메시지가 Redis 채널에 발행될 때마다, 이 컨테이너는 메시지를 가져와 설정된 메시지 리스너에게 전달합니다.
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter,
            ChannelTopic channelTopic
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, channelTopic);

        return container;
    }

    /*
    - 역할: Redis로부터 메시지를 받고, 실제 메시지 처리 로직이 포함된 Subscriber 클래스의 메서드를 호출합니다.
    - 사용: `MessageListenerAdapter`는 메시지를 수신할 때 `RedisSubscriber` 클래스의 `onMessage` 메서드를 호출합니다.
            이는 실제 메시지 처리를 담당하는 비즈니스 로직을 분리하여 관리할 수 있게 해줍니다
     */
    @Bean
    public MessageListenerAdapter listenerAdapter(RedisSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "onMessage");
    }

    /*
    - 역할: Redis 서버와의 통신을 위한 템플릿을 제공합니다. 이 템플릿을 통해 Redis 서버에 데이터를 쓰거나 읽을 수 있습니다.
    - 사용: 이 템플릿은 Redis에 데이터를 저장하거나 조회할 때 사용됩니다.
            JSON 형식으로 데이터를 교환하기 위해 `Jackson2JsonRedisSerializer`를 사용하여 값의 직렬화 및 역직렬화를 관리합니다.
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        return redisTemplate;
    }

    @Bean
    public ChannelTopic channelTopic() {
        return new ChannelTopic("chatroom");
    }
}
