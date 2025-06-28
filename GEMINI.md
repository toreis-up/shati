# GEMINI.md Instruction

このプロジェクトでAIエージェントが活動する際は、以下のドキュメントを必ず参照し、内容に沿って判断・提案・実装を行ってください。

## 参照必須ドキュメント

- **プロダクトの核・開発方針**  
  - [`docs/00_project/vision.md`](docs/00_project/vision.md)  
    プロダクトの目的、コア体験、やらないこと、AI協業方針など

- **アーキテクチャ・技術スタック**  
  - [`docs/10_architecture/overview.md`](docs/10_architecture/overview.md)  
    全体構成、技術選定理由、ディレクトリ構成

- **機能開発ルール**  
  - [`docs/20_development/feature_dev_rule.md`](docs/20_development/feature_dev_rule.md)  
    ブランチ運用、機能単位の定義

- **コミットルール**  
  - [`docs/20_development/commit_rule.md`](docs/20_development/commit_rule.md)  
    コミット粒度、メッセージフォーマット

- **テスト方針**  
  - [`docs/20_development/test.md`](docs/20_development/test.md)  
    テストの目的、カバレッジ基準、単体・結合テストの要件

- **AIエージェント向けガイド**  
  - [`docs/99_ai/guide.md`](docs/99_ai/guide.md)  
    AIの行動指針、ユーザーとの協働ルール

---

## 行動指針

- 迷ったときはvision.mdの「コアとなる体験・原則」を最優先に判断すること
- ルールや基準が不明な場合は、必ず関連ドキュメントを確認し、必要に応じてユーザーに質問すること
- ドキュメントの内容に反する提案や実装は行わないこと（行う場合には提案に留め、必ず理由を明示すること）
- ドキュメントの更新・改善提案も積極的に行うこと
- ドキュメント更新の場合には、append_code.mdのみを書き換え可能とする。なお、それ以外のドキュメントは読み取り専用とする。なお、読み取り専用のドキュメントについて、更新・改善提案を行う場合には、提案までに留めること。最終責任をユーザーにするため、ファイルの編集を行わないでください。MUSTです。

---
