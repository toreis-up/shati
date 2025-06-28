# Architecture Guide

本プロダクトのアーキテクチャについて説明します。

## 1. Project Architecture

本プロダクトはNxを用いたmonorepo構成です。
以下により構成されています。
repoマネージャー: Nx
パッケージマネージャー: yarn v4 (corepackにより固定済み)

## 2. Application

/apps: アプリケーションのソースコードが入っています。
/apps/ShaTi-frontend: フロントエンドのソースコードが入っています。
/apps/ShaTi-backend: バックエンドのソースコードが入っています。
/libs: アプリケーションを構築するもののうち、共通で使用したいものが入っています。
/libs/utils: ユーティリティ系です。一般的に使えそうな関数が入っています。
/libs/types: 型定義です。

### 2.1. Frontend

フロントエンドです。
Cloudflare Pagesに上げることを前提に組まれています。
Cloudflareがrepoを監視し、変更されたら勝手にビルドしてデプロイしてくれます。

技術スタック: Nuxt.js v3, Nuxt UI v3, Pinia
言語: TypeScript
Linter: （未導入, 将来的に導入を検討）

なお、カラーテーマはNuxt UIにより、assets/css/main.cssにて定義しています。
色を指定する前に、main.cssに書いてないか、Nuxt UIのテーマで実現可能でないかを確認してください。
Nuxt UIのテーマ指定方法は[このページ](https://ui.nuxt.com/getting-started/theme)にかかれています。

### 2.2. Backend

バックエンドです。
Cloudflare Workersに上げることを前提に組まれています。
Cloudflareがrepoを監視し、変更されたら勝手にビルドしてデプロイしてくれます。

技術スタック: Hono, Cloudflare Durable Objects
言語: TypeScript
その他依存: Wrangler
Linter: （未導入, 将来的に導入を検討）
