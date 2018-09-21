//
// This script/file is used by the Multibranch Pipeline Job/Folder:
//
pipeline {
    agent {
        label 'sentinel'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        NVM_HOME = tool('nvm')
        YARN_HOME = tool('yarn')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                // clean before build
                sh 'rm -rf target'

                withEnv(["JAVA_HOME=${tool 'jdk8_oracle'}", "PATH+JAVA=${env.JAVA_HOME}/bin"]) {
                    sh """
                        source $NVM_HOME/nvm.sh
                        nvm install 8
                        nvm use 8
                        $YARN_HOME/bin/yarn --version
                        PATH=$YARN_HOME/bin:$PATH
                        ./gradlew -Pprod clean bootWar
                    """
                }

                archiveArtifacts 'build/libs/ln*.war'
            }
        }
        stage('Package') {
            steps {
                // cleanup
                sh "rm -rf build-context.tar.gz build-context"

                // prepare directory structure for binary deployment
                sh "mkdir -p build-context"

                // add war artifacts
                sh "cp build/libs/ln*.war build-context/"

                // add docker related stuff
                sh "cp src/main/docker/Dockerfile build-context/"
                sh "cp src/main/docker/entrypoint.sh build-context/"

                // crate deployment archive
                sh "GZIP=-9 tar cvfz build-context.tar.gz build-context/"

                archiveArtifacts 'build-context.tar.gz'
            }
        }
    }
    post {
        unstable {
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]': Check console output at ${
                    env.BUILD_URL
                } (${env.JOB_NAME} [${env.BUILD_NUMBER})""",
                recipientProviders: [[$class: 'FailingTestSuspectsRecipientProvider']]
            )
        }
        failure {
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]': Check console output at ${
                    env.BUILD_URL
                } (${env.JOB_NAME} [${env.BUILD_NUMBER})""",
                recipientProviders: [[$class: 'CulpritsRecipientProvider']]
            )
        }
    }
}
