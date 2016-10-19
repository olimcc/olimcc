pip install awscli
PATH=$PATH:$HOME/.local/bin


cd olimcc
aws s3 cp $APP_CONFIG_FILE ./.app-config.clj
IMAGE_NAME=olimcc-app
DATE=`date +%Y-%m-%d.%H%M%S`
IMAGE_TAG=$DATE-$TRAVIS_BRANCH.$TRAVIS_COMMIT
eval $(aws ecr get-login --region us-east-1)

echo $IMAGE_NAME:$IMAGE_TAG
docker build --build-arg GIT_COMMIT=$TRAVIS_COMMIT -t $IMAGE_NAME:$IMAGE_TAG .
docker tag $IMAGE_NAME:$IMAGE_TAG $AWS_ECS_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
docker push $AWS_ECS_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
