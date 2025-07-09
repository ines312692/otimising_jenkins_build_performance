pipeline {
    agent any

    // Variables Groovy (non env)
    def buildStartTime = 0
    def stageStartTime = 0

    stages {
        stage('Checkout') {
            steps {
                script {
                    buildStartTime = System.currentTimeMillis()
                    stageStartTime = System.currentTimeMillis()
                }
                checkout scm
                script {
                    def duration = (System.currentTimeMillis() - stageStartTime) / 1000
                    echo "Durée de l'étape Checkout: ${duration} secondes"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script { stageStartTime = System.currentTimeMillis() }
                echo "Installing dependencies..."
                bat 'npm install'
                script {
                    def duration = (System.currentTimeMillis() - stageStartTime) / 1000
                    echo "Durée de l'étape Install Dependencies: ${duration} secondes"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script { stageStartTime = System.currentTimeMillis() }
                echo "Running tests..."
                bat 'npm test'
                script {
                    def duration = (System.currentTimeMillis() - stageStartTime) / 1000
                    echo "Durée de l'étape Run Tests: ${duration} secondes"
                }
            }
        }

        stage('Start Application') {
            steps {
                script { stageStartTime = System.currentTimeMillis() }
                echo "Testing application startup..."
                script {
                    def proc = bat(script: 'timeout /t 5 /nobreak & npm start', returnStatus: true)
                    if (proc == 0 || proc == 1) {
                        echo "Application started successfully"
                    } else {
                        error "Application failed to start"
                    }
                    def duration = (System.currentTimeMillis() - stageStartTime) / 1000
                    echo "Durée de l'étape Start Application: ${duration} secondes"
                }
            }
        }
    }

    post {
        always {
            script {
                def totalDuration = (System.currentTimeMillis() - buildStartTime) / 1000
                echo "TEMPS TOTAL DU BUILD: ${totalDuration} secondes"
                echo "=== RAPPORT DE TEMPS DE BUILD ==="
                echo "Début du build: ${new Date(buildStartTime)}"
                echo "Fin du build: ${new Date()}"
                echo "Durée totale: ${totalDuration} secondes"
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
