import React, { useState } from 'react';
import { MapPin, Navigation, Info, AlertOctagon, TrendingUp, Sparkles } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface RegionalGeoMapProps {
  patients: ParsedPatient[];
  selectedArea: string;
  onSelectArea: (area: string) => void;
  theme?: ThemeConfig;
}

interface RegionStat {
  area: string;
  name: string;
  total: number;
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  avgBMI: number;
  maxSugar: number;
  highRiskRate: number;
  cx: number;
  cy: number;
  path: string;
}

export const RegionalGeoMap: React.FC<RegionalGeoMapProps> = ({
  patients,
  selectedArea,
  onSelectArea,
  theme,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const areasConfig = [
    { area: 'เหนือ', name: 'ภาคเหนือ (North)', cx: 160, cy: 95, path: 'M 100,30 L 220,30 L 225,120 L 160,170 L 105,120 Z' },
    { area: 'เมือง', name: 'เขตเมือง/ศูนย์กลาง (Central Urban)', cx: 175, cy: 195, path: 'M 160,170 L 225,120 L 245,190 L 180,240 L 135,210 Z' },
    { area: 'ตะวันออก', name: 'ภาคตะวันออก (East)', cx: 245, cy: 220, path: 'M 225,120 L 285,150 L 290,230 L 235,250 L 180,240 L 245,190 Z' },
    { area: 'ตะวันตก', name: 'ภาคตะวันตก (West)', cx: 110, cy: 210, path: 'M 105,120 L 160,170 L 135,210 L 125,290 L 70,250 L 80,160 Z' },
    { area: 'ใต้', name: 'ภาคใต้ (South)', cx: 140, cy: 360, path: 'M 135,210 L 180,240 L 160,330 L 180,420 L 120,440 L 105,340 L 125,290 Z' },
  ];

  const regionStats: RegionStat[] = areasConfig.map((cfg) => {
    const areaPatients = patients.filter((p) => p.area === cfg.area);
    const total = areaPatients.length;
    const highRiskCount = areaPatients.filter((p) => p.riskLevel === 'สูง').length;
    const moderateRiskCount = areaPatients.filter((p) => p.riskLevel === 'ปานกลาง').length;
    const lowRiskCount = areaPatients.filter((p) => p.riskLevel === 'ต่ำ').length;
    const sumBMI = areaPatients.reduce((sum, p) => sum + (p.bmi || 0), 0);
    const avgBMI = total > 0 ? Number((sumBMI / total).toFixed(1)) : 0;
    const maxSugar = areaPatients.reduce((max, p) => Math.max(max, p.bloodSugar || 0), 0);
    const highRiskRate = total > 0 ? Number(((highRiskCount / total) * 100).toFixed(1)) : 0;

    return {
      ...cfg,
      total,
      highRiskCount,
      moderateRiskCount,
      lowRiskCount,
      avgBMI,
      maxSugar,
      highRiskRate,
    };
  });

  const activeStat = regionStats.find((r) => r.area === (hoveredArea || selectedArea)) || regionStats[0];

  // Helper color gradient by high risk count with bright modern hues
  const getFillColor = (stat: RegionStat) => {
    const isSelected = selectedArea === stat.area;
    const isHovered = hoveredArea === stat.area;

    if (isSelected) return '#6366F1'; // Indigo selected
    if (isHovered) return '#818CF8';

    if (stat.highRiskCount >= 3) return '#F43F5E'; // Vibrant Red
    if (stat.highRiskCount >= 2) return '#FB923C'; // Vibrant Orange
    if (stat.highRiskCount >= 1) return '#38BDF8'; // Bright Sky
    return '#CBD5E1'; // Slate
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>แผนผังความหนาแน่นกลุ่มเสี่ยงสูง</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                Geo Risk Map
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              วิเคราะห์การกระจายตัว 5 โซนพื้นที่ (คลิกบนแผนผังเพื่อคัดกรองข้อมูล)
            </p>
          </div>
        </div>

        {selectedArea && (
          <button
            onClick={() => onSelectArea('')}
            className="text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl transition cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            แสดงทุกพื้นที่ (รีเซ็ตการเลือก)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Regional Map Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative bg-slate-50/90 rounded-3xl p-5 border border-slate-200/80">
          <svg
            viewBox="50 15 260 440"
            className="w-full max-w-[280px] h-[340px] drop-shadow-sm select-none"
          >
            {/* Region polygons */}
            {regionStats.map((stat) => {
              const isSelected = selectedArea === stat.area;
              return (
                <path
                  key={stat.area}
                  d={stat.path}
                  fill={getFillColor(stat)}
                  fillOpacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? '#4F46E5' : '#FFFFFF'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:scale-[1.01]"
                  onMouseEnter={() => setHoveredArea(stat.area)}
                  onMouseLeave={() => setHoveredArea(null)}
                  onClick={() => onSelectArea(selectedArea === stat.area ? '' : stat.area)}
                />
              );
            })}

            {/* Pins and Labels on Map */}
            {regionStats.map((stat) => {
              const isSelected = selectedArea === stat.area;
              return (
                <g 
                  key={`pin-${stat.area}`} 
                  transform={`translate(${stat.cx}, ${stat.cy})`}
                  className="pointer-events-none"
                >
                  {/* Pulse circle for high risk areas */}
                  {stat.highRiskCount > 0 && (
                    <circle r="15" fill="#F43F5E" opacity="0.35" className="animate-ping" />
                  )}
                  <circle
                    r="12"
                    fill={isSelected ? '#4F46E5' : stat.highRiskCount > 2 ? '#E11D48' : '#0284C7'}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {stat.highRiskCount}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="24"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="800"
                    className="drop-shadow-xs"
                  >
                    {stat.area}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Color Legend */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex-wrap justify-center font-medium">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>เสี่ยงสูงมาก (3+ ราย)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              <span>เสี่ยงสูงปานกลาง (2 ราย)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-sky-400"></span>
              <span>เสี่ยงสูง 1 ราย</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span>เลือกอยู่</span>
            </span>
          </div>
        </div>

        {/* Region Stats Detail Cards */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/50 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{activeStat.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    {hoveredArea ? 'กำลังชี้เมาส์ดูข้อมูล' : selectedArea ? 'กำลังกรองข้อมูลพื้นที่นี้' : 'ข้อมูลภาพรวมโซน'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectArea(selectedArea === activeStat.area ? '' : activeStat.area)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  selectedArea === activeStat.area
                    ? 'bg-indigo-600 text-white shadow-indigo-500/25'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                {selectedArea === activeStat.area ? '✓ เลือกพื้นที่นี้อยู่' : 'คลิกเพื่อกรอง'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-indigo-100/80 text-center">
              <div className="p-2 rounded-xl bg-white/90 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">ผู้ป่วยในพื้นที่</div>
                <div className="text-lg font-black font-mono text-indigo-600">{activeStat.total}</div>
                <div className="text-[10px] text-slate-400">ราย</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">กลุ่มเสี่ยงสูง</div>
                <div className="text-lg font-black font-mono text-rose-600">{activeStat.highRiskCount}</div>
                <div className="text-[10px] text-rose-500 font-bold">{activeStat.highRiskRate}%</div>
              </div>
              <div className="p-2 rounded-xl bg-white/90 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">BMI เฉลี่ย</div>
                <div className="text-lg font-black font-mono text-cyan-600">{activeStat.avgBMI}</div>
                <div className="text-[10px] text-slate-400">kg/m²</div>
              </div>
            </div>
          </div>

          {/* Quick Click Badges for All 5 Regions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {regionStats.map((r) => {
              const isSelected = selectedArea === r.area;
              return (
                <button
                  key={r.area}
                  onClick={() => onSelectArea(selectedArea === r.area ? '' : r.area)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{r.area}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
                    }`}>
                      เสี่ยงสูง {r.highRiskCount}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    รวม {r.total} ราย
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
