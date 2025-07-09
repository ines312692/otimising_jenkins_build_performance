pipeline {
    agent any

    environment {
        CACHE_KEY = "node-cache-${env.BRANCH_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Restore Cache') {
            steps {
                cache(caches: [paths: ['node_modules']], key: "${CACHE_KEY}", restoreKeys: ['node-cache-']) {
                    echo " Restoring node_modules from cache"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo " Installing dependencies..."
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running tests..."
                bat 'npm test'
            }
        }

        stage('Save Cache') {
            steps {
                cache(caches: [paths: ['node_modules']], key: "${CACHE_KEY}") {
                    echo " Saving node_modules to cache"
                }
            }
        }
    }
}
