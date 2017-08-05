#!/bin/bash

echo "Deploying staging"

pip install awscli
aws s3 sync --sse --delete dist/ s3://instgram.chrisburchhardt.com
aws cloudfront create-invalidation --distribution-id EKBLR1Q9DRTSB --paths '/*'

echo "Done deploying to staging"