
#TRAVIS_BRANCH='test-branch'
#TRAVIS_COMMIT='test-commit'
#AWS_ECS_REGISTRY='ecs-reg'
#TRAVIS_TAG='cool-tag'


if [ -z "$TRAVIS_TAG" ]; then
    echo "will not build, no git tag"
else
    pip install awscli
    PATH=$PATH:$HOME/.local/bin

    cd olimcc
    #aws s3 cp $APP_CONFIG_FILE ./.app-config.clj
    IMAGE_NAME=olimcc-app
    DATE=`date +%Y%m%d.%H%M%S`
    IMAGE_TAG=$DATE-$TRAVIS_BRANCH.${TRAVIS_COMMIT:0:10}
    eval $(aws ecr get-login --region us-east-1)

    echo "building" $IMAGE_NAME:$IMAGE_TAG
    docker build --build-arg GIT_COMMIT=$TRAVIS_COMMIT -t $IMAGE_NAME:$IMAGE_TAG .
    docker tag $IMAGE_NAME:$IMAGE_TAG $AWS_ECS_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
    docker push $AWS_ECS_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
fi
