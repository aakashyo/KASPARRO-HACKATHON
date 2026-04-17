'use client';

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

interface StoreHealthChartsProps {
  type: 'bar' | 'pie';
  data: any;
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-[#6b6b80] mb-0.5">{label}</p>
      <p className="font-bold text-[#f0f0f5]">{payload[0].value}<span className="text-[#6b6b80]">/100</span></p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16161f] border border-[#2a2a3a] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-bold text-[#f0f0f5]">{payload[0].name}: {payload[0].value}</p>
    </div>
  );
};

export default function StoreHealthCharts({ type, data }: StoreHealthChartsProps) {
  if (type === 'bar') {
    const chartData = useMemo(() =>
      Object.entries(data).map(([key, details]: [string, any]) => ({
        name: key.replace(/_/g, ' '),
        score: details.score,
        color: details.score > 80 ? '#4ade80' : details.score > 50 ? '#fbbf24' : '#f87171',
      })),
    [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f2e" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 600, fill: '#6b6b80', textTransform: 'capitalize' }}
            dy={8}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#3a3a4d' }}
            tickCount={5}
          />
          <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={36}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    const chartData = useMemo(() => [
      { name: 'Critical', value: data.critical, color: '#f87171' },
      { name: 'Warning', value: data.warning, color: '#fbbf24' },
      { name: 'Optimized', value: data.optimized, color: '#4ade80' },
    ].filter(d => d.value > 0), [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
