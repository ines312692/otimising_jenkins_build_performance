pipeline {
    agent any

    stages {
        stage('Install and Test') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'npm install'
                sh 'node test.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-node-app:latest .'
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
        always {
            echo 'Pipeline terminé'
        }
    }
}
