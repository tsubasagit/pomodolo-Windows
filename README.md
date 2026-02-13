# ポモドーロタイマー

Windows向けのポモドーロタイマー デスクトップアプリです。
Electron + React + TypeScript で構築されています。

## 機能

- **25分 / 5分 / 15分** のポモドーロサイクル（4セッションごとに長休憩）
- 円形プログレスバーによるタイマー表示
- 開始 / 一時停止 / リセット / スキップ操作
- セッション完了数のドットインジケーター
- タイマー終了時のデスクトップ通知と通知音
- フレームレスウィンドウによる洗練されたUI

## スクリーンショット

| 集中モード | 休憩モード |
|:---:|:---:|
| ![集中モード](image/screenshot-work.png) | ![休憩モード](image/screenshot-break.png) |

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## 技術スタック

- Electron
- React 18
- TypeScript
- Vite
