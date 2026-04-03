import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import { a as r, n as i, t as a } from "./index-3POXocQJ.js";
import { r as o, t as s } from "./format-AEs3_GdI.js";

var React = e(t(), 1),
  jsx = n();

function getReaderLink(result) {
  return result.positionPayloadJson
    ? `/reader/${result.documentId}?position=${encodeURIComponent(result.positionPayloadJson)}`
    : `/reader/${result.documentId}`;
}

function emptySearchResult(query) {
  return {
    query,
    results: [],
    indexedDocumentCount: 0,
    unsupportedDocuments: [],
    failedDocuments: [],
  };
}

function SearchPage() {
  const readerApi = a();
  const [searchParams, setSearchParams] = r();
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [draftQuery, setDraftQuery] = React.useState(
    searchParams.get("q") ?? "",
  );
  const [rebuildingDocumentId, setRebuildingDocumentId] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const query = searchParams.get("q") ?? "";
  const format = searchParams.get("format") ?? "";
  const matchKind = searchParams.get("matchKind") ?? "all";

  React.useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const request = React.useMemo(
    () => ({
      query,
      format: format || void 0,
      matchKind,
    }),
    [format, matchKind, query],
  );

  const {
    value: indexStates,
    loading: loadingStates,
    error: statesError,
  } = o(() => readerApi.search.listIndexStates(), [readerApi, refreshTick]);
  const {
    value: searchResult,
    loading: loadingSearch,
    error: searchError,
  } = o(
    () =>
      query
        ? readerApi.search.query(request)
        : Promise.resolve(emptySearchResult(query)),
    [query, readerApi, refreshTick, request],
  );

  const groupedResults = React.useMemo(() => {
    const map = new Map();
    for (const result of searchResult?.results ?? []) {
      const group = map.get(result.documentId);
      if (group) {
        group.results.push(result);
        continue;
      }
      map.set(result.documentId, {
        documentId: result.documentId,
        documentTitle: result.documentTitle,
        format: result.format,
        results: [result],
      });
    }
    return [...map.values()];
  }, [searchResult?.results]);

  const indexedCount = React.useMemo(
    () =>
      (indexStates ?? []).filter((state) => state.status === "indexed").length,
    [indexStates],
  );
  const unsupportedStates = React.useMemo(
    () => (indexStates ?? []).filter((state) => state.status === "unsupported"),
    [indexStates],
  );
  const failedStates = React.useMemo(
    () => (indexStates ?? []).filter((state) => state.status === "failed"),
    [indexStates],
  );

  async function rebuildDocument(state) {
    setErrorMessage(null);
    setRebuildingDocumentId(state.documentId);
    try {
      await readerApi.search.rebuildDocument(state.documentId);
      setRefreshTick((value) => value + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "索引重建失败。",
      );
    } finally {
      setRebuildingDocumentId(null);
    }
  }

  function updateSearchParams(next) {
    const merged = new URLSearchParams(searchParams);
    if (typeof next.q === "string") {
      next.q.trim() ? merged.set("q", next.q.trim()) : merged.delete("q");
    }
    if (typeof next.format === "string") {
      next.format ? merged.set("format", next.format) : merged.delete("format");
    }
    if (typeof next.matchKind === "string") {
      next.matchKind && next.matchKind !== "all"
        ? merged.set("matchKind", next.matchKind)
        : merged.delete("matchKind");
    }
    setSearchParams(merged);
  }

  return jsx.jsxs("section", {
    className: "page-stack",
    children: [
      jsx.jsxs("header", {
        className: "page-hero",
        children: [
          jsx.jsxs("div", {
            children: [
              jsx.jsx("p", { className: "eyebrow", children: "全文检索" }),
              jsx.jsx("h1", { children: "跨资料搜索你的研究书架" }),
              jsx.jsx("p", {
                className: "page-copy",
                children:
                  "支持 PDF、TXT、Markdown 内容检索；EPUB 目前仍以阅读为主，暂未纳入全文索引。这里会集中展示当前书架的索引状态与异常提示。",
              }),
            ],
          }),
          jsx.jsxs("div", {
            className: "pill",
            children: [indexedCount, " 份已索引资料"],
          }),
        ],
      }),
      jsx.jsxs("form", {
        "aria-label": "全文检索工作台",
        className: "filter-bar filter-bar--wrap",
        role: "search",
        onSubmit: (event) => {
          event.preventDefault();
          updateSearchParams({ q: draftQuery });
        },
        children: [
          jsx.jsxs("label", {
            className: "field field--inline",
            children: [
              jsx.jsx("span", { children: "检索关键词" }),
              jsx.jsx("input", {
                "aria-label": "检索关键词",
                value: draftQuery,
                onChange: (event) => setDraftQuery(event.target.value),
              }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field field--inline",
            children: [
              jsx.jsx("span", { children: "格式筛选" }),
              jsx.jsxs("select", {
                "aria-label": "检索格式",
                value: format,
                onChange: (event) =>
                  updateSearchParams({ format: event.target.value }),
                children: [
                  jsx.jsx("option", { value: "", children: "全部已支持格式" }),
                  jsx.jsx("option", { value: "pdf", children: "PDF" }),
                  jsx.jsx("option", { value: "txt", children: "TXT" }),
                  jsx.jsx("option", { value: "md", children: "Markdown" }),
                ],
              }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field field--inline",
            children: [
              jsx.jsx("span", { children: "匹配类型" }),
              jsx.jsxs("select", {
                "aria-label": "匹配类型",
                value: matchKind,
                onChange: (event) =>
                  updateSearchParams({ matchKind: event.target.value }),
                children: [
                  jsx.jsx("option", { value: "all", children: "全部" }),
                  jsx.jsx("option", { value: "title", children: "标题" }),
                  jsx.jsx("option", { value: "content", children: "内容" }),
                ],
              }),
            ],
          }),
          jsx.jsx("button", {
            className: "primary-button",
            type: "submit",
            children: "检索书架",
          }),
        ],
      }),
      jsx.jsxs("div", {
        className: "search-layout",
        children: [
          jsx.jsxs("section", {
            className: "panel-section",
            children: [
              jsx.jsxs("div", {
                className: "section-heading",
                children: [
                  jsx.jsxs("div", {
                    children: [
                      jsx.jsx("p", {
                        className: "eyebrow",
                        children: "命中结果",
                      }),
                      jsx.jsx("h2", { children: "检索结果" }),
                    ],
                  }),
                  jsx.jsxs("div", {
                    className: "pill",
                    children: [searchResult?.results.length ?? 0, " 条命中"],
                  }),
                ],
              }),
              jsx.jsxs("div", {
                className: "stack-list",
                children: [
                  query
                    ? null
                    : jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "等待检索关键词" }),
                          jsx.jsx("p", {
                            children:
                              "输入关键词后即可跨书架查找论文、笔记和摘要内容。",
                          }),
                        ],
                      }),
                  query && loadingSearch
                    ? jsx.jsx("p", {
                        className: "surface-card",
                        children: "正在检索书架…",
                      })
                    : null,
                  query && searchError
                    ? jsx.jsx("p", {
                        className: "surface-card surface-card--error",
                        children: searchError,
                      })
                    : null,
                  query && !loadingSearch && !searchError
                    ? groupedResults.map((group) =>
                        jsx.jsxs(
                          "article",
                          {
                            className: "surface-card search-group",
                            children: [
                              jsx.jsxs("div", {
                                className: "section-heading",
                                children: [
                                  jsx.jsxs("div", {
                                    children: [
                                      jsx.jsx("strong", {
                                        children: group.documentTitle,
                                      }),
                                      jsx.jsx("p", {
                                        children: s(group.format),
                                      }),
                                    ],
                                  }),
                                  jsx.jsx(i, {
                                    className: "secondary-button",
                                    to: `/reader/${group.documentId}`,
                                    children: "打开文档",
                                  }),
                                ],
                              }),
                              jsx.jsx("div", {
                                className: "stack-list",
                                children: group.results.map((result) =>
                                  jsx.jsxs(
                                    i,
                                    {
                                      className: "search-result",
                                      to: getReaderLink(result),
                                      children: [
                                        jsx.jsx("strong", {
                                          children: result.anchorLabel,
                                        }),
                                        jsx.jsx("span", {
                                          children: result.excerpt,
                                        }),
                                      ],
                                    },
                                    result.id,
                                  ),
                                ),
                              }),
                            ],
                          },
                          group.documentId,
                        ),
                      )
                    : null,
                  query &&
                  !loadingSearch &&
                  !searchError &&
                  searchResult &&
                  searchResult.results.length === 0
                    ? jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "没有找到匹配内容" }),
                          jsx.jsx("p", {
                            children:
                              "可以换一个关键词，或者改成标题匹配再试一次。",
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          }),
          jsx.jsxs("aside", {
            className: "panel-section",
            children: [
              jsx.jsx("div", {
                className: "section-heading",
                children: jsx.jsxs("div", {
                  children: [
                    jsx.jsx("p", {
                      className: "eyebrow",
                      children: "索引状态",
                    }),
                    jsx.jsx("h2", { children: "当前提示" }),
                  ],
                }),
              }),
              jsx.jsxs("div", {
                className: "stack-list",
                children: [
                  jsx.jsxs("article", {
                    className: "surface-card",
                    children: [
                      jsx.jsx("strong", { children: "EPUB 边界说明" }),
                      jsx.jsx("p", {
                        children:
                          "EPUB 目前仍以阅读、目录跳转和定位恢复为主，暂未纳入全文索引。若你需要跨文档检索，优先使用 PDF、TXT 或 Markdown。",
                      }),
                    ],
                  }),
                  loadingStates
                    ? jsx.jsx("p", {
                        className: "surface-card",
                        children: "正在加载索引状态…",
                      })
                    : null,
                  statesError
                    ? jsx.jsx("p", {
                        className: "surface-card surface-card--error",
                        children: statesError,
                      })
                    : null,
                  errorMessage
                    ? jsx.jsx("p", {
                        className: "surface-card surface-card--error",
                        children: errorMessage,
                      })
                    : null,
                  !loadingStates && !statesError
                    ? failedStates.map((state) =>
                        jsx.jsxs(
                          "article",
                          {
                            className: "surface-card surface-card--error",
                            children: [
                              jsx.jsx("strong", {
                                children: state.documentTitle,
                              }),
                              jsx.jsx("p", { children: state.errorMessage }),
                              state.canRebuild
                                ? jsx.jsx("button", {
                                    className: "secondary-button",
                                    type: "button",
                                    "aria-label": `重建索引 ${state.documentTitle}`,
                                    disabled:
                                      rebuildingDocumentId === state.documentId,
                                    onClick: () => rebuildDocument(state),
                                    children:
                                      rebuildingDocumentId === state.documentId
                                        ? "重建中…"
                                        : "重建索引",
                                  })
                                : null,
                            ],
                          },
                          state.documentId,
                        ),
                      )
                    : null,
                  !loadingStates && !statesError
                    ? unsupportedStates.map((state) =>
                        jsx.jsxs(
                          "article",
                          {
                            className: "surface-card",
                            children: [
                              jsx.jsx("strong", {
                                children: state.documentTitle,
                              }),
                              jsx.jsx("p", { children: state.errorMessage }),
                            ],
                          },
                          state.documentId,
                        ),
                      )
                    : null,
                  !loadingStates &&
                  !statesError &&
                  failedStates.length === 0 &&
                  unsupportedStates.length === 0
                    ? jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "索引状态正常" }),
                          jsx.jsx("p", {
                            children:
                              "当前没有需要额外处理的未支持或失败文档。",
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export { SearchPage };
