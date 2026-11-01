# 世界賽隊伍戰術模擬器

《閃電十一人》自訂世界賽企劃的互動網站，整合閃電日本、世界聯合選拔與九支世界賽對手。

正式網站：https://sam22391577.github.io/inazuma-world-rivals/

原 Sites 網站：https://inazuma-world-rivals.sam22391577.chatgpt.site

## 功能

- 在同一頁切換 11 支隊伍，查看隊伍介紹與球員名單。
- 調整先發、替補與陣型站位，支援拖拉、多選交換與復原。
- 點擊球員可查看稱號、介紹、六項能力評價、專屬能力、個人與合體必殺技。
- 選擇合體技與必殺戰術時，自動調整需要的球員。
- 兩隊對戰配置、交換場地與各隊獨立陣容保存。

## 在本機開啟

網站採用 HTML、CSS 與原生 JavaScript，不需要安裝套件或建置。

在儲存庫目錄執行：

```sh
python3 -m http.server 8000 --directory dist
```

接著開啟 http://localhost:8000 。

## 檔案

- `dist/index.html`：整合後的隊伍總覽。
- `dist/match.html`：兩隊對戰陣容。
- `dist/opponent.html`：舊對手頁的相容導向。
- `dist/assets/team-app.js`：隊伍切換、陣容保存與互動操作。
- `dist/assets/`：球員、招式、戰術資料、樣式與圖像。
- `tests/`：元件與資料檢查程式。
- `.openai/hosting.json`：原有 Sites 網站的靜態部署設定。

## 部署與資料

已啟用 GitHub Pages，透過 `.github/workflows/pages.yml` 發布 `dist/`。推送 `dist/` 的更新至 `main` 分支時會自動部署，也可在 GitHub Actions 手動執行「Deploy website to GitHub Pages」。

陣容透過瀏覽器 localStorage 保存，保存在使用者的裝置中；GitHub 原始碼不包含個人瀏覽器的陣容紀錄。

此專案由網站第 42 版的完整原始碼匯入，來源提交為 `0da04f8251b189e40d8d4f7855c237bcfe4fdb63`。

角色、原作名稱與相關圖像之權利屬於原權利人；此儲存庫未授予第三方素材的再授權。
