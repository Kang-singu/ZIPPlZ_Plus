package com.example.zipplz_be.Security.config;

import com.example.zipplz_be.Cors.config.CorsConfig;
import com.example.zipplz_be.JWT.filter.JWTFilter;
import com.example.zipplz_be.JWT.filter.LoginFilter;
import com.example.zipplz_be.JWT.util.JWTUtil;
import com.example.zipplz_be.OAuth2.handler.OAuth2SuccessHandler;
import com.example.zipplz_be.User.repository.UserRepository;
import com.example.zipplz_be.User.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsUtils;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CorsConfig corsConfig;

    public SecurityConfig(CorsConfig corsConfig, AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, CustomOAuth2UserService oAuth2UserService, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.corsConfig = corsConfig;
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.oAuth2UserService = oAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, UserRepository userRepository) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                        .anyRequest().permitAll());
        // OAuth2 설정
        http.oauth2Login(oauth ->
                oauth.userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
        );

        // JWT 관련 설정
        http.addFilterAt(new JWTFilter(jwtUtil), LoginFilter.class)
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class);

        // CORS 설정
        http.cors(cors -> cors.configurationSource(corsConfig.corsFilter()));
        // http.cors(cors -> cors.configurationSource(request -> {
        //     CorsConfiguration configuration = new CorsConfiguration();
        //     configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://zipplz.site"));
        //     configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        //     configuration.setAllowCredentials(true);
        //     configuration.setAllowedHeaders(Collections.singletonList("*"));
        //     configuration.setMaxAge(3600L);
        //     configuration.setExposedHeaders(Arrays.asList("Authorization", "token"));

        //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //     source.registerCorsConfiguration("/**", configuration);  // 모든 경로에 대해 CORS 설정 적용
        //     return configuration;
        // }));

        return http.build();
    }
}
