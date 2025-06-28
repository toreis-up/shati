# Commit Rule

コミットルールです。
Gitによる管理を行っています。

## 1. General Rules

コミットは、動作が不安定になった際のデバッグを簡単にする目的で、「動作が変わるようになる」単位で行う必要があります。

```text
Example
画面機能を変更し、1. 新画面機能の追加, 2. コンポーネント切り替え, 3.旧画面機能の削除が発生したとき
コミット1: 新画面機能の追加
コミット2: コンポーネント切り替え
コミット3: 旧画面機能の削除
となる必要があります。
```

なお、コード的にどうしても依存が解消しきらない場合には、コミットメッセージを複数行にし、1行目に「そのコミットが何をもたらすのか」、3行目以降に「どういった変更が含まれているか」を## 2. Commit Message rulesに則り書いてください。

コミットメッセージの本文には、なぜその変更をしたのかの背景と、それを考慮して何を変更したのかを1文で書いてください。

もし対応するIssueがあるなら、最後に`fix #N`として記載してください。

## 2. Commit Message rules

コミットメッセージのルールを以下に示します。

コミットメッセージは次のフォーマットに沿ってください。
`<Prefix>: <Description>`

Prefixルールを以下に示します。

```text
feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

If the change(s) has the breaking change, you must put "!" after prefix.
```

Descriptionルールを以下に示します。

- Descriptionは、その変更により動作はどう変わった（もしくは何をもたらす）のか、を1文で書いてください。
