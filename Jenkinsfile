pipeline {
    agent any

    stages {
        stage('Install and Test') {
            // Run this stage inside a Node.js container
            agent {
                docker {
                    image 'node:18'
                    // Optionally, add args for mounting docker socket if needed
                    // args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh 'npm install'
                sh 'node test.js'
            }
        }

        stage('Build Docker Image') {
            // Use the default agent, assuming Docker is installed on the Jenkins host or agent
            steps {
                // Build your Docker image from the Jenkins workspace
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
