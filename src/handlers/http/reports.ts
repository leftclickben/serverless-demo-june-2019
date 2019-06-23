import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const list: APIGatewayProxyHandler = async (event) => {
  console.log(`HTTP list reports handler called with event: ${JSON.stringify(event, null, 2)}`);

  if (!event.pathParameters || event.pathParameters.category) {
    throw Error('Missing path parameter "category"');
  }

  const client = new DynamoDB.DocumentClient();

  const { Items: reports } = await client.query({
    TableName: `reports_${process.env.NODE_ENV}`,
    KeyConditionExpression: `categoryId = :categoryId`,
    ExpressionAttributeValues: {
      ':categoryId': event.pathParameters.category
    }
  }).promise();

  return {
    statusCode: reports && reports.length > 0 ? 200 : 204,
    body: JSON.stringify(reports)
  };
};

export const create: APIGatewayProxyHandler = async (event) => {
  console.log(`HTTP create report handler called with event: ${JSON.stringify(event, null, 2)}`);

  if (!event.pathParameters || !event.pathParameters.category) {
    throw Error('Missing path parameter "category"');
  }
  if (!event.body) {
    throw Error('Missing body in POST request');
  }

  const client = new DynamoDB.DocumentClient();

  const report = {
    ...JSON.parse(event.body),
    categoryId: event.pathParameters.category,
    eventTimestamp: Date.now()
  };

  await client.put({
    TableName: `reports_${process.env.NODE_ENV}`,
    Item: report
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(report)
  };
};
