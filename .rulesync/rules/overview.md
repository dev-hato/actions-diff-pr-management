---
root: true
targets:
  - "*"
globs:
  - "**/*"
description: 本リポジトリで作業する際のAIエージェント向けのガイド
---

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
- `action.yml`の`run:`や`script:`には、外部から入る値を`${{ }}`で埋め込まず、`env:`経由で渡す。
- ブランチ名は利用者が自由に付けられるため、エスケープしてから修正PRの本文のMarkdownやmermaidに埋め込む。

## テスト（`tests/`）

- `src/*.ts`は拡張子なしのimportを使っているため、テストからは直接importせず、`tsx/esm/api`の`tsImport`で読み込む。
- `push.test.mts`は、偽の`git`（`tests/mock_git.sh`から`tests/mock_git.mts`を呼ぶ）を`PATH`に置いて、`src/push.sh`を`bash`で実行する。偽の`git`は、呼び出しごとの引数をJSON Lines形式で`MOCK_GIT_LOG`に記録する。終了コードや出力は`MOCK_*`環境変数で制御する。

## `README.md`

`README.md`は`README.template.md`から生成します。
生成される部分ではなく、テンプレートと`action.yml`の`description`や`inputs:`を編集してください。
テンプレートは`envsubst`で処理されるため、`$`をそのまま書かないでください。
