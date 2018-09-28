String ref = env.BRANCH_NAME
Boolean isMaster = ref == "master"
Boolean isRelease = ref ==~ /v\d+\.\d+\.\d+.*/
Boolean isPR = env.CHANGE_ID != null
String targetEnv = isRelease ? "production" : isMaster ? "staging" : "dev"

pipeline {
    agent none

    stages {
        stage("Test 'n Lint") {
            when {
                expression { !isPR }
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
                expression { !isPR }
            }
            steps {
                node("slave-sbt") {
                    checkout scm
                    sh "npm i && npm run build"
                    sh "mkdir deployment && mv dist deployment && mv docker deployment"
                    sh "oc start-build search-webapp-build --from-dir=deployment --follow"

                    // Tag to dev, staging or prod depending on the context
                    openshiftTag srcStream: 'search-webapp', srcTag: 'latest', destStream: 'search-webapp', destTag: targetEnv, verbose: 'false'

                    // Additional version tag when we're relasing in prod
                    if (version) {
                        openshiftTag srcStream: 'search-webapp', srcTag: 'latest', destStream: 'search-webapp', destTag: ref.substring(1), verbose: 'false'
                    }
                }
            }
        }
    }
}
