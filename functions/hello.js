import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  try {
    // 1. 從 context.env 取得 Cloudflare 後台設定的安全變數
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_KEY;

    // 2. 初始化 Supabase 客戶端
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. 執行你的 Supabase 查詢 (這裡以讀取 test_table 為例)
    const { data, error } = await supabase
      .from('ipip.renamed_ipip')
      .select('*')
      .limit(10);

    // 如果 Supabase 回傳錯誤
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 4. 將拿到的資料回傳給前端
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "伺服器錯誤"+err }), { status: 500 });
  }
}