"use client";

import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';

export interface TrendData {
  x: string | number;
  y: number;
}

interface TrendSparklineProps {
  data: TrendData[];
  title?: string;
  height?: number;
}

export function TrendSparkline({ 
  data,
  title = "Engagement Trend",
  height = 120
}: TrendSparklineProps) {
  const formattedData = [{
    id: 'trend',
    data: data.map(d => ({ x: d.x, y: d.y }))
  }];

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div style={{ height }}>
        <ResponsiveLine
          data={formattedData}
          margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          colors={['#6366f1']}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#9ca3af',
                  fontSize: 10,
                }
              }
            }
          }}
          animate={true}
          motionConfig="gentle"
        />
      </div>
    </motion.div>
  );
} 