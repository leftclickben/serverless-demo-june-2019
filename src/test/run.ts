import axios from 'axios';

interface Report {
  categoryId: string;
  comment: string;
  value: number;
  foo: number;
}

const runLoadTest = async (createReportUrl: string) => {
  if (!createReportUrl) {
    throw Error('Must supply URL for POSTing reports');
  }

  console.info(`Running load test with URL ${createReportUrl}`);

  let value = 50;

  while (value >= 0) {
    console.info(`Iterating with value = ${value}`);

    value = Math.max(0, Math.min(100, value + (Math.random() - (0.5 + (50 - value) / 250)) * 10));

    await axios.post<Report>(createReportUrl, {
      categoryId: 'demonstration',
      comment: 'This is an example payload, it could have any structure containing any values from your domain.',
      foo: Math.random(),
      value
    });

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 500));
  }
};

if (require.main === module) {
  runLoadTest(process.argv[2]).then(console.info).catch(console.error);
}
