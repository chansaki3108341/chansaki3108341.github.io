---
layout: page
title: 本サイトの知識グラフ
description: 興味領域とサイト内コンテンツをつないだナレッジグラフ。
scripts:
  - https://unpkg.com/cytoscape@3.27.0/dist/cytoscape.min.js
  - https://unpkg.com/cytoscape-fcose@2.2.0/cytoscape-fcose.js
  - /assets/js/kg.js?v=20260221-1
---

<p class="muted small">
  ノードをクリックすると選択され、右のペインに詳細が表示されます。「開く」から該当ページへ移動できます。
</p>

<div class="kg-shell">
  <div class="kg-stage">
    <div class="note muted small kg-hint">
      操作: ドラッグで移動 / ホイールで拡大縮小 / 背景をダブルクリックで全体フィット
    </div>

    <div id="kg" class="kg" data-elements-url="{{ '/assets/data/kg.json' | relative_url }}"></div>
  </div>

  <aside id="kgPanel" class="kg-panel" aria-live="polite">
    <div class="kg-panel__inner">
      <div class="kg-panel__header">
        <div class="kg-panel__kicker muted small">選択中のノード</div>
        <button id="kgPanelClear" class="kg-panel__clear" type="button" aria-label="閉じる">閉じる</button>
      </div>

      <h2 id="kgPanelTitle" class="kg-panel__title">（未選択）</h2>
      <p id="kgPanelMeta" class="kg-panel__meta muted small">ノードをクリックして選択してください。</p>

      <div class="kg-panel__actions">
        <a id="kgPanelOpen" class="kg-panel__open" href="#" aria-disabled="true">開く</a>
      </div>
    </div>
  </aside>
</div>
