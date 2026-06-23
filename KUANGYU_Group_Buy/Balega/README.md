# 光聿團購 - Balega Running Socks Order Form

Balega 運動襪團購訂購表單，整合 Google Sheets 自動記錄訂單。

## 功能特色

- ✅ 即時購物車計算
- ✅ 商品分類篩選（短筒/中長筒）
- ✅ 點擊圖片連結到官網商品頁
- ✅ 訂單自動寫入 Google Sheets
- ✅ Email 自動確認信
- ✅ 銀行匯款資訊展示

## 技術棧

- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui 組件庫
- Google Apps Script 後端
- Vite 開發工具

## 快速開始

### 安裝依賴
\`\`\`bash
npm install
# 或
pnpm install
\`\`\`

### 開發模式
\`\`\`bash
npm run dev
\`\`\`

### 生產構建
\`\`\`bash
npm run build
\`\`\`

## 配置

### Google Sheets 設定

1. 在 Google Sheet 中建立 Apps Script
2. 複製 `apps-script.gs` 的代碼
3. 部署為 Web App
4. 將部署 URL 更新到 `Home.tsx` 中的 `GAS_URL`

### 環境變數

無需額外環境變數，所有配置已內嵌在代碼中。

## 檔案結構

- `client/src/pages/Home.tsx` - 主表單頁面
- `client/src/lib/productImages.ts` - 產品資料和圖片 URL
- `client/src/index.css` - 全域樣式

## 聯絡方式

有任何問題，請聯繫開發者。

---

**最後更新：2026 年 6 月 22 日**
