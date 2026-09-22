import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Activity, Droplets, Heart, Sparkles } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface CorrelationScatterPlotsProps {
  patients: ParsedPatient[];
  onSelectPatient?: (patient: ParsedPatient) => void;
  theme?: ThemeConfig;
}

export const CorrelationScatterPlots: React.FC<CorrelationScatterPlotsProps> = ({
  patients,
  onSelectPatient,
  theme,
}) => {
  const [activePlot, setActivePlot] = useState<'sugar' | 'bp' | 'both'>('sugar');

  const scatterSugarData = patients.map((p) => ({
    x: p.bmi,
    y: p.bloodSugar,
    patient: p,
  }));

  const scatterBPData = patients.map((p) => ({
    x: p.bmi,
    y: p.sbp,
    patient: p,
  }));

  const getPointColor = (risk: string) => {
    if (risk === 'สูง') return '#F43F5E'; // Vibrant Rose
    if (risk === 'ปานกลาง') return '#F59E0B'; // Vibrant Amber
    return '#10B981'; // Vibrant Emerald
  };

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const p: ParsedPatient = data.patient;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl text-xs backdrop-blur-md border border-slate-700/80 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 font-mono text-sm">
              {p.id}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                p.riskLevel === 'สูง'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : p.riskLevel === 'ปานกลาง'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              เสี่ยง{p.riskLevel}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-400">ข้อมูลทั่วไป:</span>
              <span className="font-semibold">{p.gender} • {p.age} ปี • {p.area}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">BMI:</span>
              <span className="font-mono font-bold text-cyan-300">{p.bmi} kg/m²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">น้ำตาลในเลือด:</span>
              <span className={`font-mono font-bold ${p.bloodSugar > 126 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {p.bloodSugar} mg/dL {p.bloodSugar > 126 ? '⚠️' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ความดัน SBP/DBP:</span>
              <span className={`font-mono font-bold ${p.sbp >= 140 ? 'text-rose-400' : 'text-slate-200'}`}>
                {p.sbp}/{p.dbp} mmHg
              </span>
            </div>
            <div className="pt-2 mt-1 border-t border-slate-700/80 text-[10px] text-slate-400 text-center">
              คลิกเพื่อดูประวัติเวชระเบียนรายคน
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 mb-6">
      {/* Header and View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>ความสัมพันธ์โรคเรื้อรัง (NCDs Correlation)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Scatter Analysis
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              วิเคราะห์ความเชื่อมโยงระหว่างดัชนีมวลกาย (BMI) กับระดับน้ำตาลและความดันโลหิต
            </p>
          </div>
        </div>

        {/* View Switcher Tabs ("ลูกเล่นสลับมุมมอง") */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl text-xs overflow-x-auto shadow-2xs">
          <button
            onClick={() => setActivePlot('sugar')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activePlot === 'sugar'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>1. BMI vs น้ำตาล</span>
          </button>
          <button
            onClick={() => setActivePlot('bp')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activePlot === 'bp'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>2. BMI vs ความดัน</span>
          </button>
          <button
            onClick={() => setActivePlot('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
              activePlot === 'both'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            เทียบ 2 มุมมอง
          </button>
        </div>
      </div>

      {/* Plots Container */}
      <div className={`grid gap-6 ${activePlot === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Scatter 1: BMI vs Blood Sugar */}
        {(activePlot === 'sugar' || activePlot === 'both') && (
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">
                  BMI กับระดับน้ำตาลในเลือด (Blood Sugar)
                </span>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                เกณฑ์เบาหวาน &gt; 126 mg/dL
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="BMI"
                    domain={[18, 35]}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    label={{ value: 'แกน X: ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -12, fill: '#64748B', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Blood Sugar"
                    domain={[70, 180]}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    label={{ value: 'แกน Y: น้ำตาลในเลือด (mg/dL)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748B', fontSize: 11 }}
                  />
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
                  <ReferenceLine
                    x={25}
                    stroke="#0284C7"
                    strokeDasharray="4 4"
                    strokeWidth={1.2}
                    label={{
                      value: 'เริ่มอ้วน (BMI 25)',
                      fill: '#0284C7',
                      fontSize: 10,
                      position: 'insideTopRight',
                      fontWeight: 700,
                    }}
                  />
                  <Tooltip content={renderTooltip} />
                  <Scatter 
                    name="ผู้ป่วย" 
                    data={scatterSugarData} 
                    onClick={(node: any) => {
                      const p = node?.payload?.patient || node?.patient;
                      if (p && onSelectPatient) onSelectPatient(p);
                    }}
                    className="cursor-pointer"
                  >
                    {scatterSugarData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPointColor(entry.patient.riskLevel)}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Scatter 2: BMI vs SBP */}
        {(activePlot === 'bp' || activePlot === 'both') && (
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">
                  BMI กับความดันโลหิตตัวบน (Systolic BP)
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                เกณฑ์ความดันสูง &ge; 140 mmHg
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="BMI"
                    domain={[18, 35]}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    label={{ value: 'แกน X: ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -12, fill: '#64748B', fontSize: 11 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Systolic BP"
                    domain={[100, 180]}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    label={{ value: 'แกน Y: ความดันตัวบน SBP (mmHg)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748B', fontSize: 11 }}
                  />
                  <ReferenceLine
                    y={140}
                    stroke="#8B5CF6"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'ความดันสูง (140 mmHg)',
                      fill: '#8B5CF6',
                      fontSize: 10,
                      position: 'top',
                      fontWeight: 700,
                    }}
                  />
                  <ReferenceLine
                    x={25}
                    stroke="#0284C7"
                    strokeDasharray="4 4"
                    strokeWidth={1.2}
                    label={{
                      value: 'เริ่มอ้วน (BMI 25)',
                      fill: '#0284C7',
                      fontSize: 10,
                      position: 'insideTopRight',
                      fontWeight: 700,
                    }}
                  />
                  <Tooltip content={renderTooltip} />
                  <Scatter 
                    name="ผู้ป่วย" 
                    data={scatterBPData} 
                    onClick={(node: any) => {
                      const p = node?.payload?.patient || node?.patient;
                      if (p && onSelectPatient) onSelectPatient(p);
                    }}
                    className="cursor-pointer"
                  >
                    {scatterBPData.map((entry, index) => (
                      <Cell
                        key={`cell-bp-${index}`}
                        fill={getPointColor(entry.patient.riskLevel)}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">คำอธิบายสีจุด:</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>เสี่ยงสูง (High Risk)</span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>เสี่ยงปานกลาง</span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>เสี่ยงต่ำ</span>
          </span>
        </div>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          คลิกจุดบนกราฟเพื่อเปิดดูประวัติรายคน
        </span>
      </div>
    </div>
  );
};
