import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CalendarDays,
  Zap,
  Sparkles,
  Flame,
  Activity,
  Heart
} from 'lucide-react';
import { FilterState } from '../types';
import { ThemeConfig } from '../theme';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  availableAreas: string[];
  availableMonths: string[];
  theme?: ThemeConfig;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  availableAreas,
  availableMonths,
  theme,
}) => {
  const handleReset = () => {
    setFilters({
      ageGroup: '',
      area: '',
      riskLevel: '',
      month: '',
      gender: '',
      searchQuery: '',
    });
  };

  const isFiltered = Boolean(
    filters.ageGroup ||
    filters.area ||
    filters.riskLevel ||
    filters.month ||
    filters.gender ||
    filters.searchQuery
  );

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 p-5 shadow-sm mb-6 hover:border-slate-300 transition-all duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>ศูนย์คัดกรองข้อมูลสุขภาพอัจฉริยะ</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-2xs">
                  Smart Filters
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              คัดกรองข้อมูลสุขภาพผู้ป่วยแบบเรียลไทม์ เจาะลึกตามกลุ่มเสี่ยงและพื้นที่
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            กำลังแสดง <strong className="text-indigo-600 font-mono text-sm">{filteredCount}</strong> จาก {totalCount} รายการ
          </span>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Select Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Filter 1: Age Group */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</span>
            <span>ช่วงอายุ (Age Group)</span>
          </label>
          <select
            value={filters.ageGroup}
            onChange={(e) => setFilters((prev) => ({ ...prev, ageGroup: e.target.value }))}
            className="w-full bg-slate-50/90 border border-slate-200 hover:border-indigo-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-800 transition outline-none cursor-pointer"
          >
            <option value="">ทุกช่วงอายุ (ทั้งหมด)</option>
            <option value="< 30 ปี">&lt; 30 ปี (วัยหนุ่มสาว)</option>
            <option value="30 - 44 ปี">30 - 44 ปี (วัยทำงาน)</option>
            <option value="45 - 59 ปี">45 - 59 ปี (วัยกลางคน)</option>
            <option value="60+ ปี">60+ ปี (ผู้สูงอายุ)</option>
          </select>
        </div>

        {/* Filter 2: Area / Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center text-[10px] font-bold">2</span>
            <span>พื้นที่/ภูมิภาค (Area)</span>
          </label>
          <select
            value={filters.area}
            onChange={(e) => setFilters((prev) => ({ ...prev, area: e.target.value }))}
            className="w-full bg-slate-50/90 border border-slate-200 hover:border-cyan-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-800 transition outline-none cursor-pointer"
          >
            <option value="">ทุกพื้นที่ (ทั้งหมด)</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                📍 พื้นที่: {area}
              </option>
            ))}
          </select>
        </div>

        {/* Filter 3: Health Risk Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-bold">3</span>
            <span>ระดับความเสี่ยง (Risk Level)</span>
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))}
            className="w-full bg-slate-50/90 border border-slate-200 hover:border-amber-400 focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-800 transition outline-none cursor-pointer"
          >
            <option value="">ทุกระดับความเสี่ยง (ทั้งหมด)</option>
            <option value="สูง">🔴 เสี่ยงสูง (High Risk - เร่งด่วน)</option>
            <option value="ปานกลาง">🟡 เสี่ยงปานกลาง (Moderate Risk)</option>
            <option value="ต่ำ">🟢 เสี่ยงต่ำ (Low Risk - ปกติ)</option>
          </select>
        </div>

        {/* Filter 4: Month / Timeline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-[10px] font-bold">4</span>
            <span>ช่วงเวลา (Month)</span>
          </label>
          <select
            value={filters.month}
            onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
            className="w-full bg-slate-50/90 border border-slate-200 hover:border-rose-400 focus:border-rose-600 focus:bg-white focus:ring-4 focus:ring-rose-500/10 rounded-2xl px-3.5 py-2.5 text-xs font-medium text-slate-800 transition outline-none cursor-pointer"
          >
            <option value="">ตลอดช่วงเวลาทั้งหมด</option>
            {availableMonths.map((m) => {
              const label = m === '2026-01' ? 'มกราคม 2026' : m === '2026-02' ? 'กุมภาพันธ์ 2026' : m === '2026-03' ? 'มีนาคม 2026' : m;
              return (
                <option key={m} value={m}>
                  📅 {label} ({m})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Search Input and Playful Quick Action Badges */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหา เช่น H0001, เหนือ, ชาย, เสี่ยงสูง..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 hover:border-indigo-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-10 pr-3.5 py-2 text-xs text-slate-800 outline-none transition"
          />
        </div>

        {/* Playful Quick Filters ("ลูกเล่นทางลัดสดใส") */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end text-xs">
          <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            ทางลัดด่วน:
          </span>

          {/* Quick 1: High Risk */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, riskLevel: prev.riskLevel === 'สูง' ? '' : 'สูง' }))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 ${
              filters.riskLevel === 'สูง'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>🚨 กลุ่มเสี่ยงสูง</span>
          </button>

          {/* Quick 2: Elderly 60+ */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, ageGroup: prev.ageGroup === '60+ ปี' ? '' : '60+ ปี' }))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 ${
              filters.ageGroup === '60+ ปี'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <span>👴 วัยเกษียณ 60+ ปี</span>
          </button>

          {/* Quick 3: Low Risk (Healthy) */}
          <button
            onClick={() => setFilters((prev) => ({ ...prev, riskLevel: prev.riskLevel === 'ต่ำ' ? '' : 'ต่ำ' }))}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 ${
              filters.riskLevel === 'ต่ำ'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🌟 กลุ่มเสี่ยงต่ำ (เกณฑ์ดี)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
