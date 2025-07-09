pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Initialisation de la map timestamps si elle n'existe pas
                    if (!binding.hasVariable('timestamps')) {
                        timestamps = [:]
                    }
                    timestamps.buildStartTime = System.currentTimeMillis()
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                checkout scm
                script {
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Durée de l'étape Checkout: ${duration} secondes"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                echo "Installing dependencies..."
                bat 'npm install'
                script {
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Durée de l'étape Install Dependencies: ${duration} secondes"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                echo "Running tests..."
                bat 'npm test'
                script {
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Durée de l'étape Run Tests: ${duration} secondes"
                }
            }
        }

        stage('Start Application') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                echo "Testing application startup..."
                script {
                    def proc = bat(script: 'timeout /t 5 /nobreak & npm start', returnStatus: true)
                    if (proc == 0 || proc == 1) {
                        echo "Application started successfully"
                    } else {
                        error "Application failed to start"
                    }
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Durée de l'étape Start Application: ${duration} secondes"
                }
            }
        }
    }

    post {
        always {
            script {
                def totalDuration = (System.currentTimeMillis() - timestamps.buildStartTime) / 1000
                echo "=== RAPPORT DE TEMPS DE BUILD ==="
                echo "Début du build: ${new Date(timestamps.buildStartTime)}"
                echo "Fin du build: ${new Date()}"
                echo "Durée totale du build: ${totalDuration} secondes"
            }
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
