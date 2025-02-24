pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
    }
    
    environment {
        ZIPPlZ_FRONTEND_IMAGE = 'ZIPPlZ-frontend'
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
                        sh 'docker build -t $ZIPPlZ_FRONTEND_IMAGE .'
                    }
                    
                    echo '********** Frontend Build End **********'
                }
            }
        }
    }
}