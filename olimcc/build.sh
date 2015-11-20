#!/bin/bash
# Build an untagged/unversioned image of the app container.

rm -rf target/
docker build -t olimcc-app .

# clean up old images
docker rmi -f $(docker images -f "dangling=true" -q)

# save a tar'd up version to build/
mkdir target/
docker save olimcc-app | gzip > ./target/olimcc-app.docker.tgz
