import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;

  // 僅允許 POST 請求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    const body = await request.json();

    /* 假設 body 的格式如下：
      {
        "timestamp": "2023-10-27T10:00:00Z",
        "1": "value1",
        "2": "value2",
        ...
        "50": "value50"
      }
    */

    const { data, error } = await supabase
      .schema('ipip')
      .from('renamed_ipip')
      .insert([body]) // 直接傳入物件，Supabase 會自動對應欄位
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "伺服器錯誤", details: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}