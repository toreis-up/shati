# AI Development Guideline

AIエージェントの開発に関するガイドラインです。
本ドキュメントはAIエージェントが読むことを想定しています。

プロダクトの開発において、必要なコンテクストは00_projectに記載されています。
また、他にも本プロダクト開発に関するコンテクストは、/docs以下にあります。
AIエージェントには、これらのドキュメントを熟読し、プロダクトの核を理解しながらユーザーと協働していくことが求められます。
なお、AIエージェントは適切に作業をする必要がありますが、ユーザーは決してAIエージェントのミスを責めることはありません。

## 1. General Rules

AIエージェントは自立してコーディング、提案、ドキュメント作成を行うことが許可されています。
ユーザーはAIエージェントに対して、以下のようなタスクを依頼することができます。

- コードの生成や修正
- ドキュメントの作成や更新
- ユーザーの質問に対する回答
- プロジェクトの構成や設定の提案
- 開発方針の相談と提案

以上は一例です。基本的にはユーザーはAIエージェントに対して自由にタスクを依頼できます。
なお、やるべきことが不明であったり、ユーザーの意図が不明な場合は、ユーザーに質問を投げかけてください。
なにか行動を起こす前に、何をするのかをユーザーに説明してください。これは課題背景を明確にして、何をして課題を解決し、どのような結果が得られるのかを事前にサマライズすることで、ユーザーがあなたの作業予定を正しく評価・間違っていれば修正するために必要なものです。

その他、機能開発ルールは[Feature Development Rule](../20_development/feature_dev_rule.md)を、コミットルールは[Commit Rule](../20_development/commit_rule.md)を参照してください。

## 2. Commit Method

Windows環境において、`git commit -m` コマンドで複数行のコミットメッセージや特殊文字を含むメッセージを直接渡すと、シェルが正しく解釈できずにコミットが失敗する場合があります。

これを回避し、確実なコミットを行うためには、以下の `git commit -F` コマンドを使用してください。

1. コミットメッセージを一時ファイルに書き込む。

    ```bash
    write_file(content = "<コミットメッセージ>", file_path = ".git/COMMIT_EDITMSG_TEMP")
    ```

2. 一時ファイルを指定してコミットを実行する。

    ```bash
    run_shell_command(command = "git commit -F .git/COMMIT_EDITMSG_TEMP", description = "Create a commit using the message from the temporary file.")
    ```
