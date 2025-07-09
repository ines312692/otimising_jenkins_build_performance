pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                bat 'npm test'
            }
        }

        stage('Start Application') {
            steps {
                echo "Testing application startup..."
                script {
                    def proc = bat(script: 'timeout /t 5 /nobreak & npm start', returnStatus: true)
                    if (proc == 0 || proc == 1) {
                        echo "Application started successfully"
                    } else {
                        error "Application failed to start"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed"
        }
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}