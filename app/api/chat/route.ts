import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // 1. 驗證 API Key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 未設定" }, { status: 500 });
    }

    // 2. 讀取前端資料
    const body = await req.json();
    let userMessage = "";

    // 解析邏輯：前端傳來的是 messages 陣列
    if (body.messages && Array.isArray(body.messages)) {
      const lastMsg = body.messages[body.messages.length - 1];
      userMessage = lastMsg.content;
    } else {
      // 如果格式跑掉，嘗試直接轉字串
      userMessage = JSON.stringify(body);
    }

    // 3. 設定 Prompt (強制 JSON)
    const systemPrompt = `
      你是一個送禮專家 "The Gift Guru"。
      請根據使用者的需求 (包含對象、預算、興趣、地雷)，推薦 3 個送禮方案。
      
      【嚴格規則】
      1. 只回傳純 JSON 陣列 (Array)。
      2. 絕對不要使用 Markdown 標記 (不要寫 \`\`\`json)。
      3. 每個項目必須包含：name (名稱), price (價格), reason (原因), shoppingTips (購買建議)。
    `;

    // 4. 初始化模型 
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 5. 生成內容
    const finalPrompt = `${systemPrompt}\n\n使用者需求:\n${userMessage}`;
    
    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const text = response.text();

    console.log("AI Output:", text); // Debug用

    // 6. 清洗並回傳
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const suggestions = JSON.parse(cleanedText);
      return NextResponse.json({ suggestions });
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // 如果 JSON 解析失敗，回傳原始文字以免前端全白
      return NextResponse.json({ 
        suggestions: [], 
        raw: text,
        error: "格式解析失敗，但有回應" 
      });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "伺服器發生錯誤" }, { status: 500 });
  }
}