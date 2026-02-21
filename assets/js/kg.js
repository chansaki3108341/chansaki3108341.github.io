(function () {
  const el = document.getElementById('kg');
  if (!el || typeof cytoscape === 'undefined') return;

  const panel = document.getElementById('kgPanel');
  const panelTitle = document.getElementById('kgPanelTitle');
  const panelMeta = document.getElementById('kgPanelMeta');
  const panelOpen = document.getElementById('kgPanelOpen');
  const panelClear = document.getElementById('kgPanelClear');

  // Optional: better compound layout
  if (window.cytoscapeFcose && typeof cytoscape.use === 'function') {
    cytoscape.use(window.cytoscapeFcose);
  }

  const url = el.getAttribute('data-elements-url') || '/assets/data/kg.json';

  const css = getComputedStyle(document.documentElement);
  const c = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const COLORS = {
    bg: c('--bg', '#ffffff'),
    surface: c('--surface-strong', '#ffffff'),
    text: c('--text', '#223'),
    muted: c('--muted', '#667'),
    border: c('--border', 'rgba(0,0,0,0.15)'),
    accent: c('--accent', '#9edbc8'),
    accentSoft: c('--accent-soft', 'rgba(158,219,200,0.26)'),
    accentInk: c('--accent-ink', '#3f8a75')
  };

  function sanitizeElements(raw) {
    if (!Array.isArray(raw)) return [];

    const isEdge = el => {
      const d = el && el.data;
      return !!(
        d &&
        typeof d === 'object' &&
        Object.prototype.hasOwnProperty.call(d, 'source') &&
        Object.prototype.hasOwnProperty.call(d, 'target')
      );
    };

    const nodes = [];
    const edges = [];
    const seenNodeIds = new Set();

    raw.forEach(el => {
      if (!el || typeof el !== 'object' || !el.data || typeof el.data !== 'object') return;

      if (isEdge(el)) {
        edges.push(el);
        return;
      }

      const id = el.data.id;
      if (!id || seenNodeIds.has(id)) return;
      seenNodeIds.add(id);
      nodes.push({ ...el, data: { ...el.data } });
    });

    const nodeIds = new Set(nodes.map(n => n.data.id));

    // If a parent no longer exists, keep the node as top-level instead of failing.
    const fixedNodes = nodes.map(n => {
      const parent = n.data.parent;
      if (parent && !nodeIds.has(parent)) {
        const d = { ...n.data };
        delete d.parent;
        return { ...n, data: d };
      }
      return n;
    });

    const fixedEdges = [];
    const seenEdgeIds = new Set();
    edges.forEach(e => {
      const d = e.data || {};
      if (!d.source || !d.target) return;
      if (!nodeIds.has(d.source) || !nodeIds.has(d.target)) return;

      const id = d.id || `${d.source}->${d.target}`;
      if (seenEdgeIds.has(id)) return;
      seenEdgeIds.add(id);

      fixedEdges.push({ ...e, data: { ...d, id } });
    });

    return [...fixedNodes, ...fixedEdges];
  }

  fetch(url, { cache: 'no-store' })
    .then(r => r.json())
    .then(rawElements => {
      const elements = sanitizeElements(rawElements);
      const cy = cytoscape({
        container: el,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              color: COLORS.text,
              'background-color': COLORS.surface,
              'border-width': 1,
              'border-color': COLORS.border,
              shape: 'round-rectangle',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-wrap': 'wrap',
              'text-max-width': 100,
              padding: '4px',
              'font-size': 10
            }
          },
          {
            selector: 'node[type="page"], node[type="post"], node[type="section"]',
            style: {
              'background-color': COLORS.accentSoft,
              'border-color': COLORS.accent,
              'font-weight': 700
            }
          },
          {
            selector: 'node#post_hello',
            style: {
              'background-color': COLORS.surface,
              'border-color': COLORS.border,
              'font-weight': 400
            }
          },
          {
            selector: 'node[type="tag"]',
            style: { shape: 'ellipse', 'background-color': COLORS.accentSoft }
          },
          {
            selector: ':parent',
            style: {
              label: 'data(label)',
              'text-valign': 'top',
              'text-halign': 'center',
              'font-size': 12,
              'font-weight': 700,
              color: COLORS.muted,
              'background-opacity': 0.06,
              'background-color': COLORS.accent,
              'border-width': 1,
              'border-style': 'dashed',
              'border-color': COLORS.border,
              padding: '10px'
            }
          },
          {
            selector: 'edge',
            style: {
              'curve-style': 'bezier',
              width: 1,
              'line-color': COLORS.border,
              'target-arrow-color': COLORS.border,
              'target-arrow-shape': 'triangle',
              'arrow-scale': 0.8,
              label: 'data(label)',
              'font-size': 9,
              color: COLORS.muted,
              'text-background-opacity': 0.85,
              'text-background-color': COLORS.bg,
              'text-background-padding': 2
            }
          },
          { selector: 'node[type="layout"]', style: { width: 1, height: 1, opacity: 0, label: '' } },
          { selector: 'edge[type="layout"]', style: { width: 1, opacity: 0, label: '', 'target-arrow-shape': 'none' } },

          { selector: 'node:selected', style: { 'border-width': 3, 'border-color': COLORS.accentInk } },
          { selector: 'node:hover', style: { 'border-width': 2, 'border-color': COLORS.accentInk } },
          { selector: 'node:selected:hover', style: { 'border-width': 3, 'border-color': COLORS.accentInk } },
          { selector: 'edge:hover', style: { width: 2, 'line-color': COLORS.accentInk, 'target-arrow-color': COLORS.accentInk } }
        ],
        layout: { name: 'preset' }
      });

      // ----------------------------
      // Right panel (select -> inspect -> open)
      // ----------------------------
      function toInternalHref(href) {
        const v = (href || '').trim();
        if (!v) return null;
        // Avoid leaving this site from the graph panel.
        if (/^https?:\/\//i.test(v) || v.startsWith('//')) return null;
        return v;
      }

      // node.href が無い場合、parent を遡って近い href（例: membrane の /#...）を使う
      function resolveHref(node) {
        if (!node) return null;
        let href = toInternalHref(node.data('href'));
        if (href) return href;

        let cur = node;
        const seen = new Set();
        while (cur && cur.data && cur.data('parent')) {
          const pid = cur.data('parent');
          if (!pid || seen.has(pid)) break;
          seen.add(pid);
          const p = cy.getElementById(pid);
          if (!p || p.empty()) break;
          href = toInternalHref(p.data('href'));
          if (href) return href;
          cur = p;
        }
        return null;
      }

      function findCategoryLabel(node) {
        if (!node) return null;
        let cur = node;
        const seen = new Set();
        while (cur && cur.data && cur.data('parent')) {
          const pid = cur.data('parent');
          if (!pid || seen.has(pid)) break;
          seen.add(pid);
          const p = cy.getElementById(pid);
          if (!p || p.empty()) break;
          if (p.data('type') === 'membrane') return p.data('label') || pid;
          cur = p;
        }
        return null;
      }

      function typeLabel(type) {
        const map = { membrane: 'カテゴリ', concept: '概念', page: 'ページ', post: '記事', section: 'セクション', tag: 'タグ' };
        return map[type] || type || 'node';
      }

      function setPanelEmpty() {
        if (!panel) return;
        panel.style.display = 'none';
        if (panelTitle) panelTitle.textContent = '（未選択）';
        if (panelMeta) panelMeta.textContent = 'ノードをクリックして選択してください。';
        if (panelOpen) {
          panelOpen.textContent = '開く';
          panelOpen.setAttribute('aria-disabled', 'true');
          panelOpen.setAttribute('href', '#');
          panelOpen.setAttribute('tabindex', '-1');
          panelOpen.removeAttribute('target');
          panelOpen.removeAttribute('rel');
        }
      }

      function updatePanel(node) {
        if (!panel) return;

        if (!node) return setPanelEmpty();
        panel.style.display = '';

        const label = node.data('label') || node.id();
        const cat = findCategoryLabel(node);
        const t = typeLabel(node.data('type'));
        const meta = [t, cat ? `所属: ${cat}` : null].filter(Boolean).join(' / ');
        const href = resolveHref(node);

        if (panelTitle) panelTitle.textContent = label;
        if (panelMeta) panelMeta.textContent = meta;

        if (panelOpen) {
          if (!href) {
            panelOpen.textContent = '開く';
            panelOpen.setAttribute('aria-disabled', 'true');
            panelOpen.setAttribute('href', '#');
            panelOpen.setAttribute('tabindex', '-1');
            panelOpen.removeAttribute('target');
            panelOpen.removeAttribute('rel');
          } else {
            panelOpen.textContent = '開く';
            panelOpen.setAttribute('aria-disabled', 'false');
            panelOpen.setAttribute('href', href);
            panelOpen.removeAttribute('tabindex');
            panelOpen.removeAttribute('target');
            panelOpen.removeAttribute('rel');
          }
        }
      }

      function clearSelection() {
        cy.elements(':selected').unselect();
        updatePanel(null);
      }

      setPanelEmpty();

      // クリック＝選択（遷移しない）
      cy.on('tap', 'node', evt => {
        const node = evt.target;
        if (!node || node.data('type') === 'layout') return;
        cy.elements(':selected').unselect();
        node.select();
        updatePanel(node);
      });

      if (panelClear) panelClear.addEventListener('click', () => clearSelection());

      // -------- layout --------
      const usingFcose = !!window.cytoscapeFcose;
      const layoutName = usingFcose ? 'fcose' : 'cose';

      const layoutOpts = {
        name: layoutName,
        animate: false,
        fit: false,
        randomize: true,
        padding: 10,
        componentSpacing: 3,
        nestingFactor: 0.50,
        nodeDimensionsIncludeLabels: true,
        avoidOverlap: true,
        gravity: 1.25,
        edgeElasticity: 0.14,
        nodeSeparation: 16,
        numIter: 450,
        packComponents: true,
        idealEdgeLength: edge => {
          if (edge.data('type') === 'layout') return 8;
          const sDeg = edge.source().degree();
          const tDeg = edge.target().degree();
          const isLeafEdge = sDeg <= 1 || tDeg <= 1;
          return isLeafEdge ? 10 : 20;
        },
        nodeRepulsion: node => {
          if (node.data('type') === 'layout') return 2600;
          const d = node.degree();
          return d <= 1 ? 760 : 1500;
        }
      };

      if (usingFcose) {
        layoutOpts.quality = 'default';
        layoutOpts.tile = true;
        layoutOpts.tilingPaddingVertical = 8;
        layoutOpts.tilingPaddingHorizontal = 8;
        layoutOpts.packComponents = true;
      }

      function fitGraph() {
        const root = cy.getElementById('mem_root');
        const target = (!root.empty()
          ? root.union(root.descendants()).filter(n => n.isNode() && n.data('type') !== 'layout')
          : cy.nodes().filter(n => !n.isParent() && n.data('type') !== 'layout'));

        if (!target.length) return;
        cy.fit(target, 30);
        if (cy.zoom() < 0.95) {
          cy.zoom(0.95);
          cy.center();
        }
      }

      function addLayoutHubIfNeeded() {
        const comps = cy.elements().components();
        if (comps.length <= 1) return null;

        const hubId = '__layout_hub';
        cy.add({ group: 'nodes', data: { id: hubId, type: 'layout' } });

        comps.forEach((comp, i) => {
          const rep = comp.nodes().filter(n => !n.isParent() && n.data('type') !== 'layout')[0];
          if (!rep) return;
          cy.add({ group: 'edges', data: { id: `__layout_e${i}`, source: hubId, target: rep.id(), type: 'layout' } });
        });

        return hubId;
      }

      function addMembraneHubs() {
        const hubIds = [];
        const parents = cy.nodes(':parent').filter(p => p.id() !== 'mem_root');

        parents.forEach(p => {
          const kids = p.children().filter(n => !n.isParent() && n.data('type') !== 'layout');
          if (kids.length < 4) return;

          const hubId = `__memhub_${p.id()}`;
          hubIds.push(hubId);
          cy.add({ group: 'nodes', data: { id: hubId, type: 'layout', parent: p.id() } });

          kids.forEach((k, i) => {
            cy.add({ group: 'edges', data: { id: `__memedge_${p.id()}_${i}`, source: hubId, target: k.id(), type: 'layout' } });
          });
        });

        return hubIds;
      }

      const hubId = addLayoutHubIfNeeded();
      const membraneHubIds = addMembraneHubs();

      cy.one('layoutstop', () => {
        if (hubId || membraneHubIds.length) {
          cy.remove('edge[type="layout"]');
          cy.remove('node[type="layout"]');
        }
        fitGraph();
      });

      cy.layout(layoutOpts).run();

      // 背景：ダブルクリックでfit / シングルクリックで選択解除
      let last = 0;
      cy.on('tap', evt => {
        if (evt.target !== cy) return;
        const now = Date.now();
        if (now - last < 350) {
          fitGraph();
        } else {
          clearSelection();
        }
        last = now;
      });
    })
    .catch(err => {
      console.error('[kg] failed', err);
      el.innerHTML = '<p class="muted small">グラフの読み込みに失敗しました。</p>';
    });
})();
