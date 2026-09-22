import React, { useState } from 'react';
import { X, User, Save, IdCard } from 'lucide-react';

interface CreatorEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentId: string;
  onSave: (name: string, id: string) => void;
}

export const CreatorEditModal: React.FC<CreatorEditModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentId,
  onSave,
}) => {
  const [name, setName] = useState(currentName);
  const [id, setId] = useState(currentId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-cyan-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">ระบุข้อมูลผู้จัดทำแดชบอร์ด</h3>
              <p className="text-xs text-cyan-200">
                สำหรับแสดงชื่อ-นามสกุล และรหัสนักศึกษาในส่วนหัว
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อ-นามสกุล ผู้จัดทำ
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="เช่น นายภัทรการ มั่นคง"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-[#1E3A8A]/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสนักศึกษา (Student ID)
            </label>
            <div className="relative">
              <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="เช่น 6701234567"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#1E3A8A] focus:bg-white focus:ring-2 focus:ring-[#1E3A8A]/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 outline-none transition font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
