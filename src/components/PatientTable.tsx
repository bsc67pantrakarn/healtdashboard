import React, { useState } from 'react';
import {
  Download,
  ArrowUpDown,
  Search,
  Filter,
  Eye,
  AlertOctagon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import { ParsedPatient } from '../types';
import { exportToCSV } from '../services/sheetsService';
import { ThemeConfig } from '../theme';

interface PatientTableProps {
  patients: ParsedPatient[];
  onSelectPatient: (patient: ParsedPatient) => void;
  theme?: ThemeConfig;
}

type SortField = 'id' | 'date' | 'age' | 'bmi' | 'sbp' | 'bloodSugar' | 'riskScore' | 'area';
type SortOrder = 'asc' | 'desc';

export const PatientTable: React.FC<PatientTableProps> = ({ patients, onSelectPatient, theme }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [tableSearch, setTableSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterRiskOnly, setFilterRiskOnly] = useState<string>('');

  // Handle Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered and Sorted
  let filtered = patients.filter((p) => {
    if (filterRiskOnly && p.riskLevel !== filterRiskOnly) return false;
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q) ||
      p.riskLevel.toLowerCase().includes(q) ||
      p.smoking.toLowerCase().includes(q) ||
      p.exercise.toLowerCase().includes(q)
    );
  });

  filtered = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Table Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <TableIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>ตารางข้อมูลผู้ป่วยเชิงลึก (Patient Detail Table)</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {filtered.length} รายการ
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงรายละเอียดสุขภาพรายบุคคล พร้อมการเน้นสีข้อมูลอัตโนมัติ (Conditional Formatting)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter: High Risk Only toggle */}
          <button
            onClick={() => setFilterRiskOnly(filterRiskOnly === 'สูง' ? '' : 'สูง')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95 ${
              filterRiskOnly === 'สูง'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-300'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{filterRiskOnly === 'สูง' ? '✓ แสดงทั้งหมด' : 'เฉพาะเสี่ยงสูง (High Risk)'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(filtered)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95"
            title="ดาวน์โหลดไฟล์ตารางข้อมูลผู้ป่วยเป็น CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Conditional Formatting Guide Banner */}
      <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-pink-50/40 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>กฎการเน้นสีข้อมูล (Conditional Formatting):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-xl font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse inline-block"></span>
            กลุ่มเสี่ยงสูง (ไฮไลต์แถวสีแดงอ่อน)
          </span>
          <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            น้ำตาล &gt; 126 mg/dL (เกณฑ์เบาหวาน)
          </span>
          <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            ความดัน &ge; 140 mmHg
          </span>
        </div>
      </div>

      {/* Search and Table Size */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3.5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาในตาราง (รหัส, พื้นที่, เพศ...)"
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-10 pr-3.5 py-2 text-xs text-slate-800 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto font-medium">
          <span>แสดงต่อหน้า:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold outline-none cursor-pointer hover:border-indigo-300 transition"
          >
            <option value={10}>10 รายการ</option>
            <option value={20}>20 รายการ</option>
            <option value={30}>30 รายการ</option>
            <option value={50}>50 รายการ (ทั้งหมด)</option>
          </select>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-indigo-50/50 text-slate-700 font-bold border-b border-slate-200 select-none">
              <th className="py-3.5 px-3 text-center text-slate-500 font-mono text-[11px] w-14 whitespace-nowrap">
                # ลำดับชีท
              </th>
              <th
                onClick={() => handleSort('id')}
                className="py-3.5 px-3.5 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>รหัสผู้ป่วย</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>วันที่</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('area')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>พื้นที่</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('age')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>เพศ/อายุ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('bmi')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>BMI (kg/m²)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sbp')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>ความดัน (SBP/DBP)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('bloodSugar')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>น้ำตาล (mg/dL)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3 whitespace-nowrap text-slate-800">พฤติกรรมเสี่ยง</th>
              <th
                onClick={() => handleSort('riskScore')}
                className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition whitespace-nowrap"
              >
                <div className="flex items-center gap-1 text-slate-800">
                  <span>ระดับความเสี่ยง</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap text-slate-800">เวชระเบียน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginated.length > 0 ? (
              paginated.map((p, index) => {
                const isHighRisk = p.riskLevel === 'สูง';
                const isSugarHigh = p.bloodSugar > 126;
                const isBPHigh = p.sbp >= 140;

                const rowClass = isHighRisk
                  ? 'bg-rose-50/60 hover:bg-rose-100/70 transition-colors cursor-pointer border-l-4 border-l-rose-500'
                  : 'hover:bg-indigo-50/30 transition-colors cursor-pointer border-l-4 border-l-transparent';

                return (
                  <tr
                    key={p.uniqueKey || `${p.id}_${p.rowNumber || index}`}
                    className={rowClass}
                    onClick={() => onSelectPatient(p)}
                  >
                    {/* Sheet Row Number */}
                    <td className="py-3 px-3 text-center font-mono text-xs font-bold text-slate-400">
                      {p.rowNumber ?? ((page - 1) * pageSize + index + 1)}
                    </td>

                    {/* Patient ID */}
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        {isHighRisk && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0"></span>
                        )}
                        <span className={isHighRisk ? 'text-rose-700' : 'text-indigo-600'}>
                          {p.id}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-medium">{p.date}</td>

                    {/* Area */}
                    <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      {p.area}
                    </td>

                    {/* Gender & Age */}
                    <td className="py-3 px-3 whitespace-nowrap font-medium">
                      <span className="text-slate-800">{p.gender}</span>
                      <span className="text-slate-400 ml-1">({p.age} ปี)</span>
                    </td>

                    {/* BMI */}
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={p.bmi >= 25 ? 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded' : 'text-slate-700'}>
                        {p.bmi}
                      </span>
                    </td>

                    {/* Blood Pressure (SBP/DBP) */}
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                          isBPHigh
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'text-slate-700'
                        }`}
                      >
                        {p.sbp}/{p.dbp}
                      </span>
                    </td>

                    {/* Blood Sugar */}
                    <td className="py-3 px-3 font-mono">
                      {isSugarHigh ? (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-lg border border-amber-300 inline-flex items-center gap-1 text-[11px]">
                          <span>{p.bloodSugar}</span>
                          <span className="text-[10px]">&gt;126!</span>
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium px-1.5">{p.bloodSugar}</span>
                      )}
                    </td>

                    {/* Lifestyle Behaviors */}
                    <td className="py-3 px-3 text-[11px] text-slate-600 whitespace-nowrap font-medium">
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            p.smoking === 'สูบ' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          สูบ:{p.smoking}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            p.exercise === 'ไม่ออกกำลังกาย' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.exercise}
                        </span>
                      </div>
                    </td>

                    {/* Health Risk Level */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isHighRisk ? (
                        <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          เสี่ยงสูง (High Risk)
                        </span>
                      ) : p.riskLevel === 'ปานกลาง' ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          ปานกลาง
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          เสี่ยงต่ำ (ปกติ)
                        </span>
                      )}
                    </td>

                    {/* Action View Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(p);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        title="ดูรายละเอียดเวชระเบียนรายบุคคล"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">ไม่พบข้อมูลผู้ป่วยที่ตรงตามเงื่อนไข</p>
                    <p className="text-xs text-slate-400">ลองล้างตัวกรองหรือพิมพ์คำค้นหาอื่น</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          แสดงหน้า <strong className="text-slate-800 font-mono">{page}</strong> จาก ทั้งหมด{' '}
          <strong className="text-slate-800 font-mono">{totalPages}</strong> หน้า (รวม{' '}
          <strong className="text-indigo-600 font-mono">{filtered.length}</strong> รายการ)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5 && page > 3) {
              pageNum = page - 2 + i;
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 rounded-xl font-bold font-mono transition cursor-pointer ${
                  page === pageNum
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
