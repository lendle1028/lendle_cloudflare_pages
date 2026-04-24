import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  try {
    // 1. 取得 Cloudflare 環境變數中的 Supabase 連線資訊
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_KEY;

    // 2. 建立 Supabase 客戶端
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. 關鍵點：指定 schema 並查詢資料表
    const { data, error } = await supabase
      .schema('ipip')              // 👉 指定你的 schema
      .from('renamed_ipip')        // 👉 指定你的 table
      .select('*')                 // 抓取所有欄位
      .limit(10);                  // 建議先限制筆數來測試

    // 如果查詢過程發生錯誤
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. 成功！將拿到的資料回傳給前端
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        "Content-Type": "application/json" 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "伺服器發生未預期的錯誤", details: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}