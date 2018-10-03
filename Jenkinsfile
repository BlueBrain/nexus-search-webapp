String version = env.BRANCH_NAME
String commitId = env.GIT_COMMIT
Boolean isRelease = version ==~ /v\d+\.\d+\.\d+.*/
Boolean isPR = env.CHANGE_ID != null

pipeline {
    agent any

    environment {
        imageStream = 'nexus-search-webapp'
        imageBuildName = 'search-webapp-build' 
    }

    parameters {
        string(name: 'VERSION', defaultValue: version, description: 'The tag version if any')
        string(name: 'COMMIT_ID', defaultValue: commitId, description: 'The GIT commit ID')
    }

    stages {
        stage('Start Pipeline') {
            steps{
                sh 'echo "Pipeline starting with environment:"'
                sh 'printenv'
                sh "echo ${params.COMMIT_ID.substring(0,7)}"
            }
        }

        stage('Checkout and Install dependencies') {
            when {
                expression { !isRelease }
            }
            steps {
                checkout scm
                sh 'npm ci'
            }
        }

        stage('Review') {
            when {
                expression { !isRelease }
            }
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm run test'
                    }
                }
            }
        }

        stage('Build Image') {
            when {
                expression { !isRelease && !isPR }
            }
            steps {
                sh 'npm run build'
                sh 'mkdir deployment && mv dist deployment && mv docker deployment'
                sh "oc start-build ${imageBuildName} --from-dir=deployment --follow"
            }
        }

        stage('Promote to staging') {
            when {
                expression { !isRelease && !isPR }
            }
            steps {
                openshiftTag srcStream: imageStream, srcTag: 'latest', destStream: imageStream, destTag: "staging,${commitId.substring(0,7)}", verbose: 'false'
            }
        }

        stage('Promote to production') {
            when {
                expression { isRelease }
            }
            steps {
                openshiftTag srcStream: imageStream, srcTag: 'staging', destStream: imageStream, destTag: "production,${version.substring(1)}", verbose: 'false'
            }
        }
    }
}