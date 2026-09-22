import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { AlertTriangle, Users, Sparkles, Flame } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface RiskBarChartProps {
  patients: ParsedPatient[];
  theme?: ThemeConfig;
}

interface AgeGroupData {
  ageGroup: string;
  highRiskCount: number;
  totalCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  percentage: number;
}

const AGE_GROUPS = ['< 30 ปี', '30 - 44 ปี', '45 - 59 ปี', '60+ ปี'];

export const RiskBarChart: React.FC<RiskBarChartProps> = ({ patients, theme }) => {
  const chartData: AgeGroupData[] = AGE_GROUPS.map((group) => {
    const groupPatients = patients.filter((p) => p.ageGroup === group);
    const highRisk = groupPatients.filter((p) => p.riskLevel === 'สูง').length;
    const moderateRisk = groupPatients.filter((p) => p.riskLevel === 'ปานกลาง').length;
    const lowRisk = groupPatients.filter((p) => p.riskLevel === 'ต่ำ').length;
    const total = groupPatients.length;
    const percentage = total > 0 ? Number(((highRisk / total) * 100).toFixed(1)) : 0;

    return {
      ageGroup: group,
      highRiskCount: highRisk,
      totalCount: total,
      moderateRiskCount: moderateRisk,
      lowRiskCount: lowRisk,
      percentage,
    };
  });

  const totalHighRisk = chartData.reduce((sum, d) => sum + d.highRiskCount, 0);

  // Vibrant energetic colors per age group
  const barColors = ['#818CF8', '#38BDF8', '#FB7185', '#F43F5E'];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>กลุ่มอายุที่มีความเสี่ยงสูง</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  High Risk by Age
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                แกน X: กลุ่มช่วงอายุ | แกน Y: จำนวนผู้ป่วยกลุ่มเสี่ยงสูง (ราย)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full shrink-0 shadow-2xs">
            รวมเสี่ยงสูง {totalHighRisk} ราย
          </span>
        </div>

        {/* Chart */}
        <div className="h-64 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="ageGroup" 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.06)', radius: 12 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as AgeGroupData;
                    return (
                      <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl text-xs backdrop-blur-md border border-slate-700/80 min-w-[210px]">
                        <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 text-sm mb-1.5">
                          {data.ageGroup}
                        </div>
                        <div className="space-y-1.5 text-slate-200">
                          <div className="flex justify-between gap-4">
                            <span className="text-rose-400 font-bold">🔴 กลุ่มเสี่ยงสูง:</span>
                            <span className="font-mono font-bold text-white bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/40">
                              {data.highRiskCount} ราย ({data.percentage}%)
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-amber-400">🟡 กลุ่มเสี่ยงปานกลาง:</span>
                            <span className="font-mono font-semibold">{data.moderateRiskCount} ราย</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-emerald-400">🟢 กลุ่มเสี่ยงต่ำ:</span>
                            <span className="font-mono font-semibold">{data.lowRiskCount} ราย</span>
                          </div>
                          <div className="pt-2 mt-1 border-t border-slate-700 flex justify-between gap-4 text-slate-400">
                            <span>รวมทั้งหมดในกลุ่มนี้:</span>
                            <span className="font-mono font-bold text-white">{data.totalCount} ราย</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                formatter={(val) => <span className="text-slate-600 font-semibold">{val}</span>}
              />
              <Bar 
                dataKey="highRiskCount" 
                name="ผู้ป่วยเสี่ยงสูง (ราย)" 
                radius={[10, 10, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barColors[index % barColors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          กลุ่มเสี่ยงสูงสุด: <strong className="text-slate-800">60+ ปี และ 45-59 ปี</strong>
        </span>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          เกณฑ์คะแนน NCDs
        </span>
      </div>
    </div>
  );
};
