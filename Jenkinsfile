pipeline {
    agent any

    stages {
        stage('Setup Node') {
            steps {
                echo "Using node container to install deps and test"
                sh '''
                    docker run --rm -v $PWD:/app -w /app node:18 sh -c "
                      npm install &&
                      node test.js
                    "
                '''
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
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
        always {
            echo " Pipeline terminé"
        }
    }
}
