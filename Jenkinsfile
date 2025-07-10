pipeline {
    agent any

    stages {
        stage('Install and Test') {
            agent {
                docker {
                    image 'node:18'
                }
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

        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'docker stop my-node-app'
                    } catch (err) {
                        echo "Container stop failed or container not running: ${err}"
                    }

                    try {
                        sh 'docker rm my-node-app'
                    } catch (err) {
                        echo "Container removal failed or container doesn't exist: ${err}"
                    }

                    sh '''
                        docker run -d --name my-node-app -p 3000:3000 my-node-app:latest
                    '''
                }
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