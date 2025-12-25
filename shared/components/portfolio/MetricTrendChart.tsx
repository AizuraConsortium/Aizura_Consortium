/**
 * MetricTrendChart Component
 *
 * Displays a simple line chart for visualizing metric trends over time.
 * Uses SVG for rendering without external chart libraries.
 */

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card.js';
import { cn } from '@shared/styles/theme';
import type { BusinessMetricsTimeSeries, MetricDataPoint } from '@shared/types/portfolio';

interface MetricTrendChartProps {
  data: BusinessMetricsTimeSeries;
  title?: string;
  height?: number;
  showGrid?: boolean;
  className?: string;
  valueFormatter?: (value: number) => string;
  loading?: boolean;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatValue(value: number, metricType: string): string {
  switch (metricType) {
    case 'revenue':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: value >= 10000 ? 'compact' : 'standard',
        compactDisplay: 'short',
      }).format(value);
    case 'users':
    case 'transactions':
    case 'api_calls':
      return new Intl.NumberFormat('en-US', {
        notation: value >= 1000 ? 'compact' : 'standard',
        compactDisplay: 'short',
      }).format(value);
    default:
      return String(value);
  }
}

function calculateChartPoints(
  dataPoints: MetricDataPoint[],
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): ChartPoint[] {
  if (dataPoints.length === 0) return [];

  const values = dataPoints.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const pointSpacing = chartWidth / Math.max(dataPoints.length - 1, 1);

  return dataPoints.map((point, index) => {
    const x = padding.left + index * pointSpacing;
    const normalizedValue = (point.value - minValue) / valueRange;
    const y = padding.top + chartHeight - normalizedValue * chartHeight;

    return {
      x,
      y,
      value: point.value,
      label: formatDate(point.period_start),
    };
  });
}

function createLinePath(points: ChartPoint[]): string {
  if (points.length === 0) return '';

  const path = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    })
    .join(' ');

  return path;
}

/**
 * MetricTrendChart displays a line chart for metric trends
 *
 * @example
 * <MetricTrendChart
 *   data={metricsTimeSeries}
 *   title="Revenue Trend"
 *   showGrid={true}
 * />
 */
export function MetricTrendChart({
  data,
  title,
  height = 300,
  showGrid = true,
  className,
  valueFormatter,
  loading = false,
}: MetricTrendChartProps) {
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const width = 600;

  const chartPoints = useMemo(
    () => calculateChartPoints(data.data_points, width, height, padding),
    [data.data_points, width, height]
  );

  const linePath = useMemo(() => createLinePath(chartPoints), [chartPoints]);

  const areaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const line = createLinePath(chartPoints);
    const firstPoint = chartPoints[0];
    const lastPoint = chartPoints[chartPoints.length - 1];
    return `${line} L ${lastPoint.x} ${height - padding.bottom} L ${firstPoint.x} ${height - padding.bottom} Z`;
  }, [chartPoints, height, padding.bottom]);

  const minValue = Math.min(...data.data_points.map(d => d.value));
  const maxValue = Math.max(...data.data_points.map(d => d.value));

  const displayFormatter = valueFormatter || ((v: number) => formatValue(v, data.metric_type));

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        {title && (
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32" />
          </CardHeader>
        )}
        <div className="h-64 bg-gray-200 rounded" />
      </Card>
    );
  }

  if (data.data_points.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}

      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {showGrid && (
            <g className="grid-lines">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding.top + (height - padding.top - padding.bottom) * (1 - ratio);
                return (
                  <line
                    key={ratio}
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          )}

          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          <path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${point.label}: ${displayFormatter(point.value)}`}</title>
            </circle>
          ))}

          <g className="y-axis-labels">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const value = minValue + (maxValue - minValue) * ratio;
              const y = padding.top + (height - padding.top - padding.bottom) * (1 - ratio);
              return (
                <text
                  key={ratio}
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-600"
                >
                  {displayFormatter(value)}
                </text>
              );
            })}
          </g>

          <g className="x-axis-labels">
            {chartPoints.filter((_, i) => i % Math.ceil(chartPoints.length / 5) === 0 || i === chartPoints.length - 1).map((point) => (
              <text
                key={point.label}
                x={point.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {point.label}
              </text>
            ))}
          </g>
        </svg>

        {data.trend && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Trend:</span>
            <span className={cn(
              'font-medium',
              data.trend.direction === 'up' && 'text-green-600',
              data.trend.direction === 'down' && 'text-red-600',
              data.trend.direction === 'stable' && 'text-gray-600'
            )}>
              {data.trend.direction === 'up' && '↑'}
              {data.trend.direction === 'down' && '↓'}
              {data.trend.direction === 'stable' && '→'}
              {' '}
              {data.trend.change_percent}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
