'use client';

// 👇 這裡包含了 useState，解決你的第一個紅字
import { useState } from 'react';
import { GiftFormData } from '@/types';
import { Loader2, Gift } from 'lucide-react';

interface GiftFormProps {
  onSubmit: (data: GiftFormData) => void;
  isLoading: boolean;
}

export default function GiftForm({ onSubmit, isLoading }: GiftFormProps) {
  const [formData, setFormData] = useState<GiftFormData>({
    target: 'Partner',
    relationSpecific: '',
    budget: 2000,
    interests: '',
    taboos: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const inputStyle = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 對象選擇 */}
        <div className="space-y-2">
          <label htmlFor="target" className={labelStyle}>送禮對象 (Target)</label>
          <div className="relative">
            <select
              id="target"
              className={inputStyle}
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            >
              <option value="Partner">伴侶 (Partner)</option>
              <option value="Friend">朋友 (Friend)</option>
              <option value="Family">家人 (Family)</option>
              <option value="Colleague">同事 (Colleague)</option>
              <option value="Other">其他 (Other)</option>
            </select>
          </div>
        </div>

        {/* 補充說明 */}
        <div className="space-y-2">
          <label htmlFor="specific" className={labelStyle}>補充說明</label>
          <input
            id="specific"
            className={inputStyle}
            placeholder="例如：喜歡戶外活動的男友"
            value={formData.relationSpecific}
            onChange={(e) => setFormData({ ...formData, relationSpecific: e.target.value })}
          />
        </div>
      </div>

      {/* 預算 */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className={labelStyle}>預算 (Budget)</label>
          <span className="text-black font-bold">${formData.budget.toLocaleString()} TWD</span>
        </div>
        <input
          type="range"
          min="500"
          max="20000"
          step="100"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
        />
      </div>

      {/* 興趣 (這就是你截圖報錯的地方，這裡修好了) */}
      <div className="space-y-2">
        <label htmlFor="interests" className={labelStyle}>對方的興趣 (Interests)</label>
        <textarea
          id="interests"
          className={`${inputStyle} min-h-[80px]`}
          placeholder="例如：喜歡貓、底片相機、喝咖啡..."
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          required
        />
      </div>

      {/* 地雷 */}
      <div className="space-y-2">
        <label htmlFor="taboos" className="block text-sm font-medium text-red-500 mb-1">地雷區 (Taboos)</label>
        <input
          id="taboos"
          className={inputStyle}
          placeholder="例如：不要馬克杯、護手霜..."
          value={formData.taboos}
          onChange={(e) => setFormData({ ...formData, taboos: e.target.value })}
        />
      </div>

      <button 
        type="submit" 
        className="w-full h-12 inline-flex items-center justify-center rounded-md text-lg font-semibold bg-black hover:bg-gray-800 text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            正在運算最佳禮物...
          </>
        ) : (
          <>
            <Gift className="mr-2 h-5 w-5" />
            生成送禮建議
          </>
        )}
      </button>
    </form>
  );
}