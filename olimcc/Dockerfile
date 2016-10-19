FROM denvazh/java

Maintainer oli@olimcc.com

# Get some tooling
RUN apk update
RUN apk add wget

# Install lein to build
ENV LEIN_VERSION=2.5.3
ENV LEIN_INSTALL=/usr/local/bin/

ARG GIT_COMMIT
ENV GIT_COMMIT ${GIT_COMMIT}

WORKDIR /tmp

RUN mkdir -p $LEIN_INSTALL \
  && wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein \
  && mv lein $LEIN_INSTALL/ \
  && chmod 755 $LEIN_INSTALL/lein

ENV PATH=$PATH:$LEIN_INSTALL
ENV LEIN_ROOT 1

# Build app using lein
WORKDIR /app
COPY . /app
#RUN mkdir $HOME/.olimcc-app
#COPY ./.app-config.clj $HOME/.olimcc-app/app-config.clj
RUN lein ring uberjar

# Clean things we don't need
#RUN rm /root/.lein/self-installs/leiningen-2.5.3-standalone.jar
#RUN rm /root/.lein/self-installs/leiningen-2.5.3-standalone.jar
RUN rm -rf /root/.m2/repository/

EXPOSE 80

# Run the app
CMD ["java", "-jar", "/app/target/olimcc-0.1.0-SNAPSHOT-standalone.jar"]
