pipeline {
    agent any

    environment {
        CACHE_DIR = "C:\\ProgramData\\Jenkins\\.jenkins\\cache"
        NODE_MODULES_CACHE = "${CACHE_DIR}\\node_modules"
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

                    // Check if cache exists and has content
                    def cacheValidResult = bat(script: """
                        if exist "${NODE_MODULES_CACHE}" (
                            dir "${NODE_MODULES_CACHE}" /A /B 2>nul | find /c /v "" >nul
                            if !errorlevel! equ 0 (
                                echo VALID_CACHE
                            ) else (
                                echo EMPTY_CACHE
                            )
                        ) else (
                            echo NO_CACHE
                        )
                    """, returnStdout: true).trim()

                    if (cacheValidResult.contains('VALID_CACHE')) {
                        echo "Cache valide trouvé, restauration des dépendances..."

                        // Remove existing node_modules if it exists
                        bat "if exist \"node_modules\" rmdir /S /Q \"node_modules\""

                        // Copy cached node_modules to workspace with error handling
                        def xcopyResult = bat(script: "xcopy \"${NODE_MODULES_CACHE}\" \"node_modules\" /E /I /H /Y", returnStatus: true)

                        if (xcopyResult == 0) {
                            echo "Cache restauré avec succès"
                        } else {
                            echo "Erreur lors de la restauration du cache, installation complète nécessaire"
                            // Clean up failed restoration
                            bat "if exist \"node_modules\" rmdir /S /Q \"node_modules\""
                        }
                    } else if (cacheValidResult.contains('EMPTY_CACHE')) {
                        echo "Cache vide trouvé, suppression du cache corrompu"
                        bat "rmdir /S /Q \"${NODE_MODULES_CACHE}\""
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
                    def nodeModulesResult = bat(script: """
                        if exist "node_modules" (
                            dir "node_modules" /A /B 2>nul | find /c /v "" >nul
                            if !errorlevel! equ 0 (
                                echo VALID_MODULES
                            ) else (
                                echo EMPTY_MODULES
                            )
                        ) else (
                            echo NO_MODULES
                        )
                    """, returnStdout: true).trim()

                    if (nodeModulesResult.contains('VALID_MODULES')) {
                        echo "node_modules existe et contient des fichiers, vérification des dépendances..."
                        // Use npm ci for faster installs when package-lock.json exists
                        def packageLockExists = bat(script: "if exist \"package-lock.json\" (echo EXISTS) else (echo NOT_EXISTS)", returnStdout: true).trim()

                        if (packageLockExists.contains('EXISTS')) {
                            bat 'npm ci --only=production --silent'
                        } else {
                            bat 'npm install --silent'
                        }
                    } else {
                        echo "node_modules n'existe pas ou est vide, installation complète..."
                        bat 'npm install --silent'
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

                    // Check if node_modules exists and has content before caching
                    def nodeModulesResult = bat(script: """
                        if exist "node_modules" (
                            dir "node_modules" /A /B 2>nul | find /c /v "" >nul
                            if !errorlevel! equ 0 (
                                echo VALID_MODULES
                            ) else (
                                echo EMPTY_MODULES
                            )
                        ) else (
                            echo NO_MODULES
                        )
                    """, returnStdout: true).trim()

                    if (nodeModulesResult.contains('VALID_MODULES')) {
                        echo "node_modules valide trouvé, sauvegarde du cache..."

                        // Remove old cache if it exists
                        bat "if exist \"${NODE_MODULES_CACHE}\" rmdir /S /Q \"${NODE_MODULES_CACHE}\""

                        // Save new cache with error handling
                        def xcopyResult = bat(script: "xcopy \"node_modules\" \"${NODE_MODULES_CACHE}\" /E /I /H /Y", returnStatus: true)

                        if (xcopyResult == 0) {
                            echo "Cache sauvegardé avec succès"
                        } else {
                            echo "Erreur lors de la sauvegarde du cache"
                        }
                    } else {
                        echo "Aucun node_modules valide à sauvegarder"
                    }

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

                // Cache statistics with better error handling
                def cacheSizeResult = bat(script: """
                    if exist "${NODE_MODULES_CACHE}" (
                        dir "${NODE_MODULES_CACHE}" /s /-c 2>nul | find "File(s)" 2>nul
                        if !errorlevel! equ 0 (
                            echo Cache presente
                        ) else (
                            echo Cache vide ou inaccessible
                        )
                    ) else (
                        echo Cache inexistant
                    )
                """, returnStdout: true).trim()
                echo "Informations sur le cache: ${cacheSizeResult}"
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