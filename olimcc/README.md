Crude running of unversioned docker container:

    ./build.sh
    scp target/olimcc-app.docker.tgz some-host:

To install (on host):

    mkdir olimcc-app-data # only the first time
    gunzip olimcc-app.docker.tgz
    docker load -i olimcc-app.docker.tar
    docker run -d -v ~/olimcc-app-data/:/root/olimcc-app-data/ -p 8080:8080 olimcc-app

To clean up old images:

    docker rmi -f $(docker images -f "dangling=true" -q)
