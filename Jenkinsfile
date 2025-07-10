pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-node-app:latest .'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'docker stop my-node-app'
                    } catch (err) {
                        echo "Container stop failed or not running: ${err}"
                    }

                    try {
                        sh 'docker rm my-node-app'
                    } catch (err) {
                        echo "Container removal failed: ${err}"
                    }

                    sh 'docker run -d --name my-node-app -p 3000:80 my-node-app:latest'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed!'
        }
        always {
            echo '📦 Pipeline terminé'
        }
    }
}
