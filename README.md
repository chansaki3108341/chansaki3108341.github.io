# Chansaki の個人サイト

GitHub Pages（Jekyll）で運用する個人サイトです。  
静かな読み心地と、文章中心の構成を重視しています。

- 公開URL: `https://chansaki3108341.github.io`
- 主なコンテンツ:
  - `index.md`（トップページ）
  - `murmurs/`（独り言: エッセイ・日記・メモ）

## 技術構成

- GitHub Pages
- Jekyll（プラグインなし、安全モード想定）
- カスタムレイアウト（`_layouts/`）
- カスタムCSS（`assets/css/site.css`）

## ディレクトリ構成

```text
.
├── _config.yml              # サイト設定
├── _layouts/                # レイアウト
│   ├── default.html
│   ├── page.html
│   └── murmur.html
├── _murmurs/                # 独り言コレクション
├── assets/css/site.css      # サイト全体スタイル
├── index.md                 # トップページ
├── murmurs/index.md         # 独り言一覧
└── 404.md                   # 404ページ
```

## 独り言の追加方法

1. `_murmurs/` に `YYYY-MM-DD-slug.md` 形式でファイルを作成
2. 先頭に Front Matter を記述

```yaml
---
title: "記事タイトル"
date: 2026-02-12
tags: [日記]
---
```

3. 本文を Markdown で記述してコミット

`_config.yml` のコレクション設定により、`/murmurs/:name/` で公開されます。

## ローカル確認

Jekyll 環境がある場合:

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve
```

表示: `http://127.0.0.1:4000`

## License

- Code (layouts, CSS, templates, build config): MIT License (see LICENSE)
- Content (posts, essays, pages under `_murmurs/`, `murmurs/`, and `*.md` texts): CC BY-NC-ND 4.0 (see LICENSE-CONTENT.md)
