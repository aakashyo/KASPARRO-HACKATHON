'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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
    </motion.div>
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
        { name: 'Critical', value: data?.critical, color: '#E11D48' },
        { name: 'Warning', value: data?.warning, color: '#F97316' },
        { name: 'Optimized', value: data?.optimized, color: '#059669' },
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', height: '100%' }}
      >
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
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={34}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.score > 80 ? '#059669' : entry.score > 50 ? '#F97316' : '#E11D48'} opacity={0.94} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (type === 'pie') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} opacity={1} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -5 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Radar
            name="AI Perception"
            dataKey="score"
            stroke="#2563EB"
            fill="#06B6D4"
            fillOpacity={0.22}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
