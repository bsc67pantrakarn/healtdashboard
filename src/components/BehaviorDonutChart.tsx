import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieIcon, Cigarette, Dumbbell, Wine, Activity, Sparkles } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface BehaviorDonutChartProps {
  patients: ParsedPatient[];
  theme?: ThemeConfig;
}

type Mode = 'risk' | 'smoking' | 'exercise' | 'alcohol';

export const BehaviorDonutChart: React.FC<BehaviorDonutChartProps> = ({ patients, theme }) => {
  const [mode, setMode] = useState<Mode>('smoking');

  // Compute Data based on mode with bright vibrant color palette
  const getChartData = () => {
    if (mode === 'risk') {
      const high = patients.filter((p) => p.riskLevel === 'สูง').length;
      const mid = patients.filter((p) => p.riskLevel === 'ปานกลาง').length;
      const low = patients.filter((p) => p.riskLevel === 'ต่ำ').length;
      return [
        { name: 'กลุ่มเสี่ยงสูง (High Risk)', value: high, color: '#F43F5E' },
        { name: 'กลุ่มเสี่ยงปานกลาง (Medium)', value: mid, color: '#F59E0B' },
        { name: 'กลุ่มเสี่ยงต่ำ (Low Risk)', value: low, color: '#10B981' },
      ].filter((d) => d.value > 0);
    }

    if (mode === 'smoking') {
      const smokerHigh = patients.filter((p) => p.smoking === 'สูบ' && p.riskLevel === 'สูง').length;
      const smokerOther = patients.filter((p) => p.smoking === 'สูบ' && p.riskLevel !== 'สูง').length;
      const nonSmokerHigh = patients.filter((p) => p.smoking === 'ไม่สูบ' && p.riskLevel === 'สูง').length;
      const nonSmokerLow = patients.filter((p) => p.smoking === 'ไม่สูบ' && p.riskLevel !== 'สูง').length;

      return [
        { name: 'สูบบุหรี่ + เสี่ยงสูง', value: smokerHigh, color: '#F43F5E' },
        { name: 'สูบบุหรี่ + เสี่ยงกลาง/ต่ำ', value: smokerOther, color: '#FB923C' },
        { name: 'ไม่สูบ + เสี่ยงสูง', value: nonSmokerHigh, color: '#8B5CF6' },
        { name: 'ไม่สูบ + เสี่ยงกลาง/ต่ำ', value: nonSmokerLow, color: '#06B6D4' },
      ].filter((d) => d.value > 0);
    }

    if (mode === 'exercise') {
      const noExHigh = patients.filter((p) => p.exercise === 'ไม่ออกกำลังกาย' && p.riskLevel === 'สูง').length;
      const noExOther = patients.filter((p) => p.exercise === 'ไม่ออกกำลังกาย' && p.riskLevel !== 'สูง').length;
      const someEx = patients.filter((p) => p.exercise === 'บางครั้ง').length;
      const regEx = patients.filter((p) => p.exercise === 'สม่ำเสมอ').length;

      return [
        { name: 'ไม่ออกกำลังกาย + เสี่ยงสูง', value: noExHigh, color: '#F43F5E' },
        { name: 'ไม่ออกกำลังกาย + กลาง/ต่ำ', value: noExOther, color: '#F97316' },
        { name: 'ออกกำลังกายบางครั้ง', value: someEx, color: '#38BDF8' },
        { name: 'ออกกำลังกายสม่ำเสมอ', value: regEx, color: '#10B981' },
      ].filter((d) => d.value > 0);
    }

    // Alcohol
    const drinkHigh = patients.filter((p) => p.alcohol === 'ดื่ม' && p.riskLevel === 'สูง').length;
    const drinkOther = patients.filter((p) => p.alcohol === 'ดื่ม' && p.riskLevel !== 'สูง').length;
    const noDrinkHigh = patients.filter((p) => p.alcohol === 'ไม่ดื่ม' && p.riskLevel === 'สูง').length;
    const noDrinkLow = patients.filter((p) => p.alcohol === 'ไม่ดื่ม' && p.riskLevel !== 'สูง').length;

    return [
      { name: 'ดื่มแอลกอฮอล์ + เสี่ยงสูง', value: drinkHigh, color: '#F43F5E' },
      { name: 'ดื่มแอลกอฮอล์ + กลาง/ต่ำ', value: drinkOther, color: '#FB923C' },
      { name: 'ไม่ดื่ม + เสี่ยงสูง', value: noDrinkHigh, color: '#8B5CF6' },
      { name: 'ไม่ดื่ม + เสี่ยงกลาง/ต่ำ', value: noDrinkLow, color: '#10B981' },
    ].filter((d) => d.value > 0);
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>พฤติกรรมสุขภาพกับความเสี่ยง</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Behavior & Risk
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                สัดส่วนพฤติกรรมเสี่ยง (บุหรี่ / ออกกำลังกาย / สุรา)
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Selector Tabs ("ลูกเล่นแท็บพฤติกรรม") */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl mb-2 text-xs overflow-x-auto shadow-2xs">
          <button
            onClick={() => setMode('smoking')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mode === 'smoking'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cigarette className="w-3.5 h-3.5 text-amber-500" />
            <span>สูบบุหรี่</span>
          </button>
          <button
            onClick={() => setMode('exercise')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mode === 'exercise'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 text-cyan-500" />
            <span>ออกกำลังกาย</span>
          </button>
          <button
            onClick={() => setMode('alcohol')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mode === 'alcohol'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wine className="w-3.5 h-3.5 text-purple-500" />
            <span>สุรา/แอลกอฮอล์</span>
          </button>
          <button
            onClick={() => setMode('risk')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              mode === 'risk'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>ความเสี่ยงรวม</span>
          </button>
        </div>

        {/* Chart */}
        <div className="h-64 mt-2 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const percent = total > 0 ? ((Number(data.value) / total) * 100).toFixed(1) : '0';
                    return (
                      <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl text-xs backdrop-blur-md border border-slate-700/80">
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }}></span>
                          <span>{data.name}</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 text-slate-300">
                          <span>จำนวน:</span>
                          <span className="font-mono font-bold text-white text-sm">
                            {data.value} ราย ({percent}%)
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                formatter={(val) => <span className="text-slate-600 font-medium">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Stat Inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-7">
            <span className="text-2xl font-black font-mono text-slate-800">
              {total}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ผู้ป่วย
            </span>
          </div>
        </div>
      </div>

      {/* Insight Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          การไม่สูบบุหรี่และออกกำลังกายสัมพันธ์กับความเสี่ยงที่ต่ำลงอย่างมีนัยสำคัญ
        </span>
      </div>
    </div>
  );
};
