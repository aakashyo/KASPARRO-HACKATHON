import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  label: string;
  score: number;
  reason: string;
}

export default function ScoreCard({ label, score, reason, onClick }: ScoreCardProps & { onClick?: () => void }) {
  const isGood = score > 80;
  const isOk = score > 50;
  const color = isGood ? 'var(--ok)' : isOk ? 'var(--warn)' : 'var(--danger)';
  const colorSoft = isGood ? 'var(--ok-soft)' : isOk ? 'var(--warn-soft)' : 'var(--danger-soft)';

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? {
        y: -6,
        borderColor: color,
        boxShadow: `0 12px 28px -12px ${isGood ? 'rgba(5, 150, 105, 0.35)' : isOk ? 'rgba(249, 115, 22, 0.35)' : 'rgba(225, 29, 72, 0.35)'}`
      } : { y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '20px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${colorSoft}, transparent)`,
          opacity: 0,
          pointerEvents: 'none'
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontFamily: 'var(--font-head)', lineHeight: 1.3 }}>
        {label}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <motion.span 
          style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 900, lineHeight: 1, color }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/100</span>
      </div>
      
      <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        <motion.div 
          style={{ height: '100%', borderRadius: 99, background: color, width: `${score}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      
      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 2 }}>{reason}</p>
    </motion.div>
  );
}
