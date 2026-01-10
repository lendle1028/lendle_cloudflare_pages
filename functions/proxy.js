export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 判斷是否為目標路徑
  if (url.pathname.startsWith('/projects/nstc/113')) {
    // 呼叫你在介面中綁定的 PROXY_WORKER (lively-sea-5184)
    return context.env.PROXY_WORKER.fetch(context.request);
  }

  // 其他路徑繼續執行 Pages 預設行為
  return context.next();
}
