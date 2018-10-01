FROM openjdk:8-jdk-slim

USER root
RUN apt-get update && apt-get -y install openssl

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0 \
    JAVA_OPTS="-XX:+UseParallelGC -XX:MinHeapFreeRatio=5 -XX:MaxHeapFreeRatio=10 -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90" \
    HOME=/home/jboss

WORKDIR ${HOME}

ADD entrypoint.sh entrypoint.sh
RUN chmod 755 entrypoint.sh

ADD *.war app.war

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 8080
