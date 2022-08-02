# actions-diff-pr-management

${DESCRIPTION}

本Actionsを使わずにフォーマットを修正した場合、自動的にPRを閉じます。

## 注意点

元のPRを閉じた場合、本Actionsが立てたPRは残ります。  
このような場合、 <https://github.com/dev-hato/actions-close-pr> を併用することで自動的にPRを閉じることができます。

## 使い方

```yaml
on:
  pull_request:

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

${INPUTS}

## 開発

### 設定

<https://pre-commit.com/> の手順に従って `pre-commit` をインストールします。  
これにより、コミット時にクレデンシャルが含まれていないかの検査が行われるようになります。
