# Chansaki の個人サイト

GitHub Pages（Jekyll）で運用している個人サイトです。  
文章ページに加えて、サイト内コンテンツの関係を可視化する知識グラフページを公開しています。

- 公開 URL: `https://chansaki3108341.github.io`
- 主要ページ:
  - `/`（トップページ）
  - `/murmurs/`（独り言一覧）
  - `/graph/`（知識グラフ）

## 技術スタック

- GitHub Pages + Jekyll
- プラグインなし（`plugins: []`）
- カスタムレイアウト（`_layouts/`）
- カスタムスタイル（`assets/css/site.css`）
- Giscus コメント（独り言ページ）
- MathJax（`math: true` を付けたページ）
- Cytoscape.js + cytoscape-fcose（知識グラフの描画）

## 現在の構成

```text
.
├── _config.yml                 # サイト設定
├── _includes/
│   └── giscus.html             # コメント埋め込み
├── _layouts/
│   ├── default.html            # 共通レイアウト
│   ├── page.html               # 通常ページ
│   └── murmur.html             # 独り言記事ページ
├── _murmurs/                   # 独り言コレクション（記事 + 画像）
├── assets/
│   ├── css/site.css            # サイト全体スタイル
│   ├── js/kg.js                # 知識グラフ UI
│   └── data/kg.json            # 知識グラフデータ
├── graph/index.md              # 知識グラフページ
├── murmurs/index.md            # 独り言一覧ページ
├── index.md                    # トップページ
└── 404.md                      # 404ページ
```

## 独り言（`_murmurs/`）の追加

1. `_murmurs/` に `YYYY-MM-DD-slug.md` 形式で記事を作成
2. Front Matter を記述
3. 本文を Markdown で記述

例:

```yaml
---
title: "記事タイトル"
date: 2026-02-22
tags: [日記]
math: false
comments: true
---
```

補足:
- `math: true` を付けると MathJax を読み込みます。
- `comments: false` を付けると、その記事ではコメント欄を非表示にします。
- `_config.yml` のコレクション設定により、記事は `/murmurs/:name/` で公開されます。

## 知識グラフ（`/graph/`）の更新

データファイル `assets/data/kg.json` は Cytoscape の `elements` 形式です。  
ノードとエッジを同一配列で管理します。

ノード例:

```json
{
  "data": {
    "id": "field_fm",
    "label": "形式手法",
    "type": "concept",
    "parent": "mem_research"
  }
}
```

エッジ例:

```json
{
  "data": {
    "id": "e_fm_uses_mc",
    "source": "field_fm",
    "target": "concept_model_checking",
    "label": "uses"
  }
}
```

運用メモ:
- `id` は一意にしてください。
- `parent` は存在するノード `id` を指定します。
- `href` を付けるとノード詳細パネルから遷移先を設定できます。
- 現在の `kg.js` では、`開く` ボタンはサイト内リンク（相対 URL）のみ有効です。

## ローカル開発

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve
```

確認先:
- `http://127.0.0.1:4000/`
- `http://127.0.0.1:4000/murmurs/`
- `http://127.0.0.1:4000/graph/`

## ライセンス

- コンテンツ（`_murmurs/`, `murmurs/`, `*.md` の文章）:
  `CC BY-NC-ND 4.0`（`LICENSE-CONTENT.md`）
