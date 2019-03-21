String version = env.BRANCH_NAME
String commitId = env.GIT_COMMIT
Boolean isRelease = version ==~ /v\d+\.\d+\.\d+.*/
Boolean isPR = env.CHANGE_ID != null
Boolean isMaster = version == 'master'
Boolean isDeployToDev = env.CHANGE_TITLE ? env.CHANGE_TITLE.contains('deploy_to_dev') : false;

pipeline {
    agent any

    environment {
        imageStream = 'nexus-web'
        imageBuildName = 'nexus-web-build'
    }

    stages {
        stage('Start Pipeline') {
            steps{
                sh 'echo "Pipeline starting with environment:"'
                sh 'printenv'
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
                        sh 'npm run lint -- -c tslint.prod.json'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm run test'
                    }
                }
                stage('Stories') {
                    steps {
                        sh 'npm run build:storybook'
                    }
                }
                stage('Build') {
                    steps {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Image') {
            when {
                // We build a new image only if we want to deploy to dev OR if we are merging back to master
                expression { isDeployToDev || (isMaster && !isRelease && !isPR) }
            }
            steps {
                sh "oc start-build ${imageBuildName} --follow"
            }
        }

        stage('Promote to dev') {
            when {
                expression { isDeployToDev }
            }
            steps {
                openshiftTag srcStream: imageStream, srcTag: 'latest', destStream: imageStream, destTag: 'dev', verbose: 'false'
            }
        
        }
        stage('Promote to staging') {
            when {
                expression { isMaster && !isRelease && !isPR }
            }
            steps {
                openshiftTag srcStream: imageStream, srcTag: 'latest', destStream: imageStream, destTag: 'staging', verbose: 'false'
            }
        }

        stage('Promote to production') {
            when {
                expression { isRelease }
            }
            steps {
                openshiftTag srcStream: imageStream, srcTag: 'staging', destStream: imageStream, destTag: "production,${BRANCH_NAME.substring(1)}", verbose: 'false'
            }
        }
    }
}
