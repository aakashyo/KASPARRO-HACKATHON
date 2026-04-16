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

export default function StoreHealthCharts({ type, data }: StoreHealthChartsProps) {
  if (type === 'bar') {
    const chartData = useMemo(() => {
      // data is data.store_score.dimension_scores
      return Object.entries(data).map(([key, details]: [string, any]) => ({
        name: key.replace('_', ' ').toUpperCase(),
        score: details.score,
        color: details.score > 80 ? '#10b981' : details.score > 50 ? '#f59e0b' : '#ef4444'
      }));
    }, [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#cbd5e1' }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
            }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    const chartData = useMemo(() => {
      // data is { critical, warning, optimized }
      return [
        { name: 'Critical', value: data.critical, color: '#ef4444' },
        { name: 'Warning', value: data.warning, color: '#f59e0b' },
        { name: 'Optimized', value: data.optimized, color: '#10b981' },
      ].filter(d => d.value > 0);
    }, [data]);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
