# 本リポジトリで作業する際のガイド

README、コメント、PRの文章、コミットメッセージは日本語で書きます。

`CLAUDE.md`、`AGENTS.md`、`.github/copilot-instructions.md`はrulesyncで生成しています。
直接編集せず、`.rulesync/rules/`を編集してから`npx rulesync generate`を実行してください。

## コマンド

- ビルド： `npx tsc`。`src/*.ts`を`dist/*.js`（CommonJS）にコンパイルする。npmのbuildスクリプトはない。
- テストケース単位の実行： `node --test --test-name-pattern="<正規表現>" tests/push.test.mts`
- シェルスクリプトは`shfmt`のスタイル（タブでインデント）に従う。
- 日本語の文章（READMEなど）の校正： `npx textlint README.md README.template.md`
- READMEの再生成： `bash scripts/format/format/update_readme.sh`
  - `yq`と`envsubst`が必要。`INPUTS`は`scripts/format/format/get_inputs_markdown.ts`で作る。

## コードの決まりごと

- `dist/`はコミットし、`action.yml`から直接使う。`src/*.ts`を変更したら`npx tsc`を実行し、更新した`dist/`を`src`と一緒にコミットする。
- `action.yml`の後続のstepは、`inputs`ではなく**Set env**が`GITHUB_ENV`に書き込んだ環境変数から設定を読む。

## セキュリティ

本Actionsは、書き込み権限のあるトークンを使い、他人が作ったPRのブランチ名やタイトルを扱います。
実装やレビューでは、正しく動くかに加えて、悪意ある入力や操作に耐えられるかを必ず確認してください。

- ブランチ名、PRのタイトル、inputsなどの外部から入る値は、攻撃者が自由に決められるものとして扱う。gitのref名には`` ` ``、`'`、`"`、`@`、`$`、`;`なども使える。
- 値の使い道ごとに、値が文字列やコードの外へ出られないようにする。
  - `action.yml`の`run:`や`script:`には`${{ }}`で埋め込まず、`env:`経由で渡す。
  - シェルでは変数を必ずダブルクォートで囲み、`eval`や文字列からのコマンド組み立てをしない。
  - `GITHUB_ENV`や`GITHUB_OUTPUT`には、改行で別の値を注入されないよう、ランダムなdelimiterのheredoc形式で書き込む。
  - 修正PRの本文のMarkdownやmermaidには、エスケープしてから埋め込む。
- トークンをログやエラーメッセージに出さない。
- force push、PRのclose、ブランチの削除の前に、本Actions以外の変更を消さないかを確認する。
- 新しい外部のActionsはコミットハッシュで固定する。依存パッケージは、公開から日が浅い版を避ける。
- 修正には、攻撃に使われる入力で結果が変わらないことを確かめるテストを付ける。
- レビューで脆弱性を見つけた場合は、公開のIssueやPRに詳細を書かず、まず報告する。

## テスト（`tests/`）

- `src/*.ts`は拡張子なしのimportを使っているため、テストからは直接importせず、`tsx/esm/api`の`tsImport`で読み込む。
- `push.test.mts`は、偽の`git`（`tests/mock_git.sh`から`tests/mock_git.mts`を呼ぶ）を`PATH`に置いて、`src/push.sh`を`bash`で実行する。偽の`git`は、呼び出しごとの引数をJSON Lines形式で`MOCK_GIT_LOG`に記録する。終了コードや出力は`MOCK_*`環境変数で制御する。

## `README.md`

`README.md`は`README.template.md`から生成します。
生成される部分ではなく、テンプレートと`action.yml`の`description`や`inputs:`を編集してください。
テンプレートは`envsubst`で処理されるため、`$`をそのまま書かないでください。
