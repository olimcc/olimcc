PROJECT_NAME=olimcc-com
IMAGE_NAME=olimcc-app
REGISTRY=gcr.io/$PROJECT_NAME
GIT_BRANCH=$(git symbolic-ref --short -q HEAD)
GIT_HEAD=$(git rev-parse --short HEAD)
TRAVIS_TAG=test

if [ -z "$TRAVIS_TAG" ]; then
    echo "will not build, no git tag"
else

    echo $GCLOUD_SERVICE_KEY | base64 --decode -i > ${HOME}/gcloud-service-key.json
    gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
    gcloud auth configure-docker

    cd olimcc
    DATE=`date +%Y%m%d.%H%M%S`
    IMAGE_TAG=$DATE-$GIT_BRANCH.$GIT_HEAD

    echo "building" $IMAGE_NAME:$IMAGE_TAG
    docker build --build-arg GIT_COMMIT=$GIT_HEAD -t $IMAGE_NAME:$IMAGE_TAG .
    docker tag $IMAGE_NAME:$IMAGE_TAG $REGISTRY/$IMAGE_NAME:$IMAGE_TAG
    docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG
fi