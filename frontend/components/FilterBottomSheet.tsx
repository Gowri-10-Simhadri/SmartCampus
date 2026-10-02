"use client";

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  setStatus: (status: string) => void;
  category: string;
  setCategory: (category: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  onReset: () => void;
}

const categories = [
  "All",
  "Electrical",
  "Water",
  "Cleanliness",
  "Internet",
  "Infrastructure",
  "Classroom",
  "Hostel",
  "Security",
  "Other",
];

const statuses = ["All", "Pending", "Under Review", "In Progress", "Resolved", "Rejected"];

const priorities = ["All", "Low", "Medium", "High", "Urgent"];

export default function FilterBottomSheet({
  isOpen,
  onClose,
  status,
  setStatus,
  category,
  setCategory,
  priority,
  setPriority,
  onReset,
}: FilterBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">Filter Complaints</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                    status === st
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                    category === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="flex flex-wrap gap-1.5">
              {priorities.map((pri) => (
                <button
                  key={pri}
                  type="button"
                  onClick={() => setPriority(pri)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                    priority === pri
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
