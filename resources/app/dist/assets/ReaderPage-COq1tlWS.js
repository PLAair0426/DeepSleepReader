const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./PdfReaderSurface-4aww6_Ip.js",
      "./rolldown-runtime-B1FJdls4.js",
      "./pdf-layout-RtW6j4T2.js",
      "./pdf-core-tMfnKj7m.js",
      "./app-framework-wcgWJpPK.js",
      "./pdf-core-BMew7iW7.css",
      "./pdf-layout-ohlw_0c7.css",
      "./pdf-reader-D0iQQ3Q4.js",
      "./pdfjs-runtime-CKdDv9cO.js",
    ]),
) => i.map((i) => d[i]);
import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import {
  C as r,
  _ as i,
  f as a,
  h as o,
  i as s,
  l as c,
  n as l,
  o as u,
  r as d,
  t as f,
  u as p,
} from "./reader-support-ChcPAXLa.js";
import { a as m, i as h, o as g, t as _ } from "./index-3POXocQJ.js";
import { n as v, r as ee, t as te } from "./format-AEs3_GdI.js";
import { t as y } from "./epub-reader-C-wEWLd4.js";
var b = e(t(), 1),
  x = n();
function S(e) {
  try {
    return JSON.parse(e.anchorPayloadJson);
  } catch {
    return null;
  }
}
function C(e) {
  return e.map((e, t) => ({
    id: `${t}-${e.href}`,
    label: e.label.trim(),
    href: e.href,
  }));
}
function w({
  documentId: e,
  sourceUrl: t,
  annotations: n,
  initialPositionPayloadJson: r,
  activeAnnotationId: i,
  focusedPositionPayloadJson: a,
  searchQuery: o,
  activeSearchResultId: s,
  onSelectionDraft: c,
  onPositionChange: l,
  onSearchResultsChange: u,
  onTableOfContentsChange: d,
}) {
  let [f, p] = (0, b.useState)(
      (0, b.useMemo)(() => {
        if (!r) return 0;
        try {
          return JSON.parse(r).cfi ?? 0;
        } catch {
          return 0;
        }
      }, [r]),
    ),
    [m, h] = (0, b.useState)([]),
    g = (0, b.useRef)(null),
    _ = (0, b.useRef)([]);
  ((0, b.useEffect)(() => {
    g.current &&
      n.forEach((e) => {
        let t = S(e);
        t &&
          g.current?.annotations.add(
            `highlight`,
            t.cfiRange,
            {},
            void 0,
            e.id,
            { fill: `rgba(183, 132, 82, 0.45)` },
          );
      });
  }, [n]),
    (0, b.useEffect)(() => {
      if (!g.current) return;
      _.current.forEach((e) => {
        g.current?.annotations.remove(e, `highlight`);
      });
      let e = m.map((e) => `search-${e.id}`);
      ((_.current = e),
        m.forEach((t, n) => {
          let r = JSON.parse(t.metadataJson ?? `{}`);
          r.cfi &&
            g.current?.annotations.add(`highlight`, r.cfi, {}, void 0, e[n], {
              fill:
                t.id === s
                  ? `rgba(106, 151, 215, 0.42)`
                  : `rgba(106, 151, 215, 0.2)`,
            });
        }));
    }, [s, m]),
    (0, b.useEffect)(() => {
      if (!i || !g.current) return;
      let e = n.find((e) => e.id === i),
        t = e ? S(e) : null;
      t?.cfiRange && g.current.display(t.cfiRange);
    }, [i, n]),
    (0, b.useEffect)(() => {
      if (!(!a || !g.current))
        try {
          let e = JSON.parse(a);
          e.cfi && g.current.display(e.cfi);
        } catch {}
    }, [a]),
    (0, b.useEffect)(() => {
      if (!s || !g.current) return;
      let e = m.find((e) => e.id === s);
      if (e)
        try {
          let t = JSON.parse(e.metadataJson ?? `{}`);
          t.cfi && g.current.display(t.cfi);
        } catch {}
    }, [s, m]));
  function v(e, t) {
    let n = t.window.getSelection()?.toString() ?? ``,
      r = t.document.body.textContent ?? ``,
      i = n ? r.indexOf(n) : -1,
      a = i >= 0 ? r.slice(Math.max(0, i - 120), i) : ``,
      o = i >= 0 ? r.slice(i + n.length, i + n.length + 120) : ``;
    (c({
      format: `epub`,
      anchorType: `epub-cfi`,
      anchorPayload: { cfiRange: e, quoteSnippet: n.slice(0, 160) },
      selectedText: n,
      contextBefore: a,
      contextAfter: o,
    }),
      g.current?.annotations.add(
        `highlight`,
        e,
        {},
        void 0,
        `preview-${Date.now()}`,
        { fill: `rgba(102, 149, 121, 0.32)` },
      ));
  }
  return (0, x.jsx)(`div`, {
    className: `reader-canvas reader-canvas--epub`,
    children: (0, x.jsx)(y, {
      url: t,
      location: f,
      locationChanged: (e) => {
        (p(e), l(JSON.stringify({ cfi: e })));
      },
      tocChanged: (e) => d?.(C(e)),
      getRendition: (e) => {
        g.current = e;
      },
      handleTextSelected: v,
      showToc: !1,
      searchQuery: o,
      onSearchResults: (t) => {
        let n = t.map((t, n) => ({
          id: `epub-search-${n}`,
          documentId: e,
          format: `epub`,
          title: `Match ${n + 1}`,
          excerpt: t.excerpt,
          positionPayloadJson: JSON.stringify({ cfi: t.cfi }),
          metadataJson: JSON.stringify({ cfi: t.cfi }),
        }));
        (h(n), u?.(n));
      },
    }),
  });
}
function T(e) {
  return f.sanitize(l.parse(e));
}
function E(e, t) {
  if (t === `txt`)
    return e
      .split(/\n\s*\n/)
      .map((e) => e.trim())
      .filter(Boolean)
      .map((e, t) => ({
        id: `block-${t + 1}`,
        kind: `paragraph`,
        text: e,
        html: `<p>${e.replace(/\n/g, `<br />`)}</p>`,
      }));
  let n = l.lexer(e),
    r = [];
  return (
    n.forEach((e, t) => {
      if (e.type === `heading`) {
        r.push({
          id: `block-${t + 1}`,
          kind: `heading`,
          depth: e.depth,
          text: e.text,
          html: T(e.raw),
        });
        return;
      }
      if (e.type === `paragraph`) {
        r.push({
          id: `block-${t + 1}`,
          kind: `paragraph`,
          text: e.text,
          html: T(e.raw),
        });
        return;
      }
      if (e.type === `code`) {
        r.push({
          id: `block-${t + 1}`,
          kind: `code`,
          text: e.text,
          html: `<pre><code>${f.sanitize(e.text)}</code></pre>`,
        });
        return;
      }
      if (e.type === `blockquote`) {
        let n = (e.tokens ?? [])
          .map((e) => (`text` in e ? e.text : ``))
          .join(` `);
        r.push({
          id: `block-${t + 1}`,
          kind: `quote`,
          text: n,
          html: T(e.raw),
        });
        return;
      }
      e.type === `list` &&
        e.items.forEach((e, n) => {
          r.push({
            id: `block-${t + 1}-${n + 1}`,
            kind: `list-item`,
            text: e.text,
            html: T(e.raw),
          });
        });
    }),
    r
  );
}
function D(e, t, n, r) {
  let i = r.trim().toLowerCase();
  return i
    ? e.flatMap((e, r) => {
        let a = e.text.toLowerCase(),
          o = [],
          s = 0,
          c = 0;
        for (; s < a.length; ) {
          let l = a.indexOf(i, s);
          if (l === -1) break;
          c += 1;
          let u = l + i.length;
          (o.push({
            id: `${e.id}-search-${c}`,
            documentId: t,
            format: n,
            title: `Block ${r + 1}`,
            excerpt: e.text.slice(
              Math.max(0, l - 24),
              Math.min(e.text.length, u + 48),
            ),
            positionPayloadJson: JSON.stringify({ blockId: e.id }),
            metadataJson: JSON.stringify({
              blockId: e.id,
              startOffset: l,
              endOffset: u,
            }),
          }),
            (s = l + i.length));
        }
        return o;
      })
    : [];
}
function O(e, t, n = [], r) {
  let i = [
    ...t.map((e) => ({
      startOffset: e.startOffset,
      endOffset: e.endOffset,
      color: e.color,
    })),
    ...n.map((e) => {
      let t = JSON.parse(e.metadataJson ?? `{}`);
      return {
        startOffset: t.startOffset ?? 0,
        endOffset: t.endOffset ?? 0,
        color: null,
        searchResultId: e.id,
      };
    }),
  ].filter((e) => e.endOffset > e.startOffset);
  if (i.length === 0)
    return [
      {
        text: e,
        highlighted: !1,
        color: null,
        searchHit: !1,
        activeSearchHit: !1,
      },
    ];
  let a = new Set([0, e.length]);
  i.forEach((t) => {
    (a.add(Math.max(0, Math.min(e.length, t.startOffset))),
      a.add(Math.max(0, Math.min(e.length, t.endOffset))));
  });
  let o = [...a].sort((e, t) => e - t),
    s = [];
  for (let t = 0; t < o.length - 1; t += 1) {
    let n = o[t],
      a = o[t + 1];
    if (a <= n) continue;
    let c = i.find(
        (e) => !e.searchResultId && e.startOffset <= n && e.endOffset >= a,
      ),
      l = i.filter(
        (e) => e.searchResultId && e.startOffset <= n && e.endOffset >= a,
      );
    s.push({
      text: e.slice(n, a),
      highlighted: !!c,
      color: c?.color ?? null,
      searchHit: l.length > 0,
      activeSearchHit: l.some((e) => e.searchResultId === r),
    });
  }
  return s;
}
function k(e) {
  try {
    return { ...JSON.parse(e.anchorPayloadJson), color: e.color };
  } catch {
    return null;
  }
}
function A(e) {
  return e
    .filter((e) => e.kind === `heading`)
    .map((e) => ({ id: e.id, href: e.id, label: e.text, depth: e.depth }));
}
function j({
  documentId: e,
  format: t,
  content: n,
  annotations: r,
  initialPositionPayloadJson: i,
  activeAnnotationId: a,
  focusedPositionPayloadJson: o,
  searchQuery: s,
  activeSearchResultId: c,
  onSelectionDraft: l,
  onPositionChange: u,
  onSearchResultsChange: d,
  onTableOfContentsChange: f,
}) {
  let p = (0, b.useMemo)(() => E(n ?? ``, t), [n, t]),
    m = (0, b.useRef)(null),
    h = (0, b.useMemo)(() => D(p, e, t, s ?? ``), [p, e, t, s]),
    g = (0, b.useMemo)(
      () =>
        r.reduce((e, t) => {
          let n = k(t);
          return n
            ? ((e[n.blockId] ??= []),
              e[n.blockId]?.push({
                id: t.id,
                blockId: n.blockId,
                startOffset: n.startOffset,
                endOffset: n.endOffset,
                quoteSnippet: n.quoteSnippet,
                color: n.color,
              }),
              e)
            : e;
        }, {}),
      [r],
    ),
    _ = (0, b.useMemo)(
      () =>
        h.reduce((e, t) => {
          let n = JSON.parse(t.metadataJson ?? `{}`);
          return n.blockId
            ? ((e[n.blockId] ??= []), e[n.blockId]?.push(t), e)
            : e;
        }, {}),
      [h],
    );
  ((0, b.useEffect)(() => {
    f?.(A(p));
  }, [p, f]),
    (0, b.useEffect)(() => {
      d?.(h);
    }, [d, h]),
    (0, b.useEffect)(() => {
      if (!(!i || !m.current))
        try {
          let e = JSON.parse(i);
          e.blockId &&
            document
              .getElementById(e.blockId)
              ?.scrollIntoView({ block: `center` });
        } catch {}
    }, [i]),
    (0, b.useEffect)(() => {
      if (o)
        try {
          let e = JSON.parse(o);
          e.blockId &&
            document
              .getElementById(e.blockId)
              ?.scrollIntoView({ block: `center`, behavior: `smooth` });
        } catch {}
    }, [o]),
    (0, b.useEffect)(() => {
      if (!a) return;
      let e = r.find((e) => e.id === a),
        t = e ? k(e) : null;
      t?.blockId &&
        document
          .getElementById(t.blockId)
          ?.scrollIntoView({ block: `center`, behavior: `smooth` });
    }, [a, r]),
    (0, b.useEffect)(() => {
      if (!c) return;
      let e = h.find((e) => e.id === c);
      if (e)
        try {
          let t = JSON.parse(e.metadataJson ?? `{}`);
          t.blockId &&
            document
              .getElementById(t.blockId)
              ?.scrollIntoView({ block: `center`, behavior: `smooth` });
        } catch {}
    }, [c, h]));
  function v() {
    let e = window.getSelection();
    if (!e || e.isCollapsed || e.rangeCount === 0) return;
    let n = e.getRangeAt(0),
      r =
        (n.startContainer instanceof HTMLElement
          ? n.startContainer
          : n.startContainer?.parentElement) ?? null,
      i =
        (n.endContainer instanceof HTMLElement
          ? n.endContainer
          : n.endContainer?.parentElement) ?? null,
      a = r?.closest(`[data-block-id]`),
      o = i?.closest(`[data-block-id]`);
    if (!a) return;
    let s = a.dataset.blockId,
      c = p.find((e) => e.id === s);
    if (!c || !s) return;
    let d = document.createRange();
    (d.selectNodeContents(a), d.setEnd(n.startContainer, n.startOffset));
    let f = d.toString().length,
      m = document.createRange();
    (m.selectNodeContents(a),
      o && o.dataset.blockId === s
        ? m.setEnd(n.endContainer, n.endOffset)
        : m.setEnd(a, a.childNodes.length));
    let h = m.toString().length,
      g = m.toString().slice(f, h);
    if (!g.trim()) return;
    (l({
      format: t,
      anchorType: `text-range`,
      anchorPayload: {
        blockId: s,
        startOffset: f,
        endOffset: h,
        quoteSnippet: g.slice(0, 160),
      },
      selectedText: g,
      contextBefore: c.text.slice(Math.max(0, f - 120), f),
      contextAfter: c.text.slice(h, h + 120),
    }),
      u(JSON.stringify({ blockId: s })));
  }
  return (0, x.jsx)(`div`, {
    className: `reader-canvas reader-canvas--text`,
    ref: m,
    onMouseUp: v,
    children: p.map((e) => {
      let t = O(e.text, g[e.id] ?? [], _[e.id] ?? [], c);
      return (0, x.jsx)(
        `section`,
        {
          id: e.id,
          "data-block-id": e.id,
          className: `text-block text-block--${e.kind}`,
          children: t.map((t, n) =>
            (0, x.jsx)(
              `span`,
              {
                className: [
                  t.highlighted
                    ? `text-highlight text-highlight--${t.color}`
                    : ``,
                  t.searchHit ? `text-search-hit` : ``,
                  t.activeSearchHit ? `text-search-hit--active` : ``,
                ]
                  .filter(Boolean)
                  .join(` `),
                children: t.text,
              },
              `${e.id}-${n}`,
            ),
          ),
        },
        e.id,
      );
    }),
  });
}
var M = [`amber`, `sage`, `sky`, `rose`],
  N = (0, b.lazy)(async () => ({
    default: (
      await g(
        () => import(`./PdfReaderSurface-4aww6_Ip.js`),
        __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8]),
        import.meta.url,
      )
    ).PdfReaderSurface,
  }));
function ne(e, t) {
  return e === `pdf`
    ? (0, x.jsx)(b.Suspense, {
        fallback: (0, x.jsx)(`div`, {
          className: `surface-card`,
          children: `正在加载 PDF 阅读器…`,
        }),
        children: (0, x.jsx)(N, { ...t }),
      })
    : e === `epub`
      ? (0, x.jsx)(w, { ...t })
      : (0, x.jsx)(j, { ...t, format: e });
}
function re(e) {
  return e.note || e.selectedText.slice(0, 120);
}
function ie(e) {
  return e === `text-layer-detected`
    ? `检测到文本层 PDF`
    : e === `likely-scanned`
      ? `疑似扫描版 PDF`
      : `暂时无法判断 PDF 类型`;
}
function ae(e) {
  return e === `queued`
    ? `排队中`
    : e === `running`
      ? `运行中`
      : e === `completed`
        ? `已完成`
        : e === `failed`
          ? `失败`
          : `暂不可用`;
}
function P(e) {
  try {
    return JSON.parse(e);
  } catch {
    return null;
  }
}
function oe(e, t) {
  let n = t ? P(t) : null;
  return n
    ? e === `pdf` && typeof n.page == `number`
      ? `PDF 第 ${n.page + 1} 页`
      : e === `epub` && typeof n.cfi == `string`
        ? `EPUB 当前位置`
        : (e === `txt` || e === `md`) && typeof n.blockId == `string`
          ? `文本位置 ${n.blockId}`
          : `未命名书签`
    : `未命名书签`;
}
function se(e) {
  return P(e.anchorPayloadJson) ?? {};
}
function F() {
  let { documentId: e } = h(),
    [t] = m(),
    n = _(),
    [f, g] = (0, b.useState)(0),
    [y, S] = (0, b.useState)(null),
    [C, w] = (0, b.useState)(null),
    [T, E] = (0, b.useState)(``),
    [D, O] = (0, b.useState)(`amber`),
    [k, A] = (0, b.useState)(null),
    [j, N] = (0, b.useState)([]),
    [P, F] = (0, b.useState)(``),
    [I, ce] = (0, b.useState)(null),
    [le, L] = (0, b.useState)(null),
    [R, ue] = (0, b.useState)(``),
    [z, de] = (0, b.useState)([]),
    [B, V] = (0, b.useState)(null),
    [H, U] = (0, b.useState)(null),
    [fe, W] = (0, b.useState)(null),
    [G, K] = (0, b.useState)(``),
    [q, J] = (0, b.useState)(`amber`),
    Y = (0, b.useRef)(null),
    {
      value: X,
      loading: pe,
      error: Z,
    } = ee(() => n.documents.open(e ?? ``), [n, e, f]),
    me = (0, b.useMemo)(
      () =>
        (X?.aiCards ?? []).map((e) => ({
          ...e,
          html: l.parse(e.bodyMarkdown),
        })),
      [X?.aiCards],
    );
  ((0, b.useEffect)(() => {
    let e = !1;
    return (
      Promise.resolve().then(() => {
        e ||
          (S(null),
          w(null),
          E(``),
          N(X?.tableOfContents ?? []),
          ce(X?.readingPosition?.positionPayloadJson ?? null));
      }),
      () => {
        e = !0;
      }
    );
  }, [X]),
    (0, b.useEffect)(() => {
      let e = t.get(`annotationId`),
        n = t.get(`aiCardId`),
        r = t.get(`position`),
        i = !1;
      return (
        Promise.resolve().then(() => {
          if (!i) {
            if ((L(r), e)) {
              A(e);
              return;
            }
            if (n && X) {
              let e = X.aiCards.find((e) => e.id === n);
              if (e?.annotationId) {
                A(e.annotationId);
                return;
              }
            }
            A(null);
          }
        }),
        () => {
          i = !0;
        }
      );
    }, [X, t]));
  let Q = (0, b.useCallback)(
    (e) => {
      if (!X) return;
      let t =
        e?.positionPayloadJson ?? I ?? X.readingPosition?.positionPayloadJson;
      if (!t) {
        F(`当前位置还没有可保存的定位信息。`);
        return;
      }
      (U({
        id: e?.id,
        title: e?.title ?? oe(X.document.format, t),
        note: e?.note ?? ``,
      }),
        L(t));
    },
    [I, X],
  );
  if (
    ((0, b.useEffect)(() => {
      function e(e) {
        if (!X) return;
        let t = e.ctrlKey || e.metaKey;
        (t &&
          e.key.toLowerCase() === `f` &&
          (e.preventDefault(), Y.current?.focus()),
          t && e.key.toLowerCase() === `b` && (e.preventDefault(), Q()),
          e.key === `Escape` &&
            (document.activeElement === Y.current
              ? Y.current?.blur()
              : y && (S(null), w(null))));
      }
      return (
        window.addEventListener(`keydown`, e),
        () => window.removeEventListener(`keydown`, e)
      );
    }, [Q, X, y]),
    !e)
  )
    return (0, x.jsx)(`p`, {
      className: `surface-card surface-card--error`,
      children: `缺少文档 ID。`,
    });
  async function he(e) {
    X &&
      (ce(e),
      await n.reader.savePosition({
        documentId: X.document.id,
        format: X.document.format,
        positionPayloadJson: e,
      }));
  }
  async function ge() {
    if (!X || !y) return null;
    let e = await n.annotations.upsert({
      id: C ?? void 0,
      documentId: X.document.id,
      format: y.format,
      anchorType: y.anchorType,
      anchorPayload: y.anchorPayload,
      selectedText: y.selectedText,
      color: D,
      note: T,
    });
    return (w(e.id), e);
  }
  async function _e() {
    (await ge()) && (F(`高亮与批注已保存。`), g((e) => e + 1));
  }
  async function ve(e) {
    (await n.annotations.delete(e), F(`批注已删除。`), g((e) => e + 1));
  }
  async function $(e) {
    if (!(!X || !y))
      try {
        let t = await ge();
        if (!t) return;
        (await n.ai.interpretSelection({
          documentId: X.document.id,
          annotationId: t.id,
          actionType: e,
          documentTitle: X.document.title,
          format: X.document.format,
          selectionText: y.selectedText,
          contextBefore: y.contextBefore,
          contextAfter: y.contextAfter,
        }),
          F(`AI 卡片已生成。`),
          g((e) => e + 1));
      } catch (e) {
        let t = e instanceof Error ? e.message : ``;
        F(
          /Failed to parse URL|Invalid URL/i.test(t)
            ? `Base URL 无效，请检查协议与地址格式。`
            : /fetch failed|NetworkError|network/i.test(t)
              ? `网络连接失败，请检查网络或服务可达性。`
              : /AI provider returned (\d+)/i.test(t)
                ? `AI 服务返回 ${t.match(/AI provider returned (\d+)/i)?.[1]}，请检查 API Key、Base URL 或配额。`
                : t || `AI 解读失败。`,
        );
      }
  }
  async function ye() {
    if (X)
      try {
        (F(
          (await n.ocr.start(X.document.id)).status === `unavailable`
            ? `当前构建未接入 OCR 引擎，OCR 暂不可用。`
            : `OCR 任务已创建。`,
        ),
          g((e) => e + 1));
      } catch (e) {
        F(e instanceof Error ? e.message : `OCR 启动失败。`);
      }
  }
  function be(e) {
    document
      .getElementById(e)
      ?.scrollIntoView({ behavior: `smooth`, block: `center` });
  }
  async function xe() {
    if (!X || !H) return;
    let e = le ?? I ?? X.readingPosition?.positionPayloadJson;
    if (!e) {
      F(`当前位置还没有可保存的定位信息。`);
      return;
    }
    (await n.bookmarks.upsert({
      id: H.id,
      documentId: X.document.id,
      format: X.document.format,
      positionPayloadJson: e,
      title: H.title,
      note: H.note,
    }),
      U(null),
      F(`书签已保存。`),
      g((e) => e + 1));
  }
  async function Se(e) {
    (await n.bookmarks.delete(e), F(`书签已删除。`), g((e) => e + 1));
  }
  function Ce(e) {
    (L(e.positionPayloadJson), V(null));
  }
  function we(e) {
    (W(e.id), K(e.note), J(e.color));
  }
  async function Te(e) {
    (await n.annotations.upsert({
      id: e.id,
      documentId: e.documentId,
      format: e.format,
      anchorType: e.anchorType,
      anchorPayload: se(e),
      selectedText: e.selectedText,
      color: q,
      note: G,
    }),
      W(null),
      F(`批注已更新。`),
      g((e) => e + 1));
  }
  return (0, x.jsxs)(`section`, {
    className: `page-stack`,
    children: [
      pe
        ? (0, x.jsx)(`p`, {
            className: `surface-card`,
            children: `正在打开文档…`,
          })
        : null,
      Z
        ? (0, x.jsx)(`p`, {
            className: `surface-card surface-card--error`,
            children: Z,
          })
        : null,
      X
        ? (0, x.jsxs)(x.Fragment, {
            children: [
              (0, x.jsxs)(`header`, {
                className: `page-hero`,
                children: [
                  (0, x.jsxs)(`div`, {
                    children: [
                      (0, x.jsx)(`p`, {
                        className: `eyebrow`,
                        children: `文档阅读器`,
                      }),
                      (0, x.jsx)(`h1`, { children: X.document.title }),
                      (0, x.jsxs)(`p`, {
                        className: `page-copy`,
                        children: [
                          te(X.document.format),
                          ` · 最近打开 `,
                          v(X.document.lastOpenedAt),
                        ],
                      }),
                    ],
                  }),
                  P
                    ? (0, x.jsx)(`div`, { className: `pill`, children: P })
                    : null,
                ],
              }),
              (0, x.jsxs)(`div`, {
                className: `reader-layout`,
                children: [
                  (0, x.jsxs)(`aside`, {
                    className: `surface-card reader-sidebar`,
                    children: [
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `资料概览`,
                          }),
                          (0, x.jsx)(`strong`, {
                            children: X.document.originalName,
                          }),
                          (0, x.jsx)(`span`, {
                            children: X.document.managedPath,
                          }),
                        ],
                      }),
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `搜索`,
                          }),
                          (0, x.jsxs)(`div`, {
                            className: `field-with-icon`,
                            children: [
                              (0, x.jsx)(u, { size: 16 }),
                              (0, x.jsx)(`input`, {
                                ref: Y,
                                "aria-label": `搜索当前文档`,
                                value: R,
                                onChange: (e) => {
                                  (ue(e.target.value), V(null));
                                },
                              }),
                            ],
                          }),
                          (0, x.jsxs)(`div`, {
                            className: `stack-list`,
                            children: [
                              z.map((e) =>
                                (0, x.jsxs)(
                                  `button`,
                                  {
                                    className: `annotation-jump ${B === e.id ? `annotation-card--active` : ``}`,
                                    type: `button`,
                                    onClick: () => V(e.id),
                                    children: [
                                      (0, x.jsx)(`strong`, {
                                        children: e.excerpt,
                                      }),
                                      (0, x.jsx)(`span`, { children: e.title }),
                                    ],
                                  },
                                  e.id,
                                ),
                              ),
                              R && z.length === 0
                                ? (0, x.jsx)(`p`, {
                                    children: `当前没有匹配结果。`,
                                  })
                                : null,
                            ],
                          }),
                        ],
                      }),
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsxs)(`div`, {
                            className: `section-heading`,
                            children: [
                              (0, x.jsxs)(`div`, {
                                children: [
                                  (0, x.jsx)(`p`, {
                                    className: `eyebrow`,
                                    children: `书签`,
                                  }),
                                  (0, x.jsx)(`h2`, { children: `研究锚点` }),
                                ],
                              }),
                              (0, x.jsxs)(`button`, {
                                className: `secondary-button`,
                                type: `button`,
                                onClick: () => Q(),
                                children: [
                                  (0, x.jsx)(r, { size: 16 }),
                                  `添加书签`,
                                ],
                              }),
                            ],
                          }),
                          H
                            ? (0, x.jsxs)(`div`, {
                                className: `selection-card`,
                                children: [
                                  (0, x.jsxs)(`label`, {
                                    className: `field`,
                                    children: [
                                      (0, x.jsx)(`span`, {
                                        children: `书签标题`,
                                      }),
                                      (0, x.jsx)(`input`, {
                                        "aria-label": `书签标题`,
                                        value: H.title,
                                        onChange: (e) =>
                                          U(
                                            (t) =>
                                              t && {
                                                ...t,
                                                title: e.target.value,
                                              },
                                          ),
                                      }),
                                    ],
                                  }),
                                  (0, x.jsxs)(`label`, {
                                    className: `field`,
                                    children: [
                                      (0, x.jsx)(`span`, {
                                        children: `书签备注`,
                                      }),
                                      (0, x.jsx)(`textarea`, {
                                        "aria-label": `书签备注`,
                                        className: `note-input`,
                                        value: H.note,
                                        onChange: (e) =>
                                          U(
                                            (t) =>
                                              t && {
                                                ...t,
                                                note: e.target.value,
                                              },
                                          ),
                                      }),
                                    ],
                                  }),
                                  (0, x.jsxs)(`div`, {
                                    className: `selection-actions`,
                                    children: [
                                      (0, x.jsx)(`button`, {
                                        className: `primary-button`,
                                        type: `button`,
                                        onClick: xe,
                                        children: `保存书签`,
                                      }),
                                      (0, x.jsx)(`button`, {
                                        className: `secondary-button`,
                                        type: `button`,
                                        onClick: () => U(null),
                                        children: `取消`,
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : null,
                          (0, x.jsxs)(`div`, {
                            className: `stack-list`,
                            children: [
                              X.bookmarks.map((e) =>
                                (0, x.jsxs)(
                                  `article`,
                                  {
                                    className: `annotation-card`,
                                    children: [
                                      (0, x.jsxs)(`button`, {
                                        type: `button`,
                                        className: `annotation-jump`,
                                        onClick: () => Ce(e),
                                        children: [
                                          (0, x.jsx)(`strong`, {
                                            children: e.title,
                                          }),
                                          (0, x.jsx)(`span`, {
                                            children: e.note || `无备注`,
                                          }),
                                        ],
                                      }),
                                      (0, x.jsxs)(`div`, {
                                        className: `document-row__actions`,
                                        children: [
                                          (0, x.jsx)(`button`, {
                                            className: `icon-button`,
                                            type: `button`,
                                            "aria-label": `编辑书签 ${e.title}`,
                                            onClick: () => Q(e),
                                            children: (0, x.jsx)(c, {
                                              size: 14,
                                            }),
                                          }),
                                          (0, x.jsx)(`button`, {
                                            className: `icon-button`,
                                            type: `button`,
                                            "aria-label": `删除书签 ${e.title}`,
                                            onClick: () => Se(e.id),
                                            children: (0, x.jsx)(d, {
                                              size: 14,
                                            }),
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  e.id,
                                ),
                              ),
                              X.bookmarks.length === 0
                                ? (0, x.jsx)(`p`, {
                                    children: `还没有书签。可以在任意位置留下研究锚点。`,
                                  })
                                : null,
                            ],
                          }),
                        ],
                      }),
                      X.document.format === `pdf`
                        ? (0, x.jsxs)(`div`, {
                            className: `reader-sidebar__section`,
                            children: [
                              (0, x.jsx)(`p`, {
                                className: `eyebrow`,
                                children: `PDF 原生分析`,
                              }),
                              X.pdfInspection
                                ? (0, x.jsxs)(x.Fragment, {
                                    children: [
                                      (0, x.jsx)(`strong`, {
                                        children: ie(
                                          X.pdfInspection.classification,
                                        ),
                                      }),
                                      (0, x.jsx)(`p`, {
                                        children: X.pdfInspection.summary,
                                      }),
                                      (0, x.jsx)(`span`, {
                                        children: X.pdfInspection
                                          .supportsSelectionLikely
                                          ? `大概率可直接做文本选择与高亮`
                                          : `可能需要 OCR 或图像型 PDF 专项处理`,
                                      }),
                                      X.pdfInspection.classification ===
                                      `likely-scanned`
                                        ? (0, x.jsx)(`div`, {
                                            className: `selection-actions`,
                                            children: (0, x.jsxs)(`button`, {
                                              className: `secondary-button`,
                                              type: `button`,
                                              onClick: ye,
                                              children: [
                                                (0, x.jsx)(s, { size: 16 }),
                                                `开始 OCR`,
                                              ],
                                            }),
                                          })
                                        : null,
                                      X.ocrJob
                                        ? (0, x.jsxs)(`div`, {
                                            className: `selection-card`,
                                            children: [
                                              (0, x.jsx)(`strong`, {
                                                children: `最近 OCR`,
                                              }),
                                              (0, x.jsx)(`p`, {
                                                children: ae(X.ocrJob.status),
                                              }),
                                              (0, x.jsx)(`p`, {
                                                children:
                                                  X.ocrJob.resultMessage,
                                              }),
                                            ],
                                          })
                                        : null,
                                    ],
                                  })
                                : (0, x.jsxs)(`div`, {
                                    className: `selection-card`,
                                    children: [
                                      (0, x.jsx)(`strong`, {
                                        children: `当前构建未接入 OCR 引擎`,
                                      }),
                                      (0, x.jsx)(`p`, {
                                        children:
                                          `这份 PDF 仍然可以继续阅读，但当前版本还不能提供原生 PDF 分析或 OCR。`,
                                      }),
                                      (0, x.jsx)(`p`, {
                                        children: `OCR 暂不可用。`,
                                      }),
                                    ],
                                  }),
                            ],
                          })
                        : null,
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `文档目录`,
                          }),
                          j.length > 0
                            ? (0, x.jsx)(`div`, {
                                className: `toc-list`,
                                children: j.map((e) =>
                                  (0, x.jsx)(
                                    `button`,
                                    {
                                      className: `toc-item`,
                                      style: {
                                        paddingLeft: `${(e.depth ?? 1) * 12}px`,
                                      },
                                      type: `button`,
                                      onClick: () => be(e.href),
                                      children: e.label,
                                    },
                                    e.id,
                                  ),
                                ),
                              })
                            : (0, x.jsx)(`p`, {
                                children: `当前格式还没有可显示的目录。`,
                              }),
                        ],
                      }),
                    ],
                  }),
                  (0, x.jsx)(`div`, {
                    className: `reader-main`,
                    children: ne(X.document.format, {
                      documentId: X.document.id,
                      sourceUrl: X.sourceUrl,
                      content: X.content,
                      annotations: X.annotations,
                      initialPositionPayloadJson:
                        X.readingPosition?.positionPayloadJson ?? null,
                      activeAnnotationId: k,
                      focusedPositionPayloadJson: le,
                      searchQuery: R,
                      activeSearchResultId: B,
                      onSelectionDraft: (e) => {
                        (S(e), w(null));
                      },
                      onPositionChange: he,
                      onSearchResultsChange: de,
                      onTableOfContentsChange: N,
                    }),
                  }),
                  (0, x.jsxs)(`aside`, {
                    className: `surface-card reader-sidebar reader-sidebar--right`,
                    children: [
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `当前选段`,
                          }),
                          y
                            ? (0, x.jsxs)(x.Fragment, {
                                children: [
                                  (0, x.jsx)(`div`, {
                                    className: `selection-card`,
                                    children: (0, x.jsx)(`p`, {
                                      children: y.selectedText,
                                    }),
                                  }),
                                  (0, x.jsx)(`div`, {
                                    className: `color-row`,
                                    children: M.map((e) =>
                                      (0, x.jsx)(
                                        `button`,
                                        {
                                          type: `button`,
                                          className: `color-swatch color-swatch--${e} ${D === e ? `color-swatch--active` : ``}`,
                                          onClick: () => O(e),
                                        },
                                        e,
                                      ),
                                    ),
                                  }),
                                  (0, x.jsx)(`textarea`, {
                                    className: `note-input`,
                                    placeholder: `给这段写点自己的注释`,
                                    value: T,
                                    onChange: (e) => E(e.target.value),
                                  }),
                                  (0, x.jsxs)(`div`, {
                                    className: `selection-actions`,
                                    children: [
                                      (0, x.jsxs)(`button`, {
                                        className: `primary-button`,
                                        type: `button`,
                                        onClick: _e,
                                        children: [
                                          (0, x.jsx)(o, { size: 16 }),
                                          `保存高亮`,
                                        ],
                                      }),
                                      (0, x.jsxs)(`button`, {
                                        className: `secondary-button`,
                                        type: `button`,
                                        onClick: () => $(`explain`),
                                        children: [
                                          (0, x.jsx)(s, { size: 16 }),
                                          `解释`,
                                        ],
                                      }),
                                      (0, x.jsxs)(`button`, {
                                        className: `secondary-button`,
                                        type: `button`,
                                        onClick: () => $(`summarize`),
                                        children: [
                                          (0, x.jsx)(p, { size: 16 }),
                                          `总结`,
                                        ],
                                      }),
                                      (0, x.jsxs)(`button`, {
                                        className: `secondary-button`,
                                        type: `button`,
                                        onClick: () => $(`translate`),
                                        children: [
                                          (0, x.jsx)(a, { size: 16 }),
                                          `翻译`,
                                        ],
                                      }),
                                      (0, x.jsxs)(`button`, {
                                        className: `secondary-button`,
                                        type: `button`,
                                        onClick: () => $(`extract_terms`),
                                        children: [
                                          (0, x.jsx)(s, { size: 16 }),
                                          `术语提取`,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : (0, x.jsx)(`p`, {
                                children: `在正文里选中一段文字，这里就会出现保存高亮和 AI 解读入口。`,
                              }),
                        ],
                      }),
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `批注回看`,
                          }),
                          (0, x.jsxs)(`div`, {
                            className: `stack-list`,
                            children: [
                              X.annotations.map((e) =>
                                (0, x.jsxs)(
                                  `article`,
                                  {
                                    className: `annotation-card annotation-card--${e.color} ${k === e.id ? `annotation-card--active` : ``}`,
                                    children: [
                                      (0, x.jsxs)(`button`, {
                                        type: `button`,
                                        className: `annotation-jump`,
                                        onClick: () => A(e.id),
                                        children: [
                                          (0, x.jsx)(`strong`, {
                                            children: re(e),
                                          }),
                                          (0, x.jsx)(`span`, {
                                            children: e.selectedText.slice(
                                              0,
                                              72,
                                            ),
                                          }),
                                        ],
                                      }),
                                      (0, x.jsxs)(`div`, {
                                        className: `document-row__actions`,
                                        children: [
                                          (0, x.jsx)(`button`, {
                                            className: `icon-button`,
                                            type: `button`,
                                            "aria-label": `编辑批注`,
                                            onClick: () => we(e),
                                            children: (0, x.jsx)(c, {
                                              size: 14,
                                            }),
                                          }),
                                          (0, x.jsx)(`button`, {
                                            "aria-label": `删除批注`,
                                            className: `icon-button`,
                                            type: `button`,
                                            onClick: () => ve(e.id),
                                            children: (0, x.jsx)(d, {
                                              size: 14,
                                            }),
                                          }),
                                        ],
                                      }),
                                      fe === e.id
                                        ? (0, x.jsxs)(`div`, {
                                            className: `selection-card`,
                                            children: [
                                              (0, x.jsx)(`div`, {
                                                className: `color-row`,
                                                children: M.map((e) =>
                                                  (0, x.jsx)(
                                                    `button`,
                                                    {
                                                      type: `button`,
                                                      className: `color-swatch color-swatch--${e} ${q === e ? `color-swatch--active` : ``}`,
                                                      onClick: () => J(e),
                                                    },
                                                    e,
                                                  ),
                                                ),
                                              }),
                                              (0, x.jsxs)(`label`, {
                                                className: `field`,
                                                children: [
                                                  (0, x.jsx)(`span`, {
                                                    children: `编辑批注备注`,
                                                  }),
                                                  (0, x.jsx)(`textarea`, {
                                                    "aria-label": `编辑批注备注`,
                                                    className: `note-input`,
                                                    value: G,
                                                    onChange: (e) =>
                                                      K(e.target.value),
                                                  }),
                                                ],
                                              }),
                                              (0, x.jsxs)(`div`, {
                                                className: `selection-actions`,
                                                children: [
                                                  (0, x.jsx)(`button`, {
                                                    className: `primary-button`,
                                                    type: `button`,
                                                    onClick: () => Te(e),
                                                    children: `保存批注编辑`,
                                                  }),
                                                  (0, x.jsx)(`button`, {
                                                    className: `secondary-button`,
                                                    type: `button`,
                                                    onClick: () => W(null),
                                                    children: `取消`,
                                                  }),
                                                ],
                                              }),
                                            ],
                                          })
                                        : null,
                                    ],
                                  },
                                  e.id,
                                ),
                              ),
                              X.annotations.length === 0
                                ? (0, x.jsx)(`p`, {
                                    children: `还没有批注。先划第一段重点吧。`,
                                  })
                                : null,
                            ],
                          }),
                        ],
                      }),
                      (0, x.jsxs)(`div`, {
                        className: `reader-sidebar__section`,
                        children: [
                          (0, x.jsx)(`p`, {
                            className: `eyebrow`,
                            children: `AI 卡片`,
                          }),
                          (0, x.jsxs)(`div`, {
                            className: `stack-list`,
                            children: [
                              me.map((e) =>
                                (0, x.jsxs)(
                                  `article`,
                                  {
                                    className: `ai-card`,
                                    children: [
                                      (0, x.jsx)(`strong`, {
                                        children: e.title,
                                      }),
                                      (0, x.jsx)(`div`, {
                                        dangerouslySetInnerHTML: {
                                          __html: e.html,
                                        },
                                      }),
                                      e.annotationId
                                        ? (0, x.jsx)(`button`, {
                                            type: `button`,
                                            className: `secondary-button`,
                                            onClick: () =>
                                              A(e.annotationId ?? null),
                                            children: `跳回原文`,
                                          })
                                        : null,
                                    ],
                                  },
                                  e.id,
                                ),
                              ),
                              me.length === 0
                                ? (0, x.jsx)(`p`, {
                                    children: `配置好 AI 服务后，解释、总结、翻译和术语提取生成的卡片会出现在这里；若暂未配置，点击动作时会给出明确提示。`,
                                  })
                                : null,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        : null,
      !pe && !Z && !X
        ? (0, x.jsxs)(`div`, {
            className: `surface-card surface-card--error reader-empty`,
            children: [
              (0, x.jsx)(i, { size: 18 }),
              (0, x.jsx)(`span`, { children: `没有找到这份文档。` }),
            ],
          })
        : null,
    ],
  });
}
export { F as ReaderPage };
