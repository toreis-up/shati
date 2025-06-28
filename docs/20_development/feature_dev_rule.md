# Feature Development Rule

機能開発のルールです。

## 1. General Rules

機能開発においては「ユーザーに影響をもたらす大きな機能」のみならず、基本的に変更するレベルで1機能とします。

## 2. Branch Rules

ブランチはmainに追従してください。(MUST)
機能開発時の最新mainコミットから`git switch -c <category>/<branch-name>`でブランチを生やしてください。

なお、categoryは## 2. Commit Message rulesに従ってください。
branch-nameは、機能の内容を簡潔に表現し、ケバブケースで記述してください。

```text
Example
時計の色を変更できるようにする機能を追加するとき
feat/change-clock-color
```
