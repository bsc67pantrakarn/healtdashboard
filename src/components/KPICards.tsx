import React from 'react';
import { Users, Scale, Droplet, AlertOctagon, TrendingUp, Sparkles, HeartPulse, ShieldAlert } from 'lucide-react';
import { KPISummary } from '../types';
import { ThemeConfig } from '../theme';

interface KPICardsProps {
  kpis: KPISummary;
  theme?: ThemeConfig;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, theme }) => {
  const isSugarCritical = kpis.maxBloodSugar > 126;
  const isBMIElevated = kpis.avgBMI >= 25.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Total Patients */}
      <div className="group bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-indigo-500/15 via-purple-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
              <span>จำนวนผู้ป่วยทั้งหมด</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Total Records from Sheet</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25 group-hover:rotate-6 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">
            {kpis.totalPatients}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">รายในชีท</span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            ข้อมูลสมบูรณ์
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[11px] shadow-2xs">
            100% สดจากชีท
          </span>
        </div>
      </div>

      {/* KPI 2: Average BMI */}
      <div className="group bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-cyan-500/15 via-teal-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              ค่าเฉลี่ยดัชนีมวลกาย
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Average BMI (Mean)</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25 group-hover:rotate-6 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800 font-mono tracking-tight group-hover:text-cyan-600 transition-colors">
            {kpis.avgBMI > 0 ? kpis.avgBMI.toFixed(1) : '-'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">kg/m²</span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">เกณฑ์เอเชีย:</span>
          {isBMIElevated ? (
            <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px]">
              🟡 เริ่มท้วม (≥25)
            </span>
          ) : (
            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
              🟢 เกณฑ์สมส่วน
            </span>
          )}
        </div>
      </div>

      {/* KPI 3: Max Blood Sugar */}
      <div className="group bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-500/15 via-pink-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              ระดับน้ำตาลสูงสุด
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Max Fasting Blood Sugar</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 group-hover:rotate-6 transition-transform">
            <Droplet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className={`text-3xl font-black font-mono tracking-tight ${isSugarCritical ? 'text-rose-600' : 'text-slate-800'}`}>
            {kpis.maxBloodSugar > 0 ? kpis.maxBloodSugar : '-'}
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">mg/dL</span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">เกณฑ์เฝ้าระวัง:</span>
          {isSugarCritical ? (
            <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              &gt; 126 เกินเกณฑ์
            </span>
          ) : (
            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
              🟢 ปกติ (&le;126)
            </span>
          )}
        </div>
      </div>

      {/* KPI 4: High Risk Proportion */}
      <div className="group bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-red-500/15 via-orange-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 tracking-wide uppercase">
              สัดส่วนกลุ่มเสี่ยงสูง
            </div>
            <div className="text-[11px] text-slate-400 font-medium">High Risk Rate (%)</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25 group-hover:rotate-6 transition-transform">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-rose-600 font-mono tracking-tight">
            {kpis.highRiskPercentage}%
          </span>
          <span className="text-xs font-bold text-slate-500">
            ({kpis.highRiskCount}/{kpis.totalPatients} ราย)
          </span>
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            ต้องดูแลใกล้ชิด
          </span>
          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[11px]">
            ⚡ High Priority
          </span>
        </div>
      </div>
    </div>
  );
};
