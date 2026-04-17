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
    <div style={{ background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '8px 12px' }}>
      {label && <p style={{ color: 'var(--text-subtle)', fontSize: 10, marginBottom: 2 }}>{label}</p>}
      <p style={{ color: 'var(--text)', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-montserrat)' }}>
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
        color: details.score > 80 ? '#22c55e' : details.score > 50 ? '#f59e0b' : '#ff4d4d',
      })), [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 700, fill: 'var(--text-subtle)', textTransform: 'capitalize', fontFamily: 'var(--font-montserrat)' }}
            dy={8}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: 'var(--text-faint)' }}
            tickCount={5}
          />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={34}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    const chartData = useMemo(() => [
      { name: 'Critical',  value: data.critical,  color: '#ff4d4d' },
      { name: 'Warning',   value: data.warning,   color: '#f59e0b' },
      { name: 'Optimized', value: data.optimized, color: '#22c55e' },
    ].filter(d => d.value > 0), [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
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
