import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Calendar, Sparkles, Activity } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface HealthTrendLineChartProps {
  patients: ParsedPatient[];
  theme?: ThemeConfig;
}

type TrendMetric = 'all' | 'sugar' | 'sbp' | 'bmi';

const MONTH_LABELS: Record<string, string> = {
  '2026-01': 'ม.ค. 2026 (Jan)',
  '2026-02': 'ก.พ. 2026 (Feb)',
  '2026-03': 'มี.ค. 2026 (Mar)',
};

export const HealthTrendLineChart: React.FC<HealthTrendLineChartProps> = ({ patients, theme }) => {
  const [metric, setMetric] = useState<TrendMetric>('all');

  const distinctMonths = Array.from(new Set(patients.map((p) => p.month).filter(Boolean))).sort();

  const trendData = distinctMonths.map((m) => {
    const monthPatients = patients.filter((p) => p.month === m);
    const count = monthPatients.length;
    if (count === 0) {
      return {
        month: m,
        label: MONTH_LABELS[m] || m,
        avgSugar: 0,
        avgSBP: 0,
        avgBMI: 0,
        highRiskCount: 0,
        patientCount: 0,
      };
    }

    const sumSugar = monthPatients.reduce((acc, p) => acc + (p.bloodSugar || 0), 0);
    const sumSBP = monthPatients.reduce((acc, p) => acc + (p.sbp || 0), 0);
    const sumBMI = monthPatients.reduce((acc, p) => acc + (p.bmi || 0), 0);
    const highRiskCount = monthPatients.filter((p) => p.riskLevel === 'สูง').length;

    return {
      month: m,
      label: MONTH_LABELS[m] || m,
      avgSugar: Number((sumSugar / count).toFixed(1)),
      avgSBP: Number((sumSBP / count).toFixed(1)),
      avgBMI: Number((sumBMI / count).toFixed(1)),
      highRiskCount,
      patientCount: count,
    };
  });

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between mb-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>แนวโน้มสุขภาพตามช่วงเวลา</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Trend Timeline
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์แนวโน้มค่าเฉลี่ยตัวชี้วัดสุขภาพรายเดือน (ม.ค. - มี.ค. 2026)
              </p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl text-xs overflow-x-auto shadow-2xs">
            <button
              onClick={() => setMetric('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                metric === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แสดงทั้งหมด
            </button>
            <button
              onClick={() => setMetric('sugar')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                metric === 'sugar' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              น้ำตาล (Sugar)
            </button>
            <button
              onClick={() => setMetric('sbp')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                metric === 'sbp' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              ความดัน (SBP)
            </button>
            <button
              onClick={() => setMetric('bmi')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                metric === 'bmi' ? 'bg-teal-600 text-white shadow-xs' : 'text-teal-600 hover:bg-teal-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              BMI
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl text-xs backdrop-blur-md border border-slate-700/80 min-w-[200px]">
                        <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 text-sm mb-1.5">
                          {label}
                        </div>
                        <div className="space-y-1.5 text-slate-200">
                          {payload.map((entry: any, i: number) => (
                            <div key={i} className="flex justify-between gap-4">
                              <span style={{ color: entry.color }} className="font-bold">
                                {entry.name}:
                              </span>
                              <span className="font-mono font-bold text-white">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(val) => <span className="text-slate-600 font-semibold">{val}</span>}
              />

              {/* Blood Sugar Reference Threshold (126 mg/dL) */}
              {(metric === 'all' || metric === 'sugar') && (
                <ReferenceLine
                  y={126}
                  stroke="#F43F5E"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'เกณฑ์เบาหวาน 126 mg/dL',
                    fill: '#F43F5E',
                    fontSize: 10,
                    position: 'top',
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Blood Pressure Reference Threshold (140 mmHg) */}
              {(metric === 'all' || metric === 'sbp') && (
                <ReferenceLine
                  y={140}
                  stroke="#8B5CF6"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'เกณฑ์ความดันสูง 140 mmHg',
                    fill: '#8B5CF6',
                    fontSize: 10,
                    position: 'top',
                    fontWeight: 700,
                  }}
                />
              )}

              {(metric === 'all' || metric === 'sbp') && (
                <Line
                  type="monotone"
                  dataKey="avgSBP"
                  name="ความดันตัวบนเฉลี่ย SBP (mmHg)"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366F1', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 3, fill: '#FFFFFF' }}
                />
              )}

              {(metric === 'all' || metric === 'sugar') && (
                <Line
                  type="monotone"
                  dataKey="avgSugar"
                  name="น้ำตาลในเลือดเฉลี่ย FBS (mg/dL)"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#EC4899', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 8, stroke: '#EC4899', strokeWidth: 3, fill: '#FFFFFF' }}
                />
              )}

              {(metric === 'all' || metric === 'bmi') && (
                <Line
                  type="monotone"
                  dataKey="avgBMI"
                  name="BMI เฉลี่ย (kg/m²)"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#14B8A6', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 8, stroke: '#14B8A6', strokeWidth: 3, fill: '#FFFFFF' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          ติดตามเปรียบเทียบแนวโน้มระหว่างเดือนเพื่อประเมินความสำเร็จของมาตรการสาธารณสุข
        </span>
      </div>
    </div>
  );
};
