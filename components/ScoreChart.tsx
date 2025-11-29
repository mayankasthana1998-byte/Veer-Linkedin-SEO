import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  score: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  // Determine color based on score
  let color = '#ef4444'; // Red (bad)
  if (score > 50) color = '#eab308'; // Yellow (okay)
  if (score > 80) color = '#22c55e'; // Green (good)
  if (score > 95) color = '#818cf8'; // Indigo/Perfect (excellent)

  return (
    <div className="relative h-48 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-score" fill={color} />
            <Cell key="cell-remaining" fill="#334155" /> {/* Slate-700 */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-4xl font-bold text-white block">{score}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">SEO Score</span>
      </div>
    </div>
  );
};

export default ScoreChart;
