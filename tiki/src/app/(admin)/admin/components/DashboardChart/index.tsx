'use client';

import { Paper, Typography } from '@mui/material';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardChartProps {
  type: 'line' | 'bar';
  title: string;
  data: any[];
  dataKey: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ type, title, data, dataKey }) => {
  return (
    <Paper
      sx={{
        p: 4,
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant='h6' className='mb-4' sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {type === 'line' ? (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid stroke='#e2e8f0' strokeDasharray='3 3' />
          <XAxis dataKey='name' stroke='#64748b' />
          <YAxis stroke='#64748b' />
          <Tooltip wrapperStyle={{ borderRadius: '8px' }} />
          <Legend />
          <Line type='monotone' dataKey={dataKey} stroke='#8884d8' strokeWidth={2} />
        </LineChart>
      ) : (
        <BarChart width={500} height={300} data={data}>
          <CartesianGrid stroke='#e2e8f0' strokeDasharray='3 3' />
          <XAxis dataKey='name' stroke='#64748b' />
          <YAxis stroke='#64748b' />
          <Tooltip wrapperStyle={{ borderRadius: '8px' }} />
          <Legend />
          <Bar dataKey={dataKey} fill='#82ca9d' radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </Paper>
  );
};

export default DashboardChart;
