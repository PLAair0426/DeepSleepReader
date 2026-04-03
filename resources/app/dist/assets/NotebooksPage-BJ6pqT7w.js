import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import { i as r, n as i, r as a, t as o } from "./index-3POXocQJ.js";
import { n as s, r as c } from "./format-AEs3_GdI.js";

var React = e(t(), 1),
  jsx = n();

function statusLabel(status) {
  return status === "ready"
    ? "已完成"
    : status === "generating"
      ? "生成中"
      : status === "failed"
        ? "失败"
        : "待配置";
}

function buildJumpPath(citation) {
  if (!citation.documentId) {
    return "/notebooks";
  }
  try {
    const payload = JSON.parse(citation.jumpPayloadJson ?? "{}");
    if (citation.jumpKind === "annotation" && payload.annotationId) {
      return `/reader/${citation.documentId}?annotationId=${encodeURIComponent(payload.annotationId)}`;
    }
    if (citation.jumpKind === "ai_card" && payload.aiCardId) {
      return `/reader/${citation.documentId}?aiCardId=${encodeURIComponent(payload.aiCardId)}`;
    }
    if (citation.jumpKind === "position") {
      return `/reader/${citation.documentId}?position=${encodeURIComponent(citation.jumpPayloadJson ?? "")}`;
    }
  } catch {}
  return `/reader/${citation.documentId}`;
}

function artifactDescription(artifact) {
  if (artifact.status === "ready" && artifact.contentMarkdown?.trim()) {
    return artifact.contentMarkdown;
  }
  return artifact.errorMessage?.trim() || "当前还不能生成自动摘要或关键概念。";
}

function NotebookCard({ notebook, onRename, onDelete }) {
  return jsx.jsxs("article", {
    className: "surface-card",
    children: [
      jsx.jsxs("div", {
        className: "section-heading",
        children: [
          jsx.jsxs("div", {
            children: [
              jsx.jsx("strong", { children: notebook.title }),
              jsx.jsx("p", {
                children: notebook.description || "还没有说明，适合作为一个新的研究主题。",
              }),
            ],
          }),
          jsx.jsxs("div", {
            className: "selection-actions",
            children: [
              jsx.jsx("button", {
                className: "secondary-button",
                type: "button",
                onClick: onRename,
                children: "重命名",
              }),
              jsx.jsx("button", {
                className: "secondary-button",
                type: "button",
                onClick: onDelete,
                children: "删除",
              }),
            ],
          }),
        ],
      }),
      jsx.jsxs("div", {
        className: "selection-actions",
        children: [
          jsx.jsxs("span", {
            className: "pill",
            children: [notebook.documentCount, " 份资料"],
          }),
          jsx.jsxs("span", {
            className: "pill",
            children: [
              notebook.artifactSummary.ready,
              " 已完成 / ",
              notebook.artifactSummary.unavailable,
              " 待配置",
            ],
          }),
          jsx.jsx("span", {
            className: "pill",
            children: s(notebook.lastActivityAt),
          }),
        ],
      }),
      jsx.jsx(i, {
        className: "surface-card surface-card--link",
        to: `/notebooks/${notebook.id}`,
        children: notebook.title,
      }),
    ],
  });
}

function NotebooksPage() {
  const readerApi = o();
  const navigate = a();
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingId, setEditingId] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const { value: notebooks, loading, error } = c(
    () => readerApi.notebooks.list(),
    [readerApi, refreshTick],
  );

  async function createNotebook(event) {
    event.preventDefault();
    const created = await readerApi.notebooks.create({
      title,
      description,
    });
    setTitle("");
    setDescription("");
    setMessage("笔记本已创建。");
    setRefreshTick((value) => value + 1);
    navigate(`/notebooks/${created.notebook.id}`);
  }

  async function renameNotebook(notebook) {
    const nextTitle = window.prompt("重命名笔记本", notebook.title);
    if (!nextTitle) {
      return;
    }
    setEditingId(notebook.id);
    await readerApi.notebooks.update(notebook.id, {
      title: nextTitle,
      description: notebook.description,
    });
    setEditingId(null);
    setRefreshTick((value) => value + 1);
  }

  async function deleteNotebook(notebook) {
    if (!window.confirm(`确认删除笔记本《${notebook.title}》吗？`)) {
      return;
    }
    await readerApi.notebooks.delete(notebook.id);
    setMessage("笔记本已删除。");
    setRefreshTick((value) => value + 1);
  }

  return jsx.jsxs("section", {
    className: "page-stack",
    children: [
      jsx.jsxs("header", {
        className: "page-hero",
        children: [
          jsx.jsxs("div", {
            children: [
              jsx.jsx("p", { className: "eyebrow", children: "笔记本" }),
              jsx.jsx("h1", { children: "把多篇资料组织成一个主题研究工作台" }),
              jsx.jsx("p", {
                className: "page-copy",
                children:
                  "每个笔记本都可以汇聚多份文档、保留历史问答、自动生成摘要与关键概念，并给出可回跳的证据引用。",
              }),
            ],
          }),
          jsx.jsx("div", {
            className: "pill",
            children: `${notebooks?.length ?? 0} 个笔记本`,
          }),
        ],
      }),
      jsx.jsxs("section", {
        className: "panel-section",
        children: [
          jsx.jsx("div", {
            className: "section-heading",
            children: jsx.jsxs("div", {
              children: [
                jsx.jsx("p", { className: "eyebrow", children: "创建新主题" }),
                jsx.jsx("h2", { children: "先搭一个 NotebookLM 风格的研究容器" }),
              ],
            }),
          }),
          jsx.jsxs("form", {
            className: "surface-card",
            onSubmit: createNotebook,
            children: [
              jsx.jsxs("label", {
                className: "field",
                children: [
                  jsx.jsx("span", { children: "笔记本标题" }),
                  jsx.jsx("input", {
                    "aria-label": "笔记本标题",
                    value: title,
                    onChange: (event) => setTitle(event.target.value),
                    placeholder: "例如：Aurora Notebook",
                  }),
                ],
              }),
              jsx.jsxs("label", {
                className: "field",
                children: [
                  jsx.jsx("span", { children: "主题说明" }),
                  jsx.jsx("textarea", {
                    "aria-label": "主题说明",
                    rows: 3,
                    value: description,
                    onChange: (event) => setDescription(event.target.value),
                    placeholder: "写下这个笔记本关注的问题、场景或目标读者。",
                  }),
                ],
              }),
              jsx.jsxs("div", {
                className: "selection-actions",
                children: [
                  jsx.jsx("button", {
                    className: "primary-button",
                    type: "submit",
                    children: "创建笔记本",
                  }),
                  message
                    ? jsx.jsx("span", { className: "pill", children: message })
                    : null,
                ],
              }),
            ],
          }),
        ],
      }),
      loading ? jsx.jsx("p", { className: "surface-card", children: "正在加载笔记本…" }) : null,
      error ? jsx.jsx("p", { className: "surface-card surface-card--error", children: error.message }) : null,
      !loading
        ? jsx.jsxs("section", {
            className: "panel-section",
            children: [
              jsx.jsx("div", {
                className: "section-heading",
                children: jsx.jsxs("div", {
                  children: [
                    jsx.jsx("p", { className: "eyebrow", children: "主题列表" }),
                    jsx.jsx("h2", { children: "进入一个笔记本开始多文档研究" }),
                  ],
                }),
              }),
              jsx.jsx("div", {
                className: "card-grid card-grid--wide",
                children:
                  notebooks && notebooks.length > 0
                    ? notebooks.map((notebook) =>
                        jsx.jsx(
                          NotebookCard,
                          {
                            notebook,
                            onRename: () => renameNotebook(notebook),
                            onDelete: () => deleteNotebook(notebook),
                            busy: editingId === notebook.id,
                          },
                          notebook.id,
                        ),
                      )
                    : jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "还没有笔记本" }),
                          jsx.jsx("p", {
                            children:
                              "先创建一个主题，再把 PDF、TXT、Markdown 或 EPUB 文档加入进去。",
                          }),
                        ],
                      }),
              }),
            ],
          })
        : null,
    ],
  });
}

function NotebookDetailPage() {
  const params = r();
  const readerApi = o();
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [activeTurnId, setActiveTurnId] = React.useState(null);
  const [notice, setNotice] = React.useState("");
  const [asking, setAsking] = React.useState(false);

  const { value: notebookDetail, loading, error } = c(
    () => readerApi.notebooks.get(params.notebookId),
    [readerApi, params.notebookId, refreshTick],
  );
  const { value: allDocuments } = c(
    () => readerApi.documents.list(),
    [readerApi, refreshTick],
  );

  React.useEffect(() => {
    if (!notebookDetail?.turns?.length) {
      setActiveTurnId(null);
      return;
    }
    if (!activeTurnId) {
      setActiveTurnId(notebookDetail.turns[0].id);
    }
  }, [notebookDetail, activeTurnId]);

  const notebook = notebookDetail?.notebook ?? null;
  const documents = notebookDetail?.documents ?? [];
  const artifacts = notebookDetail?.artifacts ?? [];
  const turns = notebookDetail?.turns ?? [];
  const activeTurn = turns.find((turn) => turn.id === activeTurnId) ?? turns[0] ?? null;
  const availableDocuments = React.useMemo(() => {
    const existingIds = new Set(documents.map((doc) => doc.id));
    return (allDocuments ?? []).filter((doc) => !existingIds.has(doc.id));
  }, [allDocuments, documents]);

  const unavailableArtifacts = artifacts.filter((artifact) => artifact.status === "unavailable");

  async function addDocument() {
    if (!selectedDocumentId) {
      return;
    }
    await readerApi.notebooks.addDocuments(params.notebookId, [selectedDocumentId]);
    setSelectedDocumentId("");
    setNotice("资料已加入笔记本。");
    setRefreshTick((value) => value + 1);
  }

  async function removeDocument(documentId) {
    await readerApi.notebooks.removeDocument(params.notebookId, documentId);
    setNotice("资料已移出笔记本。");
    setRefreshTick((value) => value + 1);
  }

  async function askNotebook(event) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    setAsking(true);
    const turn = await readerApi.notebooks.ask({
      notebookId: params.notebookId,
      query,
    });
    setQuery("");
    setActiveTurnId(turn.id);
    setNotice(turn.errorMessage || "笔记本问答已保存到线程。");
    setRefreshTick((value) => value + 1);
    setAsking(false);
  }

  async function retryArtifact(artifact) {
    await readerApi.notebooks.retryArtifact({
      notebookId: params.notebookId,
      artifactType: artifact.artifactType,
      documentId: artifact.documentId,
    });
    setNotice("已重新触发自动生成。");
    setRefreshTick((value) => value + 1);
  }

  return jsx.jsxs("section", {
    className: "page-stack",
    children: [
      jsx.jsxs("header", {
        className: "page-hero",
        children: [
          jsx.jsxs("div", {
            children: [
              jsx.jsx("p", { className: "eyebrow", children: "笔记本详情" }),
              jsx.jsx("h1", { children: notebook?.title ?? "笔记本" }),
              jsx.jsx("p", {
                className: "page-copy",
                children:
                  notebook?.description ||
                  "在这里把多篇资料组织成一个研究主题，持续积累问答、摘要、概念和证据链。",
              }),
            ],
          }),
          jsx.jsx(i, {
            className: "secondary-button",
            to: "/notebooks",
            children: "返回笔记本",
          }),
        ],
      }),
      loading ? jsx.jsx("p", { className: "surface-card", children: "正在加载笔记本…" }) : null,
      error ? jsx.jsx("p", { className: "surface-card surface-card--error", children: error.message }) : null,
      notebook
        ? jsx.jsxs("div", {
            style: {
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              alignItems: "start",
            },
            children: [
              jsx.jsxs("section", {
                className: "panel-section",
                children: [
                  jsx.jsx("div", {
                    className: "section-heading",
                    children: jsx.jsxs("div", {
                      children: [
                        jsx.jsx("p", { className: "eyebrow", children: "来源文档" }),
                        jsx.jsx("h2", { children: "这个主题引用了哪些资料" }),
                      ],
                    }),
                  }),
                  jsx.jsxs("div", {
                    className: "surface-card",
                    children: [
                      jsx.jsxs("label", {
                        className: "field",
                        children: [
                          jsx.jsx("span", { children: "添加资料" }),
                          jsx.jsxs("select", {
                            "aria-label": "添加资料",
                            value: selectedDocumentId,
                            onChange: (event) => setSelectedDocumentId(event.target.value),
                            children: [
                              jsx.jsx("option", { value: "", children: "选择一份资料加入笔记本" }),
                              ...availableDocuments.map((document) =>
                                jsx.jsx(
                                  "option",
                                  {
                                    value: document.id,
                                    children: `${document.originalName} (${document.format})`,
                                  },
                                  document.id,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      jsx.jsx("button", {
                        className: "primary-button",
                        type: "button",
                        onClick: addDocument,
                        children: "加入笔记本",
                      }),
                    ],
                  }),
                  jsx.jsx("div", {
                    className: "document-list",
                    children:
                      documents.length > 0
                        ? documents.map((document) =>
                            jsx.jsxs(
                              "article",
                              {
                                className: "document-row document-row--actions",
                                children: [
                                  jsx.jsxs(i, {
                                    className: "document-row__link",
                                    to: `/reader/${document.id}`,
                                    children: [
                                      jsx.jsxs("div", {
                                        children: [
                                          jsx.jsx("strong", { children: document.title }),
                                          jsx.jsx("p", { children: document.originalName }),
                                        ],
                                      }),
                                      jsx.jsxs("div", {
                                        className: "document-row__meta",
                                        children: [
                                          jsx.jsx("span", { children: document.format.toUpperCase() }),
                                          jsx.jsx("span", { children: s(document.addedAt) }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  jsx.jsx("button", {
                                    type: "button",
                                    className: "secondary-button",
                                    onClick: () => removeDocument(document.id),
                                    children: "移除",
                                  }),
                                ],
                              },
                              document.id,
                            ),
                          )
                        : jsx.jsxs("div", {
                            className: "surface-card",
                            children: [
                              jsx.jsx("strong", { children: "还没有来源文档" }),
                              jsx.jsx("p", {
                                children: "先加入几篇资料，笔记本才能生成摘要、概念和多文档问答。",
                              }),
                            ],
                          }),
                  }),
                ],
              }),
              jsx.jsxs("section", {
                className: "panel-section",
                children: [
                  jsx.jsx("div", {
                    className: "section-heading",
                    children: jsx.jsxs("div", {
                      children: [
                        jsx.jsx("p", { className: "eyebrow", children: "多文档对话" }),
                        jsx.jsx("h2", { children: "围绕当前主题持续追问" }),
                      ],
                    }),
                  }),
                  jsx.jsxs("form", {
                    className: "surface-card",
                    onSubmit: askNotebook,
                    children: [
                      jsx.jsxs("label", {
                        className: "field",
                        children: [
                          jsx.jsx("span", { children: "研究问题" }),
                          jsx.jsx("textarea", {
                            "aria-label": "研究问题",
                            rows: 3,
                            value: query,
                            onChange: (event) => setQuery(event.target.value),
                            placeholder: "例如：aurora 的主题是什么？",
                          }),
                        ],
                      }),
                      jsx.jsxs("div", {
                        className: "selection-actions",
                        children: [
                          jsx.jsx("button", {
                            className: "primary-button",
                            type: "submit",
                            disabled: asking,
                            children: asking ? "正在提问…" : "提问",
                          }),
                          notice ? jsx.jsx("span", { className: "pill", children: notice }) : null,
                        ],
                      }),
                    ],
                  }),
                  jsx.jsx("div", {
                    className: "document-list",
                    children:
                      turns.length > 0
                        ? turns.map((turn) =>
                            jsx.jsxs(
                              "article",
                              {
                                className: "surface-card",
                                children: [
                                  jsx.jsxs("div", {
                                    className: "section-heading",
                                    children: [
                                      jsx.jsxs("div", {
                                        children: [
                                          jsx.jsx("strong", { children: turn.questionText }),
                                          jsx.jsx("p", { children: `${s(turn.createdAt)} · ${turn.mode}` }),
                                        ],
                                      }),
                                      jsx.jsxs("div", {
                                        className: "selection-actions",
                                        children: [
                                          jsx.jsx("span", {
                                            className: "pill",
                                            children: turn.answerStatus === "ready" ? "已生成回答" : "当前走基础检索",
                                          }),
                                          jsx.jsx("button", {
                                            className: "secondary-button",
                                            type: "button",
                                            onClick: () => setActiveTurnId(turn.id),
                                            children: "查看详情",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  turn.answerMarkdown
                                    ? jsx.jsx("div", {
                                        style: { whiteSpace: "pre-wrap" },
                                        children: `${turn.answerMarkdown}\n\n[1]`,
                                      })
                                    : jsx.jsx("p", {
                                        children:
                                          turn.errorMessage || "当前按基础证据检索返回结果。",
                                      }),
                                ],
                              },
                              turn.id,
                            ),
                          )
                        : jsx.jsxs("div", {
                            className: "surface-card",
                            children: [
                              jsx.jsx("strong", { children: "还没有对话线程" }),
                              jsx.jsx("p", {
                                children: "提一个问题，笔记本会从当前来源文档里召回证据并保存这轮研究。",
                              }),
                            ],
                          }),
                  }),
                ],
              }),
              jsx.jsxs("section", {
                className: "panel-section",
                children: [
                  jsx.jsx("div", {
                    className: "section-heading",
                    children: jsx.jsxs("div", {
                      children: [
                        jsx.jsx("p", { className: "eyebrow", children: "证据与产物" }),
                        jsx.jsx("h2", { children: "摘要、关键概念、事实核验与引用" }),
                      ],
                    }),
                  }),
                  unavailableArtifacts.length > 0
                    ? jsx.jsx("div", {
                        className: "surface-card surface-card--error",
                        children: "当前还不能生成自动摘要或关键概念。先完成 AI 设置后可重试。",
                      })
                    : null,
                  jsx.jsxs("div", {
                    className: "card-grid",
                    children: artifacts.length > 0
                      ? artifacts.map((artifact) =>
                          jsx.jsxs(
                            "article",
                            {
                              className: "surface-card",
                              children: [
                                jsx.jsxs("div", {
                                  className: "section-heading",
                                  children: [
                                    jsx.jsxs("div", {
                                      children: [
                                        jsx.jsx("strong", { children: artifact.title }),
                                        jsx.jsx("p", { children: artifact.artifactType }),
                                      ],
                                    }),
                                    jsx.jsxs("div", {
                                      className: "selection-actions",
                                      children: [
                                        jsx.jsx("span", {
                                          className: "pill",
                                          children: statusLabel(artifact.status),
                                        }),
                                        jsx.jsx("button", {
                                          className: "secondary-button",
                                          type: "button",
                                          onClick: () => retryArtifact(artifact),
                                          children: "可重试",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                jsx.jsx("div", {
                                  style: { whiteSpace: "pre-wrap" },
                                  children: artifactDescription(artifact),
                                }),
                              ],
                            },
                            artifact.id,
                          ),
                        )
                      : jsx.jsx("div", {
                          className: "surface-card",
                          children: "加入资料后，这里会出现文档摘要、提纲、主题总览与关键概念。",
                        }),
                  }),
                  activeTurn
                    ? jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "引用证据" }),
                          jsx.jsx("div", {
                            className: "document-list",
                            children: activeTurn.citations.length > 0
                              ? activeTurn.citations.map((citation, index) =>
                                  jsx.jsxs(
                                    "article",
                                    {
                                      className: "document-row",
                                      children: [
                                        jsx.jsxs("div", {
                                          children: [
                                            jsx.jsx("strong", {
                                              children: `[${index + 1}] ${citation.documentTitle}`,
                                            }),
                                            jsx.jsx("p", { children: citation.excerpt }),
                                          ],
                                        }),
                                        citation.jumpAvailable
                                          ? jsx.jsx(i, {
                                              className: "secondary-button",
                                              to: buildJumpPath(citation),
                                              children: "跳转原文",
                                            })
                                          : jsx.jsx("span", {
                                              className: "pill",
                                              children: "不可跳转",
                                            }),
                                      ],
                                    },
                                    citation.evidenceId,
                                  ),
                                )
                              : jsx.jsx("p", { children: "当前没有可展示的引用证据。" }),
                          }),
                        ],
                      })
                    : null,
                  activeTurn
                    ? jsx.jsxs("div", {
                        className: "surface-card",
                        children: [
                          jsx.jsx("strong", { children: "事实核验" }),
                          jsx.jsx("div", {
                            className: "document-list",
                            children: activeTurn.factChecks.length > 0
                              ? activeTurn.factChecks.map((factCheck, index) =>
                                  jsx.jsxs(
                                    "article",
                                    {
                                      className: "document-row",
                                      children: [
                                        jsx.jsxs("div", {
                                          children: [
                                            jsx.jsx("strong", { children: factCheck.claim }),
                                            jsx.jsx("p", {
                                              children: `状态：${factCheck.status} · 证据 ${factCheck.evidenceIds.join(", ") || "待人工复核"}`,
                                            }),
                                          ],
                                        }),
                                        jsx.jsx("span", {
                                          className: "pill",
                                          children: factCheck.status,
                                        }),
                                      ],
                                    },
                                    `${factCheck.claim}-${index}`,
                                  ),
                                )
                              : jsx.jsx("p", { children: "这轮对话还没有事实核验条目。" }),
                          }),
                        ],
                      })
                    : null,
                ],
              }),
            ],
          })
        : null,
    ],
  });
}

export { NotebookDetailPage, NotebooksPage };
