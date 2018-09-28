
def version = env.BRANCH_NAME

pipeline {
    agent none

    stages {
        stage("Review") {
            when {
                expression { env.CHANGE_ID != null }
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
                    sh "oc start-build search-webapp-build --from-dir=dist --follow"
                }
            }
        }
    }
}