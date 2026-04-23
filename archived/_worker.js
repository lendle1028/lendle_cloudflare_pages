export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. 攔截目標路徑：/projects/nstc/113
    if (url.pathname.startsWith('/projects/nstc/113')) {
      // 構建 Google Sites 網址（這裡直接連到 Home）
      const targetUrl = "https://sites.google.com/view/13-2410-h-155-02/home";
      
      // 修改 Request 標頭，偽裝成直接訪問 Google Sites
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: new Headers(request.headers),
      });
      
      // 關鍵：必須修改 Host，Google 才會接受請求
      newRequest.headers.set("Host", "sites.google.com");
      newRequest.headers.set("Referer", "https://sites.google.com/");

      // 執行代理抓取
      return fetch(newRequest);
    }

    // 2. 其他路徑：正常的 Pages 內容
    // env.ASSETS 是 Cloudflare Pages 預留的變數，代表你原本的靜態檔案
    return env.ASSETS.fetch(request);
  }
};
