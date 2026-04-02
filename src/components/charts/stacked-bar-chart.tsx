'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Image from 'next/image';

const data = [
  { name: 'slack', critical: 3, risky: 0 },
  { name: 'github', critical: 3, risky: 0 },
  { name: 'postgres', critical: 3, risky: 0 },
  { name: 'anthropic', critical: 0, risky: 2 },
  { name: 'gitlab', critical: 0, risky: 2 },
  { name: 'openai', critical: 1, risky: 1 },
  { name: 'key', critical: 0, risky: 1 },
  { name: 'azure', critical: 0, risky: 1 },
  { name: 'huggingface', critical: 0, risky: 1 },
  { name: '9', critical: 0, risky: 1 },
  { name: 'Others', critical: 3, risky: 2 },
];

export function StackedBarChart() {
  return (
    <div className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 0, right: 0, left: 10, bottom: 20 }}
          barSize={40}
        >
          <CartesianGrid vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={CustomXAxisTick}
            interval={0}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={40}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, 10]}
            interval={0}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            label={{ value: 'Total Secrets', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280', fontWeight: 500 } }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="square"
            iconSize={10}
            formatter={(value) => <span className="text-gray-600 font-medium text-xs ml-1">{value}</span>}
            wrapperStyle={{ top: 0, paddingBottom: 20 }}
          />
          {/* Colors strictly matching Figma: Critical is light red/pink, Risky is light yellow with darker solid borders */}
          <Bar dataKey="risky" stackId="a" fill="#fef08a" stroke="#facc15" strokeWidth={1} name="Risky" />
          <Bar dataKey="critical" stackId="a" fill="#fecaca" stroke="#f87171" strokeWidth={1} name="Critical" />

        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const hasIcon = [
    'slack', 'github', 'postgres', 'gitlab', 'openai', 'key', 'azure', 'huggingface'
  ].includes(payload.value);

  if (hasIcon) {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-10} y={4} width={20} height={20}>
          <img
            src={`/icons/${payload.value}.png`}
            alt={payload.value}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.innerHTML = `<svg width="20" height="20"><text x="10" y="15" text-anchor="middle" fill="#666" font-size="12" font-weight="500">${payload.value.charAt(0).toUpperCase()}</text></svg>`;
              }
            }}
          />
        </foreignObject>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12" fontWeight="500">
        {payload.value === 'Others' ? 'Others' : payload.value.charAt(0).toUpperCase()}
      </text>
    </g>
  );
};
