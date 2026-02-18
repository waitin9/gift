"use client";

import { useState } from "react";
import { Loader2, Gift } from "lucide-react";

// 定義回傳資料介面
interface Suggestion {
  name: string;
  price: string | number;
  reason: string;
  shoppingTips: string;
}

export default function GiftGuruPage() {
  // 表單狀態
  const [formData, setFormData] = useState({
    target: "伴侶 (Partner)",
    details: "",
    budget: 6000,
    interests: "",
    taboos: "無",
  });

  // UI 狀態
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");

  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 送出表單
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      // 組合提示詞，包裝成 messages 格式傳給後端
      const promptContent = `
        Target: ${formData.target}
        Details: ${formData.details}
        Budget: ${formData.budget} TWD
        Interests: ${formData.interests}
        Taboos: ${formData.taboos}
      `;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptContent }]
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 如果後端傳回 500 或 404，這裡會接到錯誤訊息
        throw new Error(data.error || `伺服器回應錯誤: ${res.status}`);
      }

      // 檢查是否成功解析出建議
      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else if (data.error) {
        throw new Error(data.error); // 顯示後端回傳的解析錯誤
      } else {
        throw new Error("AI 沒有回傳有效的建議，請再試一次");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center font-sans text-gray-800">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
          The Gift Guru <span className="text-pink-500">.</span>
        </h1>
        <p className="text-gray-500">送禮救星：結合大數據與消費心理學</p>
      </div>

      <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-gray-100 p-8">
        {/* 表單區域 */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">對象</label>
              <select
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg bg-white"
              >
                <option>伴侶 (Partner)</option>
                <option>家人 (Family)</option>
                <option>朋友 (Friend)</option>
                <option>同事 (Colleague)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">補充說明</label>
              <input
                type="text"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg bg-blue-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              預算: <span className="text-blue-600">{formData.budget} TWD</span>
            </label>
            <input
              type="range"
              min="500"
              max="20000"
              step="100"
              name="budget"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({...prev, budget: parseInt(e.target.value)}))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">對方興趣</label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg h-24 resize-none"
              placeholder="例如：喜歡排球、閱讀、旅遊..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-red-600 mb-1">地雷區 (Taboos)</label>
            <input
              type="text"
              name="taboos"
              value={formData.taboos}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-red-50"
              placeholder="絕對不要送的東西..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Gift size={20} /> 生成建議</>}
          </button>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="mt-6 w-full max-w-2xl bg-red-100 text-red-700 p-4 rounded-lg border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* 結果列表 */}
      {suggestions.length > 0 && (
        <div className="mt-8 w-full max-w-2xl space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎁 為您推薦：</h2>
          {suggestions.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                  約 {item.price}
                </span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <span className="font-bold text-blue-600">推薦原因：</span>
                {item.reason}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 flex gap-2">
                🛒 <span className="font-semibold text-gray-700">購買建議：</span>
                {item.shoppingTips}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}