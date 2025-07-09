pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
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
                echo "Deploying Docker container..."
                sh '''
                    docker stop my-node-app || true
                    docker rm my-node-app || true
                    docker run -d -p 3000:3000 --name my-node-app my-node-app
                '''
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
