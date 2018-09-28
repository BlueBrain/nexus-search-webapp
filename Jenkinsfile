
def version = env.BRANCH_NAME

pipeline {
    agent none

    stages {
        stage("Test 'n Lint") {
            when {
                expression { env.CHANGE_ID == null }
            }
            steps {
                node("slave-sbt") {
                    checkout scm
                    sh 'npm i && npm test && npm run lint'
                }
            }
        }
        stage("Build Image") {
            when {
                expression { env.CHANGE_ID == null }
            }
            steps {
                node("slave-sbt") {
                    checkout scm
                    sh "npm i && npm run build"
                    sh "mkdir deployment && mv dist deployment && mv docker deployment"
                    sh "oc start-build search-webapp-build --from-dir=deployment --follow"
                }
            }
        }
    }
}