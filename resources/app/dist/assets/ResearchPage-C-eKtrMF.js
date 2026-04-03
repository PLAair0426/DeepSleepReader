import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import { n as r, t as i } from "./index-3POXocQJ.js";
import { n as a, r as o } from "./format-AEs3_GdI.js";

var React = e(t(), 1),
  jsx = n();

const DEFAULT_SETTINGS = {
  providerPresetId: "deepseek",
  mode: "user-key",
  baseUrl: "https://api.deepseek.com/v1",
  apiKey: "",
  model: "deepseek-chat",
  embeddingModel: "",
};

const PROVIDER_LABELS = {
  deepseek: "DeepSeek",
  qwen: "Qwen / 通义",
  kimi: "Kimi",
  doubao: "豆包 / Ark",
  openai: "OpenAI",
  anthropic: "Anthropic",
  openrouter: "OpenRouter",
  custom: "自定义兼容服务",
};

function normalizeSettings(settings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    mode: "user-key",
  };
}

function getSourceTypeLabel(sourceType) {
  return sourceType === "annotation"
    ? "批注"
    : sourceType === "bookmark"
      ? "书签"
      : sourceType === "ai_card"
        ? "AI 卡片"
        : "文档片段";
}

function buildResearchJump(documentId, jumpKind, jumpPayloadJson) {
  if (!documentId) {
    return "/research";
  }
  try {
    const payload = JSON.parse(jumpPayloadJson);
    if (jumpKind === "annotation" && payload.annotationId) {
      return `/reader/${documentId}?annotationId=${encodeURIComponent(payload.annotationId)}`;
    }
    if (jumpKind === "ai_card" && payload.aiCardId) {
      return `/reader/${documentId}?aiCardId=${encodeURIComponent(payload.aiCardId)}`;
    }
  } catch {}
  return jumpKind === "position"
    ? `/reader/${documentId}?position=${encodeURIComponent(jumpPayloadJson)}`
    : `/reader/${documentId}`;
}

function createEmptyResult(query) {
  return {
    query,
    mode: "lexical",
    results: [],
    answer: null,
    snapshotId: null,
  };
}

function formatResearchError(error, fallback) {
  const message = error instanceof Error ? error.message : "";
  const aiMatch = message.match(/AI provider returned (\d+)/i);
  const embeddingMatch = message.match(/Embedding provider returned (\d+)/i);
  if (/Failed to parse URL|Invalid URL/i.test(message)) {
    return "Base URL 无效，请检查协议与地址格式。";
  }
  if (/fetch failed|NetworkError|network/i.test(message)) {
    return "网络连接失败，请检查网络或服务可达性。";
  }
  if (aiMatch?.[1]) {
    return `AI 服务返回 ${aiMatch[1]}，请检查 API Key、Base URL 或配额。`;
  }
  if (embeddingMatch?.[1]) {
    return `Embedding 服务返回 ${embeddingMatch[1]}，请检查 Embedding 模型或 Key。`;
  }
  if (/Embedding provider returned an unexpected vector count/i.test(message)) {
    return "Embedding 服务返回的向量数量异常，请检查模型或服务兼容性。";
  }
  return message || fallback;
}

function toSnapshotSummary(result, documentId, sourceType) {
  return {
    id: result.snapshotId ?? "",
    query: result.query,
    documentId: documentId || void 0,
    sourceType: sourceType || void 0,
    mode: result.mode,
    resultCount: result.results.length,
    answerTitle: result.answer?.title,
    createdAt: new Date().toISOString(),
  };
}

function getProviderLabel(settings) {
  return (
    PROVIDER_LABELS[settings.providerPresetId] ??
    settings.providerPresetId ??
    "未命名服务"
  );
}

function getCapabilityMessage(settings, status) {
  const chatConfigured = Boolean(
    settings.mode === "user-key" &&
    settings.baseUrl?.trim() &&
    settings.apiKey?.trim() &&
    settings.model?.trim(),
  );
  const embeddingConfigured = Boolean(
    chatConfigured && settings.embeddingModel?.trim(),
  );

  if (!chatConfigured) {
    return "尚未配置可用 API Key。当前仍可同步文档片段并使用基础检索，AI 综合答案会保持关闭。";
  }
  if (!embeddingConfigured) {
    return "当前预置没有可用 Embedding 模型，研究会自动退回基础检索。";
  }
  if (status?.canRunSemanticSearch) {
    return "语义检索可用，研究结果会优先使用向量召回。";
  }
  return "Embedding 已配置，但还没有可用向量数据。先同步文档片段知识库，再重新运行研究。";
}

function normalizeEvidence(result, live = false) {
  return {
    ...result,
    jumpAvailable: live ? true : result.jumpAvailable,
  };
}

function ResearchPage() {
  const readerApi = i();
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [documentId, setDocumentId] = React.useState("");
  const [sourceType, setSourceType] = React.useState("");
  const [runningQuery, setRunningQuery] = React.useState(false);
  const [syncingCorpus, setSyncingCorpus] = React.useState(false);
  const [busySnapshotAction, setBusySnapshotAction] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [currentResult, setCurrentResult] = React.useState(null);
  const [activeSnapshotId, setActiveSnapshotId] = React.useState(null);

  const { value: documents } = o(() => readerApi.documents.list(), [readerApi]);
  const {
    value: researchStatus,
    loading: loadingStatus,
    error: statusError,
    setValue: setResearchStatus,
  } = o(() => readerApi.research.getStatus(), [readerApi, refreshTick]);
  const { value: savedSettings } = o(
    () => readerApi.settings.get(),
    [readerApi, refreshTick],
  );
  const {
    value: snapshots,
    loading: loadingSnapshots,
    error: snapshotsError,
  } = o(() => readerApi.research.listSnapshots(), [readerApi, refreshTick]);
  const {
    value: snapshotDetail,
    loading: loadingSnapshotDetail,
    error: snapshotDetailError,
  } = o(
    () =>
      activeSnapshotId
        ? readerApi.research.getSnapshot(activeSnapshotId)
        : Promise.resolve(null),
    [activeSnapshotId, readerApi, refreshTick],
  );

  const settings = React.useMemo(
    () => normalizeSettings(savedSettings),
    [savedSettings],
  );
  const liveResult = React.useMemo(
    () =>
      currentResult &&
      currentResult.snapshotId &&
      currentResult.snapshotId === activeSnapshotId
        ? currentResult
        : null,
    [currentResult, activeSnapshotId],
  );
  const mergedSnapshots = React.useMemo(() => {
    const existing = snapshots ?? [];
    if (!liveResult?.snapshotId) {
      return existing;
    }
    if (existing.some((snapshot) => snapshot.id === liveResult.snapshotId)) {
      return existing;
    }
    return [toSnapshotSummary(liveResult, documentId, sourceType), ...existing];
  }, [documentId, liveResult, snapshots, sourceType]);

  const activeSnapshot = React.useMemo(
    () =>
      liveResult
        ? toSnapshotSummary(liveResult, documentId, sourceType)
        : (snapshotDetail?.snapshot ?? null),
    [documentId, liveResult, snapshotDetail?.snapshot, sourceType],
  );
  const activeAnswer = React.useMemo(
    () => (liveResult ? liveResult.answer : (snapshotDetail?.answer ?? null)),
    [liveResult, snapshotDetail?.answer],
  );
  const activeEvidences = React.useMemo(
    () =>
      liveResult
        ? liveResult.results.map((result) => normalizeEvidence(result, true))
        : (snapshotDetail?.evidences ?? []).map((result) =>
            normalizeEvidence(result),
          ),
    [liveResult, snapshotDetail?.evidences],
  );

  const providerLabel = getProviderLabel(settings);
  const statusPill = researchStatus?.canRunSemanticSearch
    ? "语义检索可用"
    : "当前走基础检索";
  const capabilityMessage = getCapabilityMessage(settings, researchStatus);

  async function refreshActiveSnapshot(nextSnapshotId) {
    setActiveSnapshotId(nextSnapshotId ?? null);
    setRefreshTick((value) => value + 1);
  }

  async function syncDocumentCorpus() {
    setSyncingCorpus(true);
    setNotice("");
    try {
      const status = await readerApi.research.syncDocumentCorpus();
      setResearchStatus(status);
      setNotice(
        status.documentChunkCount > 0 || status.lastDocumentSyncAt
          ? "文档片段知识库已同步。"
          : "当前没有可同步的文档片段，或当前环境仍只支持基础检索。",
      );
    } catch (error) {
      setNotice(formatResearchError(error, "知识库同步失败。"));
    } finally {
      setSyncingCorpus(false);
      setRefreshTick((value) => value + 1);
    }
  }

  async function runResearch(event) {
    event.preventDefault();
    if (!query.trim()) {
      setCurrentResult(createEmptyResult(""));
      setActiveSnapshotId(null);
      return;
    }
    setRunningQuery(true);
    setNotice("");
    try {
      const result = await readerApi.research.query({
        query: query.trim(),
        documentId: documentId || void 0,
        sourceType: sourceType || void 0,
        includeAnswer: true,
      });
      setCurrentResult(result);
      setResearchStatus(result.status);
      setNotice("已保存到研究档案。");
      await refreshActiveSnapshot(result.snapshotId);
    } catch (error) {
      setNotice(formatResearchError(error, "研究查询失败。"));
    } finally {
      setRunningQuery(false);
    }
  }

  async function rerunSnapshot(snapshot) {
    setBusySnapshotAction(true);
    setNotice("");
    setQuery(snapshot.query);
    setDocumentId(snapshot.documentId ?? "");
    setSourceType(snapshot.sourceType ?? "");
    try {
      const result = await readerApi.research.query({
        query: snapshot.query,
        documentId: snapshot.documentId,
        sourceType: snapshot.sourceType,
        includeAnswer: true,
      });
      setCurrentResult(result);
      setResearchStatus(result.status);
      setNotice("已重新运行并保存为新研究档案。");
      await refreshActiveSnapshot(result.snapshotId);
    } catch (error) {
      setNotice(formatResearchError(error, "重新运行研究失败。"));
    } finally {
      setBusySnapshotAction(false);
    }
  }

  async function deleteSnapshot(snapshotId) {
    setBusySnapshotAction(true);
    setNotice("");
    try {
      await readerApi.research.deleteSnapshot(snapshotId);
      if (currentResult?.snapshotId === snapshotId) {
        setCurrentResult(null);
      }
      setNotice("研究档案已删除。");
      await refreshActiveSnapshot(null);
    } catch (error) {
      setNotice(formatResearchError(error, "删除研究档案失败。"));
    } finally {
      setBusySnapshotAction(false);
    }
  }

  return jsx.jsxs("section", {
    className: "page-stack",
    children: [
      jsx.jsxs("header", {
        className: "page-hero",
        children: [
          jsx.jsxs("div", {
            children: [
              jsx.jsx("p", { className: "eyebrow", children: "研究智能" }),
              jsx.jsx("h1", {
                children: "把批注、卡片和正文片段拉进同一个研究工作台",
              }),
              jsx.jsx("p", {
                className: "page-copy",
                children:
                  "先看证据，再决定是否生成综合答案。未配置 AI 时，研究仍会保存证据快照，并自动保持在基础检索。",
              }),
            ],
          }),
          jsx.jsx("button", {
            className: "primary-button",
            type: "button",
            disabled: syncingCorpus,
            onClick: syncDocumentCorpus,
            children: syncingCorpus ? "同步中…" : "同步文档片段知识库",
          }),
        ],
      }),
      notice ? jsx.jsx("div", { className: "pill", children: notice }) : null,
      jsx.jsxs("div", {
        className: "research-layout",
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
                        children: "知识库状态",
                      }),
                      jsx.jsx("h2", { children: "当前底座" }),
                    ],
                  }),
                  researchStatus
                    ? jsx.jsx("div", {
                        className: "pill",
                        children: statusPill,
                      })
                    : null,
                ],
              }),
              loadingStatus
                ? jsx.jsx("p", {
                    className: "surface-card",
                    children: "正在加载研究知识库状态…",
                  })
                : null,
              statusError
                ? jsx.jsx("p", {
                    className: "surface-card surface-card--error",
                    children: statusError,
                  })
                : null,
              researchStatus
                ? jsx.jsxs(React.Fragment, {
                    children: [
                      jsx.jsxs("div", {
                        className: "card-grid card-grid--wide",
                        children: [
                          jsx.jsxs("article", {
                            className: "surface-card status-metric",
                            children: [
                              jsx.jsx("span", { children: "笔记资产" }),
                              jsx.jsx("strong", {
                                children: researchStatus.noteChunkCount,
                              }),
                            ],
                          }),
                          jsx.jsxs("article", {
                            className: "surface-card status-metric",
                            children: [
                              jsx.jsx("span", { children: "文档片段" }),
                              jsx.jsx("strong", {
                                children: researchStatus.documentChunkCount,
                              }),
                            ],
                          }),
                          jsx.jsxs("article", {
                            className: "surface-card status-metric",
                            children: [
                              jsx.jsx("span", { children: "已嵌入条目" }),
                              jsx.jsx("strong", {
                                children: researchStatus.embeddedChunkCount,
                              }),
                            ],
                          }),
                          jsx.jsxs("article", {
                            className: "surface-card status-metric",
                            children: [
                              jsx.jsx("span", { children: "待同步片段" }),
                              jsx.jsx("strong", {
                                children:
                                  researchStatus.pendingDocumentChunkCount,
                              }),
                            ],
                          }),
                        ],
                      }),
                      jsx.jsxs("article", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "当前模型配置" }),
                          jsx.jsxs("p", {
                            children: [
                              "预置服务：",
                              providerLabel,
                              " · Provider 模式：",
                              researchStatus.providerMode,
                            ],
                          }),
                          jsx.jsxs("p", {
                            children: [
                              "聊天模型：",
                              settings.model || "未配置",
                            ],
                          }),
                          jsx.jsxs("p", {
                            children: [
                              "Embedding 模型：",
                              settings.embeddingModel || "未配置",
                            ],
                          }),
                          jsx.jsxs("p", {
                            children: [
                              "最近文档同步：",
                              researchStatus.lastDocumentSyncAt
                                ? ` ${a(researchStatus.lastDocumentSyncAt)}`
                                : " 尚未同步",
                            ],
                          }),
                          jsx.jsx("p", { children: capabilityMessage }),
                        ],
                      }),
                    ],
                  })
                : null,
              jsx.jsxs("form", {
                className: "form-card",
                onSubmit: runResearch,
                children: [
                  jsx.jsxs("label", {
                    className: "field",
                    children: [
                      jsx.jsx("span", { children: "研究问题" }),
                      jsx.jsx("input", {
                        "aria-label": "研究问题",
                        value: query,
                        onChange: (event) => setQuery(event.target.value),
                        placeholder:
                          "例如：attention 为什么成为这篇论文的关键机制？",
                      }),
                    ],
                  }),
                  jsx.jsxs("label", {
                    className: "field",
                    children: [
                      jsx.jsx("span", { children: "限定文档" }),
                      jsx.jsxs("select", {
                        "aria-label": "限定文档",
                        value: documentId,
                        onChange: (event) => setDocumentId(event.target.value),
                        children: [
                          jsx.jsx("option", {
                            value: "",
                            children: "全部文档",
                          }),
                          (documents ?? []).map((document) =>
                            jsx.jsx(
                              "option",
                              { value: document.id, children: document.title },
                              document.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  jsx.jsxs("label", {
                    className: "field",
                    children: [
                      jsx.jsx("span", { children: "来源类型" }),
                      jsx.jsxs("select", {
                        "aria-label": "来源类型",
                        value: sourceType,
                        onChange: (event) => setSourceType(event.target.value),
                        children: [
                          jsx.jsx("option", {
                            value: "",
                            children: "全部来源",
                          }),
                          jsx.jsx("option", {
                            value: "annotation",
                            children: "批注",
                          }),
                          jsx.jsx("option", {
                            value: "bookmark",
                            children: "书签",
                          }),
                          jsx.jsx("option", {
                            value: "ai_card",
                            children: "AI 卡片",
                          }),
                          jsx.jsx("option", {
                            value: "document_chunk",
                            children: "文档片段",
                          }),
                        ],
                      }),
                    ],
                  }),
                  jsx.jsxs("div", {
                    className: "form-actions",
                    children: [
                      jsx.jsx("button", {
                        className: "primary-button",
                        type: "submit",
                        disabled: runningQuery,
                        children: runningQuery ? "研究中…" : "开始研究",
                      }),
                      currentResult
                        ? jsx.jsx("span", {
                            className: "pill",
                            children:
                              currentResult.mode === "semantic"
                                ? "语义检索"
                                : "Lexical 检索",
                          })
                        : null,
                    ],
                  }),
                ],
              }),
            ],
          }),
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
                        children: "研究档案",
                      }),
                      jsx.jsx("h2", { children: "历史快照" }),
                    ],
                  }),
                  jsx.jsxs("div", {
                    className: "pill",
                    children: [mergedSnapshots.length, " 条"],
                  }),
                ],
              }),
              loadingSnapshots
                ? jsx.jsx("p", {
                    className: "surface-card",
                    children: "正在加载研究档案…",
                  })
                : null,
              snapshotsError
                ? jsx.jsx("p", {
                    className: "surface-card surface-card--error",
                    children: snapshotsError,
                  })
                : null,
              jsx.jsxs("div", {
                className: "stack-list",
                children: [
                  mergedSnapshots.map((snapshot) =>
                    jsx.jsx(
                      "article",
                      {
                        className: `surface-card snapshot-card ${
                          activeSnapshotId === snapshot.id
                            ? "snapshot-card--active"
                            : ""
                        }`,
                        children: jsx.jsxs("button", {
                          className: "annotation-jump",
                          type: "button",
                          "aria-label": `查看研究档案 ${snapshot.query}`,
                          onClick: () => setActiveSnapshotId(snapshot.id),
                          children: [
                            jsx.jsx("strong", { children: snapshot.query }),
                            jsx.jsxs("span", {
                              children: [
                                snapshot.answerTitle ?? "无综合回答",
                                " · ",
                                snapshot.resultCount,
                                " 条证据 · ",
                                a(snapshot.createdAt),
                              ],
                            }),
                          ],
                        }),
                      },
                      snapshot.id,
                    ),
                  ),
                  !loadingSnapshots && mergedSnapshots.length === 0
                    ? jsx.jsxs("article", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "还没有研究档案" }),
                          jsx.jsx("p", {
                            children:
                              "完成一次研究后，这里会自动留下问题、证据和答案快照。",
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          }),
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
                        children: "研究输出",
                      }),
                      jsx.jsx("h2", { children: "证据与综合回答" }),
                    ],
                  }),
                  jsx.jsxs("div", {
                    className: "pill",
                    children: [activeEvidences.length, " 条证据"],
                  }),
                ],
              }),
              loadingSnapshotDetail && activeSnapshotId
                ? jsx.jsx("p", {
                    className: "surface-card",
                    children: "正在加载研究档案详情…",
                  })
                : null,
              snapshotDetailError
                ? jsx.jsx("p", {
                    className: "surface-card surface-card--error",
                    children: snapshotDetailError,
                  })
                : null,
              activeSnapshot
                ? jsx.jsxs(React.Fragment, {
                    children: [
                      jsx.jsxs("article", {
                        className: "surface-card",
                        children: [
                          jsx.jsxs("div", {
                            className: "section-heading",
                            children: [
                              jsx.jsxs("div", {
                                children: [
                                  jsx.jsx("p", {
                                    className: "eyebrow",
                                    children: "当前研究档案",
                                  }),
                                  jsx.jsx("strong", {
                                    children: activeSnapshot.query,
                                  }),
                                  jsx.jsxs("p", {
                                    children: [
                                      activeSnapshot.answerTitle ??
                                        "无综合回答",
                                      " · ",
                                      activeSnapshot.resultCount,
                                      " 条证据",
                                    ],
                                  }),
                                ],
                              }),
                              jsx.jsxs("div", {
                                className: "selection-actions",
                                children: [
                                  jsx.jsx("button", {
                                    className: "secondary-button",
                                    type: "button",
                                    disabled: busySnapshotAction,
                                    onClick: () =>
                                      rerunSnapshot(activeSnapshot),
                                    children: "重新运行这条研究",
                                  }),
                                  jsx.jsx("button", {
                                    className: "secondary-button",
                                    type: "button",
                                    "aria-label": "删除当前研究档案",
                                    disabled: busySnapshotAction,
                                    onClick: () =>
                                      deleteSnapshot(activeSnapshot.id),
                                    children: "删除当前研究档案",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      activeAnswer
                        ? jsx.jsxs("article", {
                            className: "surface-card",
                            children: [
                              jsx.jsx("p", {
                                className: "eyebrow",
                                children: "AI 综合答案",
                              }),
                              jsx.jsx("strong", {
                                children: activeAnswer.title,
                              }),
                              jsx.jsx("pre", {
                                className: "note-input review-export",
                                children: activeAnswer.bodyMarkdown,
                              }),
                            ],
                          })
                        : jsx.jsxs("article", {
                            className: "surface-card",
                            children: [
                              jsx.jsx("strong", {
                                children: "这次研究没有生成综合答案",
                              }),
                              jsx.jsx("p", {
                                children:
                                  "证据快照仍然已经保存。若要自动生成综合回答，请先在 AI 设置里配置可用 API Key 与聊天模型。",
                              }),
                            ],
                          }),
                      jsx.jsxs("div", {
                        className: "stack-list",
                        children: [
                          activeEvidences.map((evidence) =>
                            jsx.jsxs(
                              "article",
                              {
                                className: "surface-card research-result",
                                children: [
                                  jsx.jsxs("div", {
                                    className: "review-card__copy",
                                    children: [
                                      jsx.jsxs("p", {
                                        className: "eyebrow",
                                        children: [
                                          getSourceTypeLabel(
                                            evidence.sourceType,
                                          ),
                                          " · ",
                                          evidence.documentTitle,
                                        ],
                                      }),
                                      jsx.jsx("strong", {
                                        children: evidence.title,
                                      }),
                                      jsx.jsx("p", {
                                        children: evidence.excerpt,
                                      }),
                                      jsx.jsxs("span", {
                                        children: [
                                          "得分 ",
                                          evidence.score.toFixed(2),
                                        ],
                                      }),
                                    ],
                                  }),
                                  evidence.jumpAvailable
                                    ? jsx.jsx(r, {
                                        className: "secondary-button",
                                        to: buildResearchJump(
                                          evidence.documentId,
                                          evidence.jumpKind,
                                          evidence.jumpPayloadJson,
                                        ),
                                        children: "跳回原文",
                                      })
                                    : jsx.jsx("button", {
                                        className: "secondary-button",
                                        type: "button",
                                        disabled: true,
                                        "aria-label": "原始目标已失效",
                                        children: "原始目标已失效",
                                      }),
                                ],
                              },
                              evidence.id,
                            ),
                          ),
                          activeEvidences.length === 0
                            ? jsx.jsxs("article", {
                                className: "surface-card",
                                children: [
                                  jsx.jsx("strong", {
                                    children: "这条研究没有命中证据",
                                  }),
                                  jsx.jsx("p", {
                                    children:
                                      "空结果也会被保存，便于你之后复跑同一个问题。",
                                  }),
                                ],
                              })
                            : null,
                        ],
                      }),
                    ],
                  })
                : jsx.jsxs("article", {
                    className: "surface-card",
                    children: [
                      jsx.jsx("strong", { children: "等待研究结果" }),
                      jsx.jsx("p", {
                        children:
                          "输入一个问题后，这里会先显示证据命中；如已配置可用 API，再追加综合回答。你也可以从左侧打开历史研究档案。",
                      }),
                    ],
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}

export { ResearchPage };
