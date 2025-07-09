pipeline {
    agent any

    stages {
        stage('Setup Node') {
            steps {
                echo "Using node container to install deps and test"
                sh '''
                      npm install &&
                      node test.js
                    "
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t my-node-app:latest .'
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
