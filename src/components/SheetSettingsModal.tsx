import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { DEFAULT_SHEET_ID, DEFAULT_SHEET_GID } from '../services/sheetsService';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetId: string;
  currentGid: string;
  totalCount: number;
  lastSyncedTime: string;
  onSave: (sheetId: string, gid: string) => void;
  onRefreshNow: () => void;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  currentSheetId,
  currentGid,
  totalCount,
  lastSyncedTime,
  onSave,
  onRefreshNow,
}) => {
  const [inputUrlOrId, setInputUrlOrId] = useState(currentSheetId);
  const [inputGid, setInputGid] = useState(currentGid);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; count?: number; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    let parsedId = inputUrlOrId.trim();
    let parsedGid = inputGid.trim();

    if (parsedId.includes('docs.google.com/spreadsheets/d/')) {
      const idMatch = parsedId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch) parsedId = idMatch[1];
      const gidMatch = parsedId.match(/gid=([0-9]+)/);
      if (gidMatch) parsedGid = gidMatch[1];
    }

    try {
      const res = await fetch(`/api/patients?sheetId=${encodeURIComponent(parsedId)}&gid=${encodeURIComponent(parsedGid)}&_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.patients)) {
          setTestResult({
            success: true,
            count: data.patients.length,
            message: `เชื่อมต่อสำเร็จ! พบข้อมูลทั้งหมด ${data.patients.length} แถวในชีท`,
          });
          return;
        }
      }
      setTestResult({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบว่าได้เปิดสิทธิ์ "ทุกคนที่มีลิงก์มีสิทธิ์ดู" ใน Google Sheet แล้วหรือไม่',
      });
    } catch {
      setTestResult({
        success: false,
        message: 'การเชื่อมต่อล้มเหลว กรุณาตรวจสอบอินเทอร์เน็ตหรือลิงก์ชีท',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    let parsedId = inputUrlOrId.trim();
    let parsedGid = inputGid.trim();

    if (parsedId.includes('docs.google.com/spreadsheets/d/')) {
      const idMatch = parsedId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch) parsedId = idMatch[1];
      const gidMatch = parsedId.match(/gid=([0-9]+)/);
      if (gidMatch) parsedGid = gidMatch[1];
    }

    onSave(parsedId, parsedGid);
    onClose();
  };

  const handleResetDefault = () => {
    setInputUrlOrId(DEFAULT_SHEET_ID);
    setInputGid(DEFAULT_SHEET_GID);
    onSave(DEFAULT_SHEET_ID, DEFAULT_SHEET_GID);
  };

  const currentSheetLink = `https://docs.google.com/spreadsheets/d/${currentSheetId}/edit#gid=${currentGid}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">การเชื่อมต่อ Google Sheets</h2>
              <p className="text-xs text-cyan-200">ซิงค์ข้อมูลผู้ป่วยสดจาก Google Sheets แบบเรียลไทม์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Current Connection Status Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>สถานะ: เชื่อมต่อข้อมูลสดอยู่ (Live Sync)</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {totalCount} คน ในชีท
              </span>
            </div>
            <div className="text-xs text-emerald-800 space-y-0.5">
              <div>อัปเดตล่าสุด: {lastSyncedTime || 'เมื่อสักครู่'}</div>
              <div className="truncate font-mono text-[11px] text-emerald-700">
                Sheet ID: {currentSheetId}
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-emerald-200 flex items-center justify-between">
              <a
                href={currentSheetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#1E3A8A] hover:underline font-semibold"
              >
                <span>เปิดดู Google Sheet ต้นทางในแท็บใหม่</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={onRefreshNow}
                className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-900 bg-emerald-100/80 px-2 py-1 rounded-md font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>ซิงค์เดี๋ยวนี้</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Sheet ID หรือ ลิงก์ URL เต็มของ Google Sheet:
              </label>
              <input
                type="text"
                value={inputUrlOrId}
                onChange={(e) => setInputUrlOrId(e.target.value)}
                placeholder="วางลิงก์ https://docs.google.com/spreadsheets/d/... หรือ Sheet ID"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-cyan-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sheet GID (รหัสแท็บชีท):
              </label>
              <input
                type="text"
                value={inputGid}
                onChange={(e) => setInputGid(e.target.value)}
                placeholder="530283699"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-cyan-100 text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * ค่าเริ่มต้นคือแท็บ <code className="bg-slate-100 px-1 py-0.5 rounded">gid=530283699</code>
              </p>
            </div>
          </div>

          {/* Test connection response banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Instructions note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
            <div>
              <strong>วิธีตั้งค่า Google Sheet:</strong>
              <p className="mt-0.5 text-slate-500">
                1. เปิด Google Sheet แล้วคลิกปุ่ม <strong>แชร์ (Share)</strong> มุมขวาบน<br />
                2. เปลี่ยนการเข้าถึงทั่วไปเป็น <strong>ทุกคนที่มีลิงก์ (Anyone with the link)</strong> สิทธิ์เป็น <strong>ผู้มีสิทธิ์อ่าน (Viewer)</strong><br />
                3. เมื่อแก้ไขหรือเพิ่มข้อมูลแถวใหม่ใน Google Sheet ระบบแดชบอร์ดจะตรวจจับและอัปเดตให้อัตโนมัติทันที
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800 py-1.5 px-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ใช้ชีทตั้งต้น</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 rounded-xl border border-cyan-500 text-[#0891B2] hover:bg-cyan-50 text-xs font-semibold transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              บันทึกและซิงค์ทันที
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
