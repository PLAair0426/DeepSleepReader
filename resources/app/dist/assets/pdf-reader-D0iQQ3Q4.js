import { t as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t } from "./app-framework-wcgWJpPK.js";
import { t as n } from "./pdf-core-tMfnKj7m.js";
var r = e((e) => {
    var r = n();
    function i(e) {
      var t = Object.create(null);
      return (
        e &&
          Object.keys(e).forEach(function (n) {
            if (n !== `default`) {
              var r = Object.getOwnPropertyDescriptor(e, n);
              Object.defineProperty(
                t,
                n,
                r.get
                  ? r
                  : {
                      enumerable: !0,
                      get: function () {
                        return e[n];
                      },
                    },
              );
            }
          }),
        (t.default = e),
        Object.freeze(t)
      );
    }
    var a,
      o = i(t());
    (function (e) {
      ((e.NoSelection = `NoSelection`),
        (e.Selecting = `Selecting`),
        (e.Selected = `Selected`),
        (e.Selection = `Selection`),
        (e.ClickDragging = `ClickDragging`),
        (e.ClickDragged = `ClickDragged`));
    })((a ||= {}));
    var s,
      c = { height: 0, left: 0, pageIndex: -1, top: 0, width: 0 },
      l = { highlightAreas: [], selectionRegion: c, type: a.NoSelection },
      u = { highlightAreas: [], selectionRegion: c, type: a.Selecting },
      d = function (e) {
        var t = e.canvasLayerRef,
          n = e.canvasLayerRendered,
          r = e.pageIndex,
          i = e.store,
          s = e.textLayerRef,
          c = e.textLayerRendered,
          u = o.useRef(),
          d = o.useRef(document.body.style.cursor),
          f = o.useRef({ x: 0, y: 0 }),
          p = o.useRef({ top: 0, left: 0 }),
          m = function () {
            var e = u.current;
            e && e.classList.add(`rpv-highlight__click-drag--hidden`);
          },
          h = function (e) {
            var t = s.current,
              n = u.current;
            if (e.altKey && t && n && e.button === 0) {
              (e.preventDefault(), (document.body.style.cursor = `crosshair`));
              var r = t.getBoundingClientRect(),
                o = { x: e.clientX, y: e.clientY };
              f.current = o;
              var c = {
                top: (100 * (o.y - r.top)) / r.height,
                left: (100 * (o.x - r.left)) / r.width,
              };
              ((p.current = c),
                (n.style.top = `${c.top}%`),
                (n.style.left = `${c.left}%`),
                (n.style.height = `0px`),
                (n.style.width = `0px`),
                document.addEventListener(`mousemove`, g),
                document.addEventListener(`mouseup`, y),
                i.updateCurrentValue(`highlightState`, function (e) {
                  return Object.assign({}, e, { type: a.ClickDragging });
                }));
            }
          },
          g = function (e) {
            var t = s.current,
              n = u.current;
            if (t && n) {
              e.preventDefault();
              var r = e.clientX - f.current.x,
                i = e.clientY - f.current.y,
                a = t.getBoundingClientRect();
              n.classList.contains(`rpv-highlight__click-drag--hidden`) &&
                n.classList.remove(`rpv-highlight__click-drag--hidden`);
              var o = Math.min(100 - p.current.left, (100 * r) / a.width),
                c = Math.min(100 - p.current.top, (100 * i) / a.height);
              ((n.style.width = `${o}%`), (n.style.height = `${c}%`));
            }
          },
          _ = function (e) {
            e.key === `Escape` &&
              i.get(`highlightState`).type === a.ClickDragged &&
              (e.preventDefault(), m(), i.update(`highlightState`, l));
          },
          v = function (e) {
            var t = u.current;
            t &&
              i.get(`highlightState`).type === a.NoSelection &&
              e.target !== t &&
              m();
          },
          y = function (e) {
            (e.preventDefault(),
              document.removeEventListener(`mousemove`, g),
              document.removeEventListener(`mouseup`, y),
              b());
            var n = u.current,
              o = t.current;
            if (n && o) {
              var s,
                c,
                l = {
                  pageIndex: r,
                  top: parseFloat(n.style.top.slice(0, -1)),
                  left: parseFloat(n.style.left.slice(0, -1)),
                  height: parseFloat(n.style.height.slice(0, -1)),
                  width: parseFloat(n.style.width.slice(0, -1)),
                },
                d = ((s = document.createElement(`canvas`)),
                (c = window.devicePixelRatio || 1),
                function (e, t) {
                  var n = e.getBoundingClientRect(),
                    r = (t.left * n.width) / 100,
                    i = (t.top * n.height) / 100,
                    a = (t.width * n.width) / 100,
                    o = (t.height * n.height) / 100,
                    l = s.getContext(`2d`);
                  return (
                    (s.width = a),
                    (s.height = o),
                    l?.drawImage(e, r * c, i * c, a * c, o * c, 0, 0, a, o),
                    s.toDataURL(`image/png`)
                  );
                })(o, l),
                f = {
                  highlightAreas: [l],
                  previewImage: d,
                  selectionRegion: l,
                  type: a.ClickDragged,
                };
              i.update(`highlightState`, f);
            }
          },
          b = function () {
            d.current
              ? (document.body.style.cursor = d.current)
              : document.body.style.removeProperty(`cursor`);
          },
          x = function (e) {
            (e.type === a.Selection ||
              (e.type === a.ClickDragging &&
                e.selectionRegion.pageIndex !== r)) &&
              m();
          };
        return (
          o.useEffect(function () {
            return (
              i.subscribe(`highlightState`, x),
              function () {
                i.unsubscribe(`highlightState`, x);
              }
            );
          }, []),
          o.useEffect(
            function () {
              var e = t.current,
                r = s.current;
              if (n && c && e && r) {
                r.addEventListener(`mousedown`, h);
                var i = { capture: !0 };
                return (
                  document.addEventListener(`keydown`, _),
                  document.addEventListener(`click`, v, i),
                  function () {
                    (r.removeEventListener(`mousedown`, h),
                      document.removeEventListener(`click`, v, i),
                      document.removeEventListener(`keydown`, _));
                  }
                );
              }
            },
            [c],
          ),
          o.createElement(`div`, {
            ref: u,
            className: `rpv-highlight__click-drag rpv-highlight__click-drag--hidden`,
          })
        );
      },
      f = `data-highlight-text-layer`,
      p = `data-highlight-text-page`,
      m = function (e) {
        return e >= 0 ? e : 360 + e;
      },
      h = function (e, t) {
        switch (m(t)) {
          case 90:
            return {
              height: `${e.width}%`,
              position: `absolute`,
              right: `${e.top}%`,
              top: `${e.left}%`,
              width: `${e.height}%`,
            };
          case 180:
            return {
              bottom: `${e.top}%`,
              height: `${e.height}%`,
              position: `absolute`,
              right: `${e.left}%`,
              width: `${e.width}%`,
            };
          case 270:
            return {
              height: `${e.width}%`,
              position: `absolute`,
              left: `${e.top}%`,
              bottom: `${e.left}%`,
              width: `${e.height}%`,
            };
          default:
            return {
              height: `${e.height}%`,
              position: `absolute`,
              top: `${e.top}%`,
              left: `${e.left}%`,
              width: `${e.width}%`,
            };
        }
      },
      g = function (e) {
        var t = e.area,
          n = e.rotation;
        return o.createElement(`div`, {
          className: `rpv-highlight__selected-text`,
          style: h(t, n),
        });
      },
      _ = function (e) {
        var t = o.useState(e.get(`rotation`) || 0),
          n = t[0],
          r = t[1],
          i = function (e) {
            return r(e);
          };
        return (
          o.useEffect(function () {
            return (
              e.subscribe(`rotation`, i),
              function () {
                e.unsubscribe(`rotation`, i);
              }
            );
          }, []),
          { rotation: n }
        );
      },
      v = function (e) {
        var t = e.pageIndex,
          n = e.renderHighlightContent,
          r = e.renderHighlightTarget,
          i = e.renderHighlights,
          s = e.store,
          c = o.useState(s.get(`highlightState`)),
          u = c[0],
          d = c[1],
          f = _(s).rotation,
          p = function (e) {
            return d(e);
          },
          m = function () {
            (window.getSelection().removeAllRanges(),
              s.update(`highlightState`, l));
          };
        o.useEffect(function () {
          return (
            s.subscribe(`highlightState`, p),
            function () {
              s.unsubscribe(`highlightState`, p);
            }
          );
        }, []);
        var v =
          u.type === a.Selection
            ? u.highlightAreas.filter(function (e) {
                return e.pageIndex === t;
              })
            : [];
        return o.createElement(
          o.Fragment,
          null,
          r &&
            (u.type === a.Selected || u.type === a.ClickDragged) &&
            u.selectionRegion.pageIndex === t &&
            r({
              highlightAreas: u.highlightAreas,
              previewImage: u.previewImage || ``,
              selectedText: u.selectedText || ``,
              selectionRegion: u.selectionRegion,
              selectionData: u.selectionData,
              cancel: m,
              toggle: function () {
                var e = Object.assign({}, u, { type: a.Selection });
                (s.update(`highlightState`, e),
                  window.getSelection().removeAllRanges());
              },
            }),
          n &&
            u.type == a.Selection &&
            u.selectionRegion.pageIndex === t &&
            n({
              highlightAreas: u.highlightAreas,
              previewImage: u.previewImage || ``,
              selectedText: u.selectedText || ``,
              selectionRegion: u.selectionRegion,
              selectionData: u.selectionData,
              cancel: m,
            }),
          v.length > 0 &&
            o.createElement(
              `div`,
              null,
              v.map(function (e, t) {
                return o.createElement(g, { key: t, area: e, rotation: f });
              }),
            ),
          i && i({ pageIndex: t, rotation: f, getCssProperties: h }),
        );
      };
    ((e.Trigger = void 0),
      ((s = e.Trigger ||= {}).None = `None`),
      (s.TextSelection = `TextSelection`));
    var y,
      b = function (e, t, n) {
        var r = e.cloneNode(!0);
        e.parentNode.appendChild(r);
        var i = r.firstChild,
          a = new Range();
        (a.setStart(i, t), a.setEnd(i, n));
        var o = document.createElement(`span`);
        a.surroundContents(o);
        var s = o.getBoundingClientRect();
        return (r.parentNode.removeChild(r), s);
      },
      x = function (e, t, n, r, i, a) {
        if (n < i) {
          var o = `${e
            .slice(n, n + 1)
            .map(function (e) {
              return e.textContent.substring(r).trim();
            })
            .join(` `)} ${e
            .slice(n + 1, i)
            .map(function (e) {
              return e.textContent.trim();
            })
            .join(` `)} ${e
            .slice(i, i + 1)
            .map(function (e) {
              return e.textContent.substring(0, a || e.textContent.length);
            })
            .join(` `)}`;
          return {
            divTexts: e.slice(n, i + 1).map(function (e, r) {
              return {
                divIndex: n + r,
                pageIndex: t,
                textContent: e.textContent,
              };
            }),
            wholeText: o,
          };
        }
        var s = e[n];
        return (
          (o = s.textContent.substring(r, a || s.textContent.length).trim()),
          {
            divTexts: [
              { divIndex: n, pageIndex: t, textContent: s.textContent },
            ],
            wholeText: o,
          }
        );
      };
    (function (e) {
      ((e.SameDiv = `SameDiv`),
        (e.DifferentDivs = `DifferentDivs`),
        (e.DifferentPages = `DifferentPages`));
    })((y ||= {}));
    var S = [
        ``,
        `
`,
      ],
      C = function (t) {
        var n = t.store,
          r = _(n).rotation,
          i = o.useRef(null),
          s = o.useState(!1),
          c = s[0],
          l = s[1],
          u = o.useState(n.get(`trigger`)),
          d = u[0],
          h = u[1],
          g = function (e) {
            var t = e();
            ((i.current = t), l(!!t));
          },
          v = function (e) {
            return h(e);
          },
          C = function () {
            var e = document.getSelection(),
              t = n.get(`highlightState`);
            if (
              (t.type === a.NoSelection || t.type === a.Selected) &&
              e.rangeCount > 0 &&
              S.indexOf(e.toString()) === -1
            ) {
              var i,
                o,
                s = e.getRangeAt(0),
                c = s.startContainer.parentNode,
                l = s.endContainer.parentNode,
                u = l instanceof HTMLElement && l.hasAttribute(f);
              if (
                (c && c.parentNode == s.endContainer
                  ? (o = (i = c).textContent.length)
                  : u && s.endOffset == 0
                    ? (o = (i = s.endContainer.previousSibling).textContent
                        .length)
                    : u
                      ? ((i = s.endContainer), (o = s.endOffset))
                      : ((i = l), (o = s.endOffset)),
                c instanceof HTMLElement && i instanceof HTMLElement)
              ) {
                var d = parseInt(c.getAttribute(p), 10),
                  h = parseInt(i.getAttribute(p), 10),
                  g = c.parentElement,
                  _ = i.parentElement,
                  v = g.getBoundingClientRect(),
                  C = [].slice.call(g.querySelectorAll(`[${p}]`)),
                  w = C.indexOf(c),
                  T = _.getBoundingClientRect(),
                  E = [].slice.call(_.querySelectorAll(`[${p}]`)),
                  D = E.indexOf(i),
                  O = s.startOffset,
                  k = y.DifferentPages;
                switch (!0) {
                  case d === h && w === D:
                    k = y.SameDiv;
                    break;
                  case d === h && w < D:
                    k = y.DifferentDivs;
                    break;
                  default:
                    k = y.DifferentPages;
                }
                var A = function (e, t, n) {
                    return Array(t - e + 1)
                      .fill(0)
                      .map(function (t, r) {
                        return n[e + r].getBoundingClientRect();
                      });
                  },
                  j = [];
                switch (k) {
                  case y.SameDiv:
                    var M = b(c, O, o);
                    j = [
                      {
                        height: (100 * M.height) / v.height,
                        left: (100 * (M.left - v.left)) / v.width,
                        pageIndex: d,
                        top: (100 * (M.top - v.top)) / v.height,
                        width: (100 * M.width) / v.width,
                      },
                    ];
                    break;
                  case y.DifferentDivs:
                    j = [b(c, O, c.textContent.length)]
                      .concat(A(w + 1, D - 1, C), [b(i, 0, o)])
                      .map(function (e) {
                        return {
                          height: (100 * e.height) / v.height,
                          left: (100 * (e.left - v.left)) / v.width,
                          pageIndex: d,
                          top: (100 * (e.top - v.top)) / v.height,
                          width: (100 * e.width) / v.width,
                        };
                      });
                    break;
                  case y.DifferentPages:
                    var N = [b(c, O, c.textContent.length)]
                        .concat(A(w + 1, C.length - 1, C))
                        .map(function (e) {
                          return {
                            height: (100 * e.height) / v.height,
                            left: (100 * (e.left - v.left)) / v.width,
                            pageIndex: d,
                            top: (100 * (e.top - v.top)) / v.height,
                            width: (100 * e.width) / v.width,
                          };
                        }),
                      P = A(0, D - 1, E)
                        .concat([b(i, 0, o)])
                        .map(function (e) {
                          return {
                            height: (100 * e.height) / T.height,
                            left: (100 * (e.left - T.left)) / T.width,
                            pageIndex: h,
                            top: (100 * (e.top - T.top)) / T.height,
                            width: (100 * e.width) / T.width,
                          };
                        });
                    j = N.concat(P);
                }
                var F,
                  I = ``,
                  L = [];
                switch (k) {
                  case y.SameDiv:
                    var R = x(C, d, w, O, w, o);
                    ((I = R.wholeText), (L = R.divTexts));
                    break;
                  case y.DifferentDivs:
                    var z = x(C, d, w, O, D, o);
                    ((I = z.wholeText), (L = z.divTexts));
                    break;
                  case y.DifferentPages:
                    var B = x(C, d, w, O, C.length),
                      V = x(E, h, 0, 0, D, o);
                    ((I = `${B.wholeText}
${V.wholeText}`),
                      (L = B.divTexts.concat(V.divTexts)));
                }
                if (j.length > 0) F = j[j.length - 1];
                else {
                  var H = i.getBoundingClientRect();
                  F = {
                    height: (100 * H.height) / T.height,
                    left: (100 * (H.left - T.left)) / T.width,
                    pageIndex: h,
                    top: (100 * (H.top - T.top)) / T.height,
                    width: (100 * H.width) / T.width,
                  };
                }
                var U = {
                    divTexts: L,
                    selectedText: I,
                    startPageIndex: d,
                    endPageIndex: h,
                    startOffset: O,
                    startDivIndex: w,
                    endOffset: o,
                    endDivIndex: D,
                  },
                  W = {
                    type: a.Selected,
                    selectedText: I,
                    highlightAreas: j.map(function (e) {
                      return (function (e, t) {
                        switch (m(t)) {
                          case 90:
                            return {
                              height: e.width,
                              left: e.top,
                              pageIndex: e.pageIndex,
                              top: 100 - e.width - e.left,
                              width: e.height,
                            };
                          case 180:
                            return {
                              height: e.height,
                              left: 100 - e.width - e.left,
                              pageIndex: e.pageIndex,
                              top: 100 - e.height - e.top,
                              width: e.width,
                            };
                          case 270:
                            return {
                              height: e.width,
                              left: 100 - e.height - e.top,
                              pageIndex: e.pageIndex,
                              top: e.left,
                              width: e.height,
                            };
                          default:
                            return e;
                        }
                      })(e, r);
                    }),
                    selectionData: U,
                    selectionRegion: F,
                  };
                n.update(`highlightState`, W);
              }
            }
          };
        return (
          o.useEffect(
            function () {
              var t = i.current;
              if (t && d !== e.Trigger.None)
                return (
                  t.addEventListener(`mouseup`, C),
                  function () {
                    t.removeEventListener(`mouseup`, C);
                  }
                );
            },
            [c, d, r],
          ),
          o.useEffect(function () {
            return (
              n.subscribe(`getPagesContainer`, g),
              n.subscribe(`trigger`, v),
              function () {
                (n.unsubscribe(`getPagesContainer`, g),
                  n.unsubscribe(`trigger`, v));
              }
            );
          }, []),
          o.createElement(o.Fragment, null)
        );
      },
      w = `rpv-highlight__selected-end`;
    ((e.MessageIcon = function () {
      return o.createElement(
        r.Icon,
        { size: 16 },
        o.createElement(`path`, {
          d: `M23.5,17a1,1,0,0,1-1,1h-11l-4,4V18h-6a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h21a1,1,0,0,1,1,1Z`,
        }),
        o.createElement(`path`, { d: `M5.5 12L18.5 12` }),
        o.createElement(`path`, { d: `M5.5 7L18.5 7` }),
      );
    }),
      (e.highlightPlugin = function (t) {
        var n = Object.assign({}, { trigger: e.Trigger.TextSelection }, t),
          i = o.useMemo(function () {
            return r.createStore({ highlightState: l, trigger: n.trigger });
          }, []);
        return {
          install: function (e) {
            (i.update(`jumpToDestination`, e.jumpToDestination),
              i.update(`getPagesContainer`, e.getPagesContainer));
          },
          onViewerStateChange: function (e) {
            return (i.update(`rotation`, e.rotation), e);
          },
          onTextLayerRender: function (t) {
            var n,
              o =
                ((n = t),
                function (t) {
                  if (i.get(`trigger`) !== e.Trigger.None && t.button === 0) {
                    var r = n.ele,
                      o = r.getBoundingClientRect(),
                      s = i.get(`highlightState`);
                    if (s.type === a.Selected) {
                      var c = t.clientY - o.top,
                        d = t.clientX - o.left;
                      s.highlightAreas
                        .filter(function (e) {
                          return e.pageIndex === n.pageIndex;
                        })
                        .find(function (e) {
                          var t = (e.top * o.height) / 100,
                            n = (e.left * o.width) / 100,
                            r = (e.height * o.height) / 100,
                            i = (e.width * o.width) / 100;
                          return t <= c && c <= t + r && n <= d && d <= n + i;
                        })
                        ? (window.getSelection().removeAllRanges(),
                          i.update(`highlightState`, l))
                        : i.update(`highlightState`, u);
                    } else i.update(`highlightState`, l);
                    var f = (100 * (t.clientY - o.top)) / o.height,
                      p = r.querySelector(`.${w}`);
                    p && t.target !== r && (p.style.top = `${Math.max(0, f)}%`);
                  }
                }),
              s = (function (t) {
                return function (n) {
                  if (i.get(`trigger`) !== e.Trigger.None) {
                    var r = t.ele.querySelector(`.${w}`);
                    r && r.style.removeProperty(`top`);
                  }
                };
              })(t),
              c = t.ele;
            if (t.status === r.LayerRenderStatus.PreRender) {
              (c.removeEventListener(`mousedown`, o),
                c.removeEventListener(`mouseup`, s));
              var d = c.querySelector(`.${w}`);
              d && c.removeChild(d);
            } else if (
              t.status === r.LayerRenderStatus.DidRender &&
              (c.addEventListener(`mousedown`, o),
              c.addEventListener(`mouseup`, s),
              c.setAttribute(f, `true`),
              c
                .querySelectorAll(`.rpv-core__text-layer-text`)
                .forEach(function (e) {
                  return e.setAttribute(p, `${t.pageIndex}`);
                }),
              !c.querySelector(`.${w}`))
            ) {
              var m = document.createElement(`div`);
              (m.classList.add(w),
                m.classList.add(`rpv-core__text-layer-text--not`),
                c.appendChild(m));
            }
          },
          renderPageLayer: function (e) {
            return o.createElement(
              o.Fragment,
              null,
              o.createElement(d, {
                canvasLayerRef: e.canvasLayerRef,
                canvasLayerRendered: e.canvasLayerRendered,
                pageIndex: e.pageIndex,
                store: i,
                textLayerRef: e.textLayerRef,
                textLayerRendered: e.textLayerRendered,
              }),
              o.createElement(v, {
                pageIndex: e.pageIndex,
                renderHighlightContent: n.renderHighlightContent,
                renderHighlightTarget: n.renderHighlightTarget,
                renderHighlights: n.renderHighlights,
                store: i,
              }),
            );
          },
          renderViewer: function (e) {
            var t = e.slot;
            return (
              t.subSlot &&
                t.subSlot.children &&
                (t.subSlot.children = o.createElement(
                  o.Fragment,
                  null,
                  o.createElement(C, { store: i }),
                  t.subSlot.children,
                )),
              t
            );
          },
          jumpToHighlightArea: function (e) {
            var t = i.get(`jumpToDestination`);
            t &&
              t({
                pageIndex: e.pageIndex,
                bottomOffset: function (t, n) {
                  return ((100 - e.top) * n) / 100;
                },
                leftOffset: function (t, n) {
                  return ((100 - e.left) * t) / 100;
                },
              });
          },
          switchTrigger: function (e) {
            i.update(`trigger`, e);
          },
        };
      }));
  }),
  i = e((e, t) => {
    t.exports = r();
  });
export { i as t };
