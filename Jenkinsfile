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
    }
}