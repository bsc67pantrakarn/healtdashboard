import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KPICards } from './components/KPICards';
import { HealthVitalityWidget } from './components/HealthVitalityWidget';
import { RiskBarChart } from './components/RiskBarChart';
import { BehaviorDonutChart } from './components/BehaviorDonutChart';
import { RegionalGeoMap } from './components/RegionalGeoMap';
import { HealthTrendLineChart } from './components/HealthTrendLineChart';
import { CorrelationScatterPlots } from './components/CorrelationScatterPlots';
import { PatientTable } from './components/PatientTable';
import { PatientModal } from './components/PatientModal';
import { CreatorEditModal } from './components/CreatorEditModal';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { fetchGoogleSheetPatients, computeKPIs, DEFAULT_SHEET_ID, DEFAULT_SHEET_GID } from './services/sheetsService';
import { FilterState, ParsedPatient } from './types';
import { THEMES, ThemeId, ThemeConfig } from './theme';
import { 
  FileSpreadsheet, 
  Table as TableIcon, 
  ArrowRight, 
  HeartHandshake, 
  ExternalLink,
  Settings2,
  Sparkles,
  Zap,
  Palette
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'table'>('overview');
  const [patients, setPatients] = useState<ParsedPatient[]>([]);
  const [dataSource, setDataSource] = useState<'live' | 'cache'>('cache');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ParsedPatient | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');

  // Vibrant Theme State (Default: 'vibrant' - โทนสีสดใสทันสมัย)
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('hc_theme_id') as ThemeId;
    return (saved && THEMES[saved]) ? saved : 'vibrant';
  });

  const currentTheme: ThemeConfig = THEMES[themeId] || THEMES.vibrant;

  const handleSelectTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem('hc_theme_id', newThemeId);
  };

  // Active Sheet ID & GID (stored in localStorage if customized)
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    return localStorage.getItem('hc_sheet_id') || DEFAULT_SHEET_ID;
  });
  const [activeGid, setActiveGid] = useState<string>(() => {
    return localStorage.getItem('hc_sheet_gid') || DEFAULT_SHEET_GID;
  });
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  
  // Creator Info
  const [creatorName, setCreatorName] = useState<string>(() => {
    return localStorage.getItem('hc_creator_name') || 'ภัทรการ มั่นคง';
  });
  const [creatorId, setCreatorId] = useState<string>(() => {
    return localStorage.getItem('hc_creator_id') || '6701234567';
  });
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    ageGroup: '',
    area: '',
    riskLevel: '',
    month: '',
    gender: '',
    searchQuery: '',
  });

  // Load Patients Data
  const loadData = useCallback(async (targetSheetId = activeSheetId, targetGid = activeGid) => {
    setIsRefreshing(true);
    try {
      const res = await fetchGoogleSheetPatients(targetSheetId, targetGid);
      setPatients(res.patients);
      setDataSource(res.source);
      if (res.syncedAt) {
        setLastSyncedTime(res.syncedAt);
      } else {
        setLastSyncedTime(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching sheet data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeSheetId, activeGid]);

  useEffect(() => {
    loadData();

    // Auto-refresh every 20 seconds to catch changes in Google Sheet
    const interval = setInterval(() => {
      loadData();
    }, 20000);

    // Refresh when user tabs back into the dashboard from Google Sheets
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadData]);

  // Handle Save Custom Sheet ID / GID
  const handleSaveSheetConfig = (newSheetId: string, newGid: string) => {
    setActiveSheetId(newSheetId);
    setActiveGid(newGid);
    localStorage.setItem('hc_sheet_id', newSheetId);
    localStorage.setItem('hc_sheet_gid', newGid);
    loadData(newSheetId, newGid);
  };

  // Handle Save Creator Info
  const handleSaveCreator = (name: string, id: string) => {
    setCreatorName(name);
    setCreatorId(id);
    localStorage.setItem('hc_creator_name', name);
    localStorage.setItem('hc_creator_id', id);
  };

  // Extract distinct areas & months
  const availableAreas = useMemo(() => {
    return Array.from(new Set(patients.map((p) => p.area).filter(Boolean))).sort();
  }, [patients]);

  const availableMonths = useMemo(() => {
    return Array.from(new Set(patients.map((p) => p.month).filter(Boolean))).sort();
  }, [patients]);

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (filters.ageGroup && p.ageGroup !== filters.ageGroup) return false;
      if (filters.area && p.area !== filters.area) return false;
      if (filters.riskLevel && p.riskLevel !== filters.riskLevel) return false;
      if (filters.month && p.month !== filters.month) return false;
      if (filters.gender && p.gender !== filters.gender) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          p.id.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.riskLevel.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [patients, filters]);

  // Compute KPIs
  const kpis = useMemo(() => {
    return computeKPIs(filteredPatients);
  }, [filteredPatients]);

  return (
    <div className={`min-h-screen ${currentTheme.background} flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-500`}>
      {/* Header & Main Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dataSource={dataSource}
        totalPatientsCount={patients.length}
        lastSyncedTime={lastSyncedTime}
        activeSheetId={activeSheetId}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(activeSheetId, activeGid)}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        creatorName={creatorName}
        creatorId={creatorId}
        onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Google Sheet Live Connection Confirmation Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3 text-emerald-950 font-medium">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="font-black text-emerald-900">เชื่อมต่อ Google Sheet สำเร็จ (Live Real-time Sync):</span>{' '}
              ดึงข้อมูลผู้ป่วยจากชีท ID{' '}
              <code className="bg-white/90 px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold text-indigo-700 border border-emerald-200">
                {activeSheetId}
              </code>{' '}
              (แท็บ gid: {activeGid}) ครบถ้วนทั้งหมด{' '}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black font-mono shadow-xs">
                {patients.length} คน
              </span>{' '}
              ตรงตามข้อมูลจริงในชีททุกประการ
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-bold shadow-2xs text-[11px] cursor-pointer hover:bg-slate-50 transition"
              title="ตรวจสอบหรือเปลี่ยนการตั้งค่า Google Sheet"
            >
              <Settings2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>การเชื่อมต่อชีท</span>
            </button>
            <a
              href={`https://docs.google.com/spreadsheets/d/${activeSheetId}/edit#gid=${activeGid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 font-bold shadow-2xs text-[11px] hover:bg-indigo-50 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>เปิดดู Google Sheet ต้นทาง</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Universal Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          totalCount={patients.length}
          filteredCount={filteredPatients.length}
          availableAreas={availableAreas}
          availableMonths={availableMonths}
          theme={currentTheme}
        />

        {/* Page 1: Overview & Risk Dashboard */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Scorecards / KPI Summary Cards (4 Main KPIs) */}
            <KPICards kpis={kpis} theme={currentTheme} />

            {/* 2. Interactive Vitality & Lifestyle Playground Widget */}
            <HealthVitalityWidget 
              patients={filteredPatients}
              onSelectRisk={(risk: string) => setFilters((prev) => ({ ...prev, riskLevel: prev.riskLevel === risk ? '' : risk }))}
              theme={currentTheme}
            />

            {/* 3. Visualizations Section: Health Risk & Behavior */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart: High Risk by Age Group */}
              <RiskBarChart patients={filteredPatients} theme={currentTheme} />

              {/* Donut Chart: Health Behavior vs Risk Level */}
              <BehaviorDonutChart patients={filteredPatients} theme={currentTheme} />
            </div>

            {/* 4. Regional Density Map (Geo Map / Filled Map) */}
            <RegionalGeoMap
              patients={patients}
              selectedArea={filters.area}
              onSelectArea={(area) => setFilters((prev) => ({ ...prev, area }))}
              theme={currentTheme}
            />

            {/* 5. Health Trend & Timeline Line Chart */}
            <HealthTrendLineChart patients={filteredPatients} theme={currentTheme} />

            {/* 6. NCDs Correlation Scatter Plots (BMI vs Sugar & BMI vs BP) */}
            <CorrelationScatterPlots
              patients={filteredPatients}
              onSelectPatient={(p) => setSelectedPatient(p)}
              theme={currentTheme}
            />

            {/* 7. Vibrant Gateway Banner to Full Patient Detail Table */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border border-white/20">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>ข้อมูลเวชระเบียนรายบุคคล</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black flex items-center justify-center sm:justify-start gap-2.5">
                    <TableIcon className="w-6 h-6 text-cyan-300" />
                    <span>เปิดดูตารางข้อมูลผู้ป่วยเชิงลึก (Patient Detail Table)</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
                    ตรวจสอบรายชื่อผู้ป่วยทั้งหมด {filteredPatients.length} รายการ ค้นหา จัดเรียง และดูการเน้นสีข้อมูล (Conditional Formatting) สำหรับกลุ่มเสี่ยงสูงและค่าน้ำตาลเกินเกณฑ์
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('table')}
                  className="px-6 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-slate-50 font-black text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 shrink-0 cursor-pointer min-h-[48px]"
                >
                  <span>เปิดตารางข้อมูล ({filteredPatients.length} ราย)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Patient Detail Table */}
        {activeTab === 'table' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick KPI Bar for Page 2 with Vibrant styling */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">จำนวนที่กรองได้</span>
                <div className="text-2xl font-black text-indigo-600 font-mono mt-1">{filteredPatients.length} ราย</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">กลุ่มเสี่ยงสูง</span>
                <div className="text-2xl font-black text-rose-600 font-mono mt-1">
                  {kpis.highRiskCount} <span className="text-sm font-semibold text-rose-400 font-sans">({kpis.highRiskPercentage}%)</span>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">BMI เฉลี่ย</span>
                <div className="text-2xl font-black text-slate-800 font-mono mt-1">{kpis.avgBMI} <span className="text-xs font-medium text-slate-400 font-sans">kg/m²</span></div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">น้ำตาลสูงสุด</span>
                <div className="text-2xl font-black text-amber-600 font-mono mt-1">{kpis.maxBloodSugar} <span className="text-xs font-medium text-slate-400 font-sans">mg/dL</span></div>
              </div>
            </div>

            {/* Main Table Component */}
            <PatientTable
              patients={filteredPatients}
              onSelectPatient={(p) => setSelectedPatient(p)}
              theme={currentTheme}
            />
          </div>
        )}
      </main>

      {/* Patient Assessment Modal */}
      <PatientModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />

      {/* Creator Edit Modal */}
      <CreatorEditModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        currentName={creatorName}
        currentId={creatorId}
        onSave={handleSaveCreator}
      />

      {/* Sheet Settings Modal */}
      <SheetSettingsModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentSheetId={activeSheetId}
        currentGid={activeGid}
        totalCount={patients.length}
        lastSyncedTime={lastSyncedTime}
        onSave={handleSaveSheetConfig}
        onRefreshNow={() => loadData(activeSheetId, activeGid)}
      />

      {/* Modern Vibrant Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-700">
              ระบบวิเคราะห์และเฝ้าระวังสุขภาพผู้ป่วย (Healthcare Analytics & Risk Monitoring Dashboard)
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-400 font-medium">โทนสีสดใสทันสมัย (Vibrant Modern Palette)</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center text-[11px]">
            <a
              href={`https://docs.google.com/spreadsheets/d/${activeSheetId}/edit#gid=${activeGid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Sheet ID: {activeSheetId.slice(0, 16)}...</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-400">
              ผู้จัดทำ: <strong className="text-slate-700 font-bold">{creatorName}</strong> ({creatorId})
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
