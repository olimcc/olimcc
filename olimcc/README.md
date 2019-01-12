
### Kube deploy

Configure project wide settings

    gcloud config set project already-behind-schedule
    gcloud config set compute/zone us-central1-b

Create cluster

    gcloud container clusters create <cluster name> \
        --num-nodes 1 \
        --zone us-central1-b \
        --enable-ip-alias \
        --enable-autoupgrade \
        --machine-type g1-small

Obtain cluster credentials

    gcloud container clusters get-credentials <cluster name>

Add secrets for DB access

    kubectl create secret generic olimccdb \
        --from-literal user=<user> \
        --from-literal password=<pw> \
        --from-literal dbname=<db> \
        --from-literal host=<hn>

Create deployment

    kubectl apply -f deployment.yaml

Create load balancer

    kubectl apply -f lb-service.yaml

List services to find external IP

    kubectl get services
    NAME                TYPE           CLUSTER-IP   EXTERNAL-IP     PORT(S)        AGE
    ...

### Release

Push a tag, builds on [travis](https://travis-ci.org/olimcc/olimcc), deploys to GCS repository.

    git tag -a v0.2.3 -m "0.2.3"
    git push origin v0.2.3

Bump image version in deployment.yaml, then:

    kubectl apply -f deployment.yaml

### Local exec


    docker build -t olimcc-app:latest .

    # env-file.txt with DB_USER, DB_PASSWORD, DB_NAME, DB_HOST
    docker run -it --env-file ./env-file.txt -p 8111:80 olimcc-app:latest
