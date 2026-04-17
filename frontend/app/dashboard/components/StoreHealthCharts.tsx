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

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1f1f24', border: '1px solid #27272a', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {label && <p style={{ color: '#71717a', fontSize: 10, marginBottom: 2 }}>{label}</p>}
      <p style={{ color: '#fafafa', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)' }}>
        {payload[0].name ? `${payload[0].name}: ` : ''}{payload[0].value}{label ? '/100' : ''}
      </p>
    </div>
  );
};

export default function StoreHealthCharts({ type, data }: StoreHealthChartsProps) {
  if (type === 'bar') {
    const chartData = useMemo(() =>
      Object.entries(data).map(([key, details]: [string, any]) => ({
        name: key.replace(/_/g, ' '),
        score: details.score,
        color: details.score > 80 ? '#22c55e' : details.score > 50 ? '#f59e0b' : '#ef4444',
      })), [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1c1c1f" />
          <XAxis dataKey="name" axisLine={false} tickLine={false}
            tick={{ fontSize: 10, fontWeight: 600, fill: '#71717a' }} dy={8} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false}
            tick={{ fontSize: 10, fill: '#3f3f46' }} tickCount={5} />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={36}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    const chartData = useMemo(() => [
      { name: 'Critical',  value: data.critical,  color: '#ef4444' },
      { name: 'Warning',   value: data.warning,   color: '#f59e0b' },
      { name: 'Optimized', value: data.optimized, color: '#22c55e' },
    ].filter(d => d.value > 0), [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<DarkTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
