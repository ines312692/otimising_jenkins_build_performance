pipeline {
    agent any
    environment {
        CACHE_DIR = '/tmp/cache'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    // Use the cache for npm dependencies
                    if (fileExists("${CACHE_DIR}/node_modules")) {
                        echo 'Using cached node_modules'
                    } else {
                        echo 'Installing dependencies...'
                        sh 'npm install'
                        sh 'mkdir -p ${CACHE_DIR} && cp -r node_modules ${CACHE_DIR}'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}