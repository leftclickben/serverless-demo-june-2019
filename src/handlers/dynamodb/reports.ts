import { CloudWatchEvents } from 'aws-sdk';
import { DynamoDBStreamHandler } from 'aws-lambda';

export const inserted: DynamoDBStreamHandler = async (event) => {
  console.info(`DynamoDB report updated handler called with event: ${JSON.stringify(event, null, 2)}`);

  const highValueRecords = event.Records.filter(({ dynamodb }) => {
    if (!dynamodb || !dynamodb.NewImage || !dynamodb.NewImage.value) {
      return false;
    }
    return Number(dynamodb.NewImage.value.N) > 90 || Number(dynamodb.NewImage.value.N) < 10;
  });

  if (highValueRecords.length === 0) {
    return;
  }

  console.info(`Sending events to cloudwatch: ${JSON.stringify(highValueRecords, null, 2)}`);

  const client = new CloudWatchEvents();

  await client.putEvents({
    Entries: highValueRecords.map(({ dynamodb, eventSource }) => ({
      DetailType: 'HighValueAlert',
      Source: eventSource,
      Detail: JSON.stringify(dynamodb, null, 2)
    }))
  }).promise();
};
