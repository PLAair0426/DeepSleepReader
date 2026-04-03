import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import { t as r } from "./pdf-core-tMfnKj7m.js";
import { n as i, t as a } from "./pdf-layout-RtW6j4T2.js";
import { t as o } from "./pdf-reader-D0iQQ3Q4.js";
import { t as s } from "./pdfjs-runtime-CKdDv9cO.js";
var c = e(t(), 1),
  l = r(),
  u = a(),
  d = o(),
  f = i(),
  p = n();
function m(e) {
  try {
    return JSON.parse(e.anchorPayloadJson);
  } catch {
    return null;
  }
}
function h(e, t) {
  return t.map((t, n) => ({
    id: `pdf-search-${n}`,
    documentId: e,
    format: `pdf`,
    title: `Page ${t.pageIndex + 1}`,
    excerpt: t.pageText.slice(
      Math.max(0, t.startIndex - 24),
      Math.min(t.pageText.length, t.endIndex + 48),
    ),
    positionPayloadJson: JSON.stringify({ page: t.pageIndex }),
    metadataJson: JSON.stringify({ matchIndex: n, pageIndex: t.pageIndex }),
  }));
}
function g({
  documentId: e,
  sourceUrl: t,
  annotations: n,
  initialPositionPayloadJson: r,
  activeAnnotationId: i,
  focusedPositionPayloadJson: a,
  searchQuery: o,
  activeSearchResultId: g,
  onSelectionDraft: _,
  onPositionChange: v,
  onSearchResultsChange: y,
}) {
  let b = (0, c.useMemo)(() => {
      if (!r) return 0;
      try {
        return JSON.parse(r).page ?? 0;
      } catch {
        return 0;
      }
    }, [r]),
    [x, S] = (0, c.useState)(0),
    [C, w] = (0, c.useState)(b),
    T = (0, c.useRef)([]),
    Ee = (0, c.useRef)({
      activeAnnotationId: i,
      annotations: n,
      onSelectionDraft: _,
    });
  Ee.current = {
    activeAnnotationId: i,
    annotations: n,
    onSelectionDraft: _,
  };
  let De = (0, d.highlightPlugin)({
      trigger: d.Trigger.TextSelection,
      renderHighlightTarget: (e) =>
        (0, p.jsx)(`button`, {
          className: `selection-bubble`,
          type: `button`,
          style: {
            left: `${e.selectionRegion.left}%`,
            top: `${e.selectionRegion.top + e.selectionRegion.height}%`,
          },
          onClick: () => {
            let { onSelectionDraft: t } = Ee.current;
            (t({
              format: `pdf`,
              anchorType: `pdf-selection`,
              anchorPayload: {
                quoteSnippet: e.selectedText.slice(0, 160),
                highlightAreas: e.highlightAreas,
                selectionData: e.selectionData,
              },
              selectedText: e.selectedText,
              contextBefore: ``,
              contextAfter: ``,
            }),
              e.cancel());
          },
          children: `保存选段`,
        }),
      renderHighlights: ({
        pageIndex: e,
        rotation: t,
        getCssProperties: r,
      }) => {
        let { annotations: n, activeAnnotationId: i } = Ee.current;
        return (0, p.jsx)(p.Fragment, {
          children: n
            .map((e) => ({ annotation: e, payload: m(e) }))
            .filter((e) => !!e.payload)
            .flatMap((t) =>
              t.payload.highlightAreas
                .filter((t) => t.pageIndex === e)
                .map((e, n) => ({
                  annotationId: t.annotation.id,
                  area: e,
                  areaIndex: n,
                  color: t.annotation.color,
                })),
            )
            .map((e) =>
              (0, p.jsx)(
                `div`,
                {
                  style: r(e.area, t),
                  className: `pdf-highlight pdf-highlight--${e.color} ${i === e.annotationId ? `pdf-highlight--active` : ``}`,
                },
                `${e.annotationId}-${e.areaIndex}`,
              ),
            ),
        });
      },
    }),
    Oe = (0, c.useRef)(De),
    Fe = (0, f.searchPlugin)({ enableShortcuts: !1 }),
    Ie = (0, c.useRef)(Fe),
    Le = (0, u.defaultLayoutPlugin)(),
    Re = (0, c.useRef)(Le),
    E = Oe.current,
    D = Ie.current,
    O = Re.current;
  ((0, c.useEffect)(() => {
    w(b);
  }, [b]),
    (0, c.useEffect)(() => {
      if (a)
        try {
          (w(JSON.parse(a).page ?? 0), S((e) => e + 1));
        } catch {}
    }, [a]),
    (0, c.useEffect)(() => {
      if (!i) return;
      let e = n.find((e) => e.id === i),
        t = (e ? m(e) : null)?.highlightAreas[0];
      t && E.jumpToHighlightArea(t);
    }, [i, n, E]),
    (0, c.useEffect)(() => {
      let t = !1,
        n = o?.trim() ?? ``;
      if (!n) {
        (D.clearHighlights(), (T.current = []), y?.([]));
        return;
      }
      return (
        D.highlight(n).then((n) => {
          if (t) return;
          let r = h(e, n);
          ((T.current = r), y?.(r));
        }),
        () => {
          t = !0;
        }
      );
    }, [e, y, D, o]),
    (0, c.useEffect)(() => {
      if (!g) return;
      let e = T.current.find((e) => e.id === g);
      if (e)
        try {
          let t = JSON.parse(e.metadataJson ?? `{}`);
          typeof t.matchIndex == `number` && D.jumpToMatch(t.matchIndex);
        } catch {}
    }, [g, D]));
  function k(e) {
    v(JSON.stringify({ page: e.currentPage }));
  }
  return (0, p.jsx)(`div`, {
    className: `reader-canvas reader-canvas--pdf`,
    children: (0, p.jsx)(l.Worker, {
      workerUrl: s,
      children: (0, p.jsx)(
        l.Viewer,
        { fileUrl: t, initialPage: C, onPageChange: k, plugins: [O, E, D] },
        x,
      ),
    }),
  });
}
export { g as PdfReaderSurface };
