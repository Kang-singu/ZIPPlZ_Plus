pipeline {
    agent any
    
    environment {
        ZIPPlZ_BACKEND_IMAGE = 'zipplz-backend'
        OPENVIDU_URL = credentials('OPENVIDU_URL');
        OPENVIDU_SERVER_URL = credentials('OPENVIDU_SERVER_URL');
        OPENVIDU_SECRET = credentials('OPENVIDU_SECRET');
        DOMAIN_OR_PUBLIC_IP = credentials('DOMAIN_OR_PUBLIC_IP');
        CERTIFICATE_TYPE = credentials('CERTIFICATE_TYPE');
        spring_h2_console_path = credentials('spring.h2.console.path');
        spring_datasource_username = credentials('spring.datasource.username');
        spring_datasource_password = credentials('spring.datasource.password');
        spring_jwt_secret = credentials('spring.jwt.secret');
        spring_security_oauth2_client_registration_google_client_id = credentials('spring.security.oauth2.client.registration.google.client-id');
        spring_security_oauth2_client_registration_google_client_secret = credentials('spring.security.oauth2.client.registration.google.client-secret');
        spring_security_oauth2_client_registration_google_redirect_uri = credentials('spring.security.oauth2.client.registration.google.redirect-uri');
        spring_security_oauth2_client_registration_kakao_client_id = credentials('spring.security.oauth2.client.registration.kakao.client-id');
        spring_security_oauth2_client_registration_kakao_client_secret = credentials('spring.security.oauth2.client.registration.kakao.client-secret');
        spring_security_oauth2_client_registration_kakao_redirect_uri = credentials('spring.security.oauth2.client.registration.kakao.redirect-uri');
        spring_data_mongodb_uri = credentials('spring.data.mongodb.uri');
        cloud_aws_credentials_accessKey = credentials('cloud.aws.credentials.accessKey');
        cloud_aws_credentials_secretKey = credentials('cloud.aws.credentials.secretKey');
        openai_api_key = credentials('openai.api.key');
    }
    
    stages {
        stage ('Github Repository Checkout') {
            steps {
                git branch: 'BE_ZIPPlZ',
                url: 'https://github.com/Kang-singu/ZIPPlZ_Plus.git'
            }
        }

        
        stage('Backend Build') {
            steps {
                script {
                    echo '********** Backend Build Start **********'
                    dir('backend') {
                        sh 'docker build -t zipplz/$ZIPPlZ_BACKEND_IMAGE .'
                    }
                    
                    echo '********** Backend Build End **********'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    echo '********** Docker Compose Start **********'

                    sh 'docker compose down'
                    sh 'docker compose build --no-cache'
                    sh 'docker compose up -d'

                    echo '********** Docker Compose End **********'
                }
            }
        }

        stage('Delete unnecessary Docker images') {
            steps {
                script {
                    echo '********** Delete unnecessary Docker images Start **********'
                    sh 'docker image prune -a -f'
                    echo '********** Delete unnecessary Docker images End **********'
                }
            }
        }
    }
}