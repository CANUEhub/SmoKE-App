import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const pData = [0.67963,
    1.36677,
    2.14496,
    1.73451,
    1.58438,
    2.08381,
    1.6132,
    1.34399,
    1.17169,
    1.55572,
    1.7423,
    1.84461,
    1.53642,
    1.57239,
    2.0224,
    1.85103,
    1.66705,
    1.75574,
    1.6444,
    2.09324,
    1.22312,
    1.2144,
    0.88182,
    0.66037,
    0.44409,
    0.4987,
    0.9309,
    0.92295,
    0.65231,
    0.53871,
    0.69949];
const xLabels = ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15', 'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29', 'Jan 30', 'Jan 31'];

export default function BiaxialLineChart() {
  return (
    <LineChart
      width={2000}
      height={200}
      series={[
        { data: pData, label: 'AQHI', yAxisKey: 'leftAxisId' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
      rightAxis="rightAxisId"
    />
  );
}