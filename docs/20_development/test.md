# テスト方針

本ドキュメントでは、テストをどのように行い、どのようなことを保証するべきかについて説明します。
なお、テストフレームワークはVitestです。
ロジックを実装するごとに、考えられるテストケースを確実に洗い出し、実装してください。

## 1. Purpose of Testing

テストは、コードに実装したロジックが間違っていないことを保証するものです。
すなわちコード品質を担保して、ユーザーにバグを提供しないようにするものです。

## 2. Testing Method

テストは以下の事項を満たすことを条件とします。

1. テストは自動化されていること
2. テストはCIで実行されること
3. テストはコードの変更に対して自動的に実行されること
4. テストはコードの品質を保証するものであること
5. コードカバレッジは95%以上を目指すこと（カバレッジはvitestの--coverageオプションで表示できます）

## 2.1. 単体テスト

単体テストは、コードの各部分が正しく動作することを確認するために行います。
単体テストは、以下の事項を満たすことを条件とします。

1. 各関数やメソッドの入力と出力を確認すること
2. 例外処理やエラーハンドリングの動作を確認すること
3. モックやスタブを使用して、外部依存関係を排除すること
4. テストケースは、コードの変更に対して自動的に実行されること
5. テストは、エッジケースや境界値を含むこと
6. 本来ありえない入出力についても、確実にテストすること

## 2.2. 結合テスト

結合テストは、複数のモジュールやコンポーネントが正しく連携して動作することを確認するために行います。
結合テストは、以下の事項を満たすことを条件とします。

1. モジュール間のインターフェースが正しく動作すること
2. データの受け渡しや変換が正しく行われること
3. 外部サービスやAPIとの連携が正しく行われること
4. テストケースは、コードの変更に対して自動的に実行されること
5. テストは、エッジケースや境界値を含むこと
6. 本来ありえない入出力についても、確実にテストすること
7. モックやスタブを使用して、外部依存関係を排除すること（APIのモック・スタブについては、ドキュメントから入出力仕様を模倣してください。）

memo

今後、E2EテストやUIテストを追加する可能性があります。現在はこれらのテストを検討する必要はなく、上記のテストのみを実装してください。
