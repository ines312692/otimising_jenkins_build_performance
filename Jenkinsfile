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
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                sh 'node test.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t my-node-app .'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying container..."
                script {

                    sh 'docker stop my-node-app || echo "Not running"'
                    sh 'docker rm my-node-app || echo "Already removed"'


                    sh 'docker run -d -p 3000:3000 --name my-node-app my-node-app'
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
