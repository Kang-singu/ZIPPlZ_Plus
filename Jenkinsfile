pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
    }
    
    environment {
        ZIPPlZ_FRONTEND_IMAGE = 'zipplz-frontend'
    }
    
    stages {
        stage ('Github Repository Checkout') {
            steps {
                git branch: 'FE_ZIPPlZ',
                url: 'https://github.com/Kang-singu/ZIPPlZ_Plus.git'
            }
        }

        
        stage('Frontend Build') {
            steps {
                script {
                    echo '********** Frontend Build Start **********'
                    dir('frontend') {
                        sh 'docker build -t ZIPPlZ/$ZIPPlZ_FRONTEND_IMAGE .'
                    }
                    
                    echo '********** Frontend Build End **********'
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    echo '********** Docker Compose Start **********'

                    sh 'docker compose down'
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