'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  totalValue: string | number;
  label: string;
}

export function DonutChart({ data, totalValue, label }: DonutChartProps) {
  return (
    <div className="relative h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={110}
            outerRadius={130}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end pb-2">
        <span className="text-4xl font-bold text-gray-900 leading-none">{totalValue}</span>
        <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
      </div>
    </div>
  );
}
