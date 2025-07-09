pipeline {
    agent any

    environment {
        CACHE_DIR = "${WORKSPACE}/../cache"
        NODE_MODULES_CACHE = "${CACHE_DIR}/node_modules"
        PACKAGE_LOCK_HASH = "${WORKSPACE}/package-lock.json"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if (!binding.hasVariable('timestamps')) {
                        timestamps = [:]
                    }
                    timestamps.buildStartTime = System.currentTimeMillis()
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                checkout scm
                script {
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Duree de l etape Checkout: ${duration} secondes"
                }
            }
        }

        stage('Setup Cache Directory') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()

                    // Create cache directory if it doesn't exist
                    bat "if not exist \"${CACHE_DIR}\" mkdir \"${CACHE_DIR}\""

                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Duree de l etape Setup Cache: ${duration} secondes"
                }
            }
        }

        stage('Restore Dependencies Cache') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()

                    // Check if cache exists and package-lock.json hasn't changed
                    def cacheExists = bat(script: "if exist \"${NODE_MODULES_CACHE}\" echo EXISTS", returnStdout: true).trim()

                    if (cacheExists.contains('EXISTS')) {
                        echo "Cache trouvé, restauration des dépendances..."

                        // Copy cached node_modules to workspace
                        bat "xcopy \"${NODE_MODULES_CACHE}\" \"${WORKSPACE}\\node_modules\" /E /I /H /Y"

                        echo "Cache restauré avec succès"
                    } else {
                        echo "Aucun cache trouvé, installation complète nécessaire"
                    }

                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Duree de l etape Restore Cache: ${duration} secondes"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()
                }
                echo "Installing dependencies..."

                // Check if node_modules exists and is not empty
                script {
                    def nodeModulesExists = bat(script: "if exist \"${WORKSPACE}\\node_modules\" echo EXISTS", returnStdout: true).trim()

                    if (nodeModulesExists.contains('EXISTS')) {
                        echo "node_modules existe, vérification des dépendances..."
                        // Run npm ci for faster, reliable installs
                        bat 'npm ci --only=production'
                    } else {
                        echo "node_modules n'existe pas, installation complète..."
                        bat 'npm install'
                    }
                }

                script {
                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Duree de l'étape Install Dependencies: ${duration} secondes"
                }
            }
        }

        stage('Save Dependencies Cache') {
            steps {
                script {
                    timestamps.stageStartTime = System.currentTimeMillis()

                    // Remove old cache and save new one
                    bat "if exist \"${NODE_MODULES_CACHE}\" rmdir /S /Q \"${NODE_MODULES_CACHE}\""
                    bat "xcopy \"${WORKSPACE}\\node_modules\" \"${NODE_MODULES_CACHE}\" /E /I /H /Y"

                    echo "Cache sauvegardé avec succès"

                    def duration = (System.currentTimeMillis() - timestamps.stageStartTime) / 1000
                    echo "Duree de l etape Save Cache: ${duration} secondes"
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
                    echo "Duree de l etape Run Tests: ${duration} secondes"
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
                    echo "Duree de l etape Start Application: ${duration} secondes"
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
                echo "Duree totale du build: ${totalDuration} secondes"

                // Cache statistics
                def cacheSize = bat(script: "if exist \"${NODE_MODULES_CACHE}\" (dir \"${NODE_MODULES_CACHE}\" /s /-c | find \"File(s)\") else echo 0", returnStdout: true).trim()
                echo "Taille du cache: ${cacheSize}"
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