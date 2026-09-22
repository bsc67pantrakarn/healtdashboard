import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Table as TableIcon, 
  User, 
  Edit3, 
  FileSpreadsheet, 
  CheckCircle2, 
  Menu, 
  X,
  RefreshCw,
  Calendar,
  Sparkles,
  Palette
} from 'lucide-react';
import { DEFAULT_SHEET_ID } from '../services/sheetsService';
import { ThemeId, THEMES, ThemeConfig } from '../theme';

interface HeaderProps {
  activeTab: 'overview' | 'table';
  setActiveTab: (tab: 'overview' | 'table') => void;
  dataSource: 'live' | 'cache';
  totalPatientsCount: number;
  lastSyncedTime?: string;
  activeSheetId?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSheetModal?: () => void;
  creatorName: string;
  creatorId: string;
  onOpenCreatorModal: () => void;
  currentTheme: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dataSource,
  totalPatientsCount,
  lastSyncedTime,
  activeSheetId = DEFAULT_SHEET_ID,
  isRefreshing,
  onRefresh,
  onOpenSheetModal,
  creatorName,
  creatorId,
  onOpenCreatorModal,
  currentTheme,
  onSelectTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setCurrentDateTime(now.toLocaleDateString('th-TH', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      {/* Top Banner / Info Bar with Theme Gradient */}
      <div className={`bg-gradient-to-r ${currentTheme.topBanner} text-white px-4 py-2 text-xs transition-all duration-500`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Google Sheet Connection Info */}
          <div className="flex items-center space-x-2 font-medium flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-bold text-emerald-300">Google Sheet เชื่อมต่อสด:</span>
            <span className="bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold font-mono">
              {totalPatientsCount} รายการในชีท
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <button
              onClick={onOpenSheetModal}
              className="text-cyan-200 hover:text-white underline underline-offset-2 hidden sm:inline-flex items-center gap-1 cursor-pointer transition font-medium"
              title="คลิกเพื่อตรวจสอบหรือเปลี่ยนการตั้งค่า Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 inline" />
              <span>Sheet ID: {activeSheetId.slice(0, 12)}...</span>
            </button>
          </div>

          {/* Right: Theme Selector & Refresh Button */}
          <div className="flex items-center space-x-2.5 flex-wrap">
            {/* Theme Mood Pills ("ลูกเล่นเปลี่ยนสีสดใส") */}
            <div className="hidden sm:flex items-center bg-black/25 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[11px] gap-1">
              <Palette className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="text-white/70 mr-1">ธีมสี:</span>
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                const t = THEMES[tId];
                const isActive = currentTheme.id === tId;
                return (
                  <button
                    key={tId}
                    onClick={() => onSelectTheme(tId)}
                    className={`px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-slate-900 font-bold shadow-xs scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    title={t.tagline}
                  >
                    <span>{t.emoji}</span>
                    <span className="hidden md:inline">{t.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Sync timestamp */}
            <div className="hidden lg:flex items-center gap-1 text-white/80 text-xs">
              <Calendar className="w-3.5 h-3.5 text-cyan-300" />
              <span>{lastSyncedTime || currentDateTime || 'กำลังโหลด...'}</span>
            </div>

            {/* Force Sync button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
              title="ดึงข้อมูลล่าสุดจาก Google Sheets เดี๋ยวนี้"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'ซิงค์อยู่...' : 'ซิงค์ชีทสด'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Titles */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentTheme.brandGradient} flex items-center justify-center text-white shadow-lg shrink-0 transition-all duration-500 hover:scale-105`}
                style={{ boxShadow: `0 8px 20px -4px ${currentTheme.accentGlow}` }}
              >
                <Activity className="w-6 h-6 stroke-[2.4] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                    ระบบวิเคราะห์และเฝ้าระวังสุขภาพผู้ป่วย
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${currentTheme.badgeBg} shadow-xs`}>
                    NCDs Live 2026
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ข้อมูลสดจาก Google Sheet: {totalPatientsCount} คน</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">
                  Healthcare Analytics Dashboard • แสดงผลข้อมูลสุขภาพ พฤติกรรม และระดับความเสี่ยงตรงตามชีท
                </p>
              </div>
            </div>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Right side: Student / Creator Box & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Creator Badge Box (Click to Edit) */}
            <button
              onClick={onOpenCreatorModal}
              className="group flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 text-left transition-all duration-200 cursor-pointer text-xs shadow-2xs hover:shadow-md"
              title="คลิกเพื่อแก้ไขชื่อและรหัสนักศึกษา"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentTheme.brandGradient} text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <span>ผู้จัดทำแดชบอร์ด</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  </div>
                  <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {creatorName || '[ใส่ชื่อ-นามสกุลของคุณ]'}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono font-semibold">
                    รหัส: {creatorId || '[รหัสนักศึกษา]'}
                  </div>
                </div>
              </div>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
            </button>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Overview & Risk Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <TableIcon className="w-4 h-4 text-pink-500" />
                <span>Patient Detail Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation & Theme Selector Bar */}
        <div className={`lg:hidden pt-3 border-t border-slate-100 mt-3 ${mobileMenuOpen ? 'block' : 'block'}`}>
          {/* Mobile Theme Selector */}
          <div className="flex sm:hidden items-center justify-between bg-slate-100 p-2 rounded-xl mb-2 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-indigo-500" /> โทนสีสดใส:
            </span>
            <div className="flex items-center gap-1">
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => (
                <button
                  key={tId}
                  onClick={() => onSelectTheme(tId)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                    currentTheme.id === tId ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  {THEMES[tId].emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>ภาพรวม Overview</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('table');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4 text-pink-500" />
              <span>ตารางข้อมูลผู้ป่วย</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
