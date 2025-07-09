pipeline {
    agent any

    // Variables pour suivre le temps
    environment {
        BUILD_START_TIME = ""
        STAGE_START_TIME = ""
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Marquer le début du build
                    env.BUILD_START_TIME = currentBuild.startTimeInMillis
                    env.STAGE_START_TIME = System.currentTimeMillis()
                }
                checkout scm
                script {
                    def duration = (System.currentTimeMillis() - env.STAGE_START_TIME.toLong()) / 1000
                    echo "Durée de l'étape Checkout: ${duration} secondes"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    env.STAGE_START_TIME = System.currentTimeMillis()
                }
                echo "Installing dependencies..."
                bat 'npm install'
                script {
                    def duration = (System.currentTimeMillis() - env.STAGE_START_TIME.toLong()) / 1000
                    echo "Durée de l'étape Install Dependencies: ${duration} secondes"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    env.STAGE_START_TIME = System.currentTimeMillis()
                }
                echo "Running tests..."
                bat 'npm test'
                script {
                    def duration = (System.currentTimeMillis() - env.STAGE_START_TIME.toLong()) / 1000
                    echo "Durée de l'étape Run Tests: ${duration} secondes"
                }
            }
        }

        stage('Start Application') {
            steps {
                script {
                    env.STAGE_START_TIME = System.currentTimeMillis()
                }
                echo "Testing application startup..."
                script {
                    def proc = bat(script: 'timeout /t 5 /nobreak & npm start', returnStatus: true)
                    if (proc == 0 || proc == 1) {
                        echo "Application started successfully"
                    } else {
                        error "Application failed to start"
                    }
                    def duration = (System.currentTimeMillis() - env.STAGE_START_TIME.toLong()) / 1000
                    echo "Durée de l'étape Start Application: ${duration} secondes"
                }
            }
        }
    }

    post {
        always {
            script {
                def totalDuration = (System.currentTimeMillis() - env.BUILD_START_TIME.toLong()) / 1000
                echo "TEMPS TOTAL DU BUILD: ${totalDuration} secondes"

                // Création d'un rapport de temps
                echo "=== RAPPORT DE TEMPS DE BUILD ==="
                echo "Début du build: ${new Date(env.BUILD_START_TIME.toLong())}"
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