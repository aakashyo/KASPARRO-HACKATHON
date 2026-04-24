'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface StoreHealthChartsProps {
  type: 'bar' | 'pie' | 'radar';
  data: any;
}

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '10px 12px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      }}
    >
      {label && <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>{label}</p>}
      <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-head)' }}>
        {payload[0].name ? `${payload[0].name}: ` : ''}
        {payload[0].value}
        {label ? '/100' : ''}
      </p>
    </div>
  );
};

export default function StoreHealthCharts({ type, data }: StoreHealthChartsProps) {
  const barData = useMemo(
    () =>
      Object.entries(data || {}).map(([key, details]: [string, any]) => ({
        name: key.replace(/_/g, ' '),
        score: details.score,
        color: details.score > 80 ? 'var(--ok)' : details.score > 50 ? 'var(--warn)' : 'var(--danger)',
      })),
    [data]
  );

  const pieData = useMemo(
    () =>
      [
        { name: 'Critical', value: data?.critical, color: 'var(--danger)' },
        { name: 'Warning', value: data?.warning, color: 'var(--warn)' },
        { name: 'Optimized', value: data?.optimized, color: 'var(--ok)' },
      ].filter((item) => item.value > 0),
    [data]
  );

  const radarData = useMemo(
    () =>
      Object.entries(data || {}).map(([key, details]: [string, any]) => ({
        subject: key.replace(/_/g, ' '),
        score: details.score,
        fullMark: 100,
      })),
    [data]
  );

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--text-muted)' }}
            dy={8}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-faint)' }}
            tickCount={5}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={34}>
            {barData.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.88} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={56} outerRadius={84} paddingAngle={3} dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Radar
          name="AI Perception"
          dataKey="score"
          stroke="var(--accent)"
          fill="var(--accent)"
          fillOpacity={0.26}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
