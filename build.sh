repository=harbor.cloud2go.cn/cloudtogo/apiorch-web

if [[ -z $1 ]]; then
    echo ""
    echo "Argument SERVICE not present, please check command:"
    echo ""
    echo "  $0 $1 SERVICE [VERSION]"
    echo ""
    echo "Notice: Default to build on tag <latest>, if VERSION is present, after build operation the image will also be tagged to that VERSION"
    echo ""
    exit 1
  fi

  if [[ -n $1 ]]; then
    DOCKER_BUILDKIT=1 docker build --cache-from ${repository}:latest -t ${repository}:latest .

    docker tag ${repository}:latest ${repository}:$1
    echo "Successfully tagged ${repository}:$1"

    docker push ${repository}:latest
    docker push ${repository}:$1
  else
    DOCKER_BUILDKIT=1 docker build --cache-from ${repository}:latest -t ${repository}:latest .
    docker push ${repository}:latest
  fi
