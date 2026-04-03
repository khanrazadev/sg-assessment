'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { date: '12/27', score: 20 },
  { date: '12/28', score: 40 },
  { date: '12/29', score: 20 },
  { date: '12/30', score: 80 },
  { date: '12/31', score: 80 },
];

export function LineChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            padding={{ left: 70, right: 70 }}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
            label={{ value: 'Date', position: 'insideBottom', offset: -20, style: { fontSize: 13, fill: '#111827', fontWeight: 600 } }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={50}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, 100]}
            interval={0}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
            label={{ value: 'Risk score(%)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 13, fill: '#111827', fontWeight: 600 } }}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line
            type="linear"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
