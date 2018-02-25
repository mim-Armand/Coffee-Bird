#!/usr/bin/env bash
rm ./index.zip
cd lambda
zip -r -X ../index.zip ./*
cd ..
aws --profile mim --region us-east-1 lambda update-function-code --function-name coffeeMachine --zip-file fileb://index.zip