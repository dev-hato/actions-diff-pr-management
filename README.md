# actions-diff-pr-management

PRのブランチに対して、フォーマッタを実行した結果をPRにするGitHub Actionsです。

本Actionsを使わずにフォーマットを修正した場合や元のPRを閉じた場合、自動的にPRを閉じます。

## 使い方

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - closed

jobs:
  diff-pr-management:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          ref: ${{ github.event.pull_request.head.sha }}
      - run: hoge fmt # FIXME フォーマッタを走らせる
      - uses: dev-hato/actions-diff-pr-management@v1
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
          repo-name: ${{ github.event.pull_request.head.repo.full_name }}
```

## 例

* 元のPR: <https://github.com/dev-hato/actions-diff-pr-management/pull/96>
* 本Actionsによって作成されたPR: <https://github.com/dev-hato/actions-diff-pr-management/pull/98>

## 引数

| 引数名 | 説明 | 必須 |
|:---:|:---:|:---:|
| github-token | GitHubのトークン。 | O |
| repo-name | リポジトリ名。 `pull_request` 以外のトリガーも設定している場合はリポジトリ名を決め打ちで入力。 | O |
| branch-name-prefix | branch名の接頭語。 |  |
| pr-title-prefix | PRのタイトルの接頭語。 |  |
| pr-description-prefix | 本文の接頭語。 |  |
| base-branch | ベースブランチ。 `pull_request` 以外のトリガーの場合は決め打ちで入力。 |  |

## 開発

### 設定

<https://pre-commit.com/> の手順に従って `pre-commit` をインストールします。  
これにより、コミット時にクレデンシャルが含まれていないかの検査が行われるようになります。
