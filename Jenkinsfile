pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Restore & Install Dependencies') {
            steps {
                cache(caches: [paths: ['node_modules']]) {
                    echo " Installing dependencies with caching..."
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo " Running tests..."
                bat 'npm test'
            }
        }
    }
}
