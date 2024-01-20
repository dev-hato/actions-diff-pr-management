# actions-diff-pr-management

${DESCRIPTION}

本Actions    を使わずにフォーマットを修正した場合や元のPRを閉じた場合、自動的にPRを閉じます。

##       使い方

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - closed # 本Actionsを使わずに元のPRを閉じた際に自動的にPRを閉じるために必要 (このtypeの場合は本Actionsのstepのみ実行する)

jobs:
  diff-pr-management:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        if: github.event_name != 'pull_request' || github.event.action != 'closed'
        with:
          fetch-depth: 0
          ref: ${{ github.event.pull_request.head.sha || github.sha }}
      - if: github.event_name != 'pull_request' || github.event.action != 'closed'
        run: hoge fmt # FIXME フォーマッタを走らせる
      - uses: dev-hato/actions-diff-pr-management@v1
        if: success() || failure()
        with:
          github-token: ${{secrets.GITHUB_TOKEN}}
```

## 例

* 元のPR: <https://github.com/dev-hato/actions-diff-pr-management/pull/96>
* 本Actionsによって作成されたPR: <https://github.com/dev-hato/actions-diff-pr-management/pull/98>

## 引数

${INPUTS}

## 対応しているトリガー
* pull_request
* push
* schedule
* workflow_dispatch
* repository_dispatch

## 開発

### 設定

<https://pre-commit.com/> の手順に従って `pre-commit` をインストールします。  
これにより、コミット時にクレデンシャルが含まれていないかの検査が行われるようになります。
