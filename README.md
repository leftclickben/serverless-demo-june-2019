# Serverless demo - June 2019

This demo was created for [Perth Serverless](https://www.meetup.com/Perth-Serverless/) meetup in [June 2019](https://www.meetup.com/Perth-Serverless/events/262089039/).

It implements a simple API, which allows creation and listing of `report` payloads (like something produced by a sensor or IoT device), and a DynamoDB-triggered Lambda which watches for out-of-range values in the reports.

The stack utilises two plugins &mdash; [serverless-api-stage](https://github.com/leftclickben/serverless-api-stage) and [serverless-plugin-typescript](https://github.com/prisma/serverless-plugin-typescript) &mdash; for the purpose of demonstrating the plugin architecture.

## Key discussion points

* The `serverless.yml` file structure and contents, in relation to the code.
* Serverless framework plugin architecture.
* The `.serverless` directory generated during a deployment:
  * Two `cloudformation-template-*.json` files: `create-stack` and `update-stack`.
  * ZIP file for uploading to S3 / CloudFormation.
  * Locally cached stack details in `serverless-state.json`.

## Prerequisites

* NodeJS 10.x
* [AWS credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

## Deployment

From a clone of this repository:

1. `npm i -g serverless`
2. `npm i`
3. `sls deploy`

## Test script

There is a simple test script executed using `npm test` and passing it the URL of your deployed API, including the `category` path parameter (with any value you choose).
