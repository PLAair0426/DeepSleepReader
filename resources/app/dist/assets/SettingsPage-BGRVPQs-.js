import { i as e } from "./rolldown-runtime-B1FJdls4.js";
import { i as t, t as n } from "./app-framework-wcgWJpPK.js";
import { t as a } from "./index-3POXocQJ.js";

var React = e(t(), 1),
  jsx = n();

const PRESETS = [
  {
    id: "deepseek",
    label: "DeepSeek",
    group: "国内主流",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "默认预置。适合先把阅读器接到常用聊天模型，研究页会自动退回基础检索。",
  },
  {
    id: "qwen",
    label: "Qwen / 通义",
    group: "国内主流",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    embeddingModel: "text-embedding-v3",
    supportsEmbeddings: true,
    note: "同时给出聊天模型和 Embedding 模型，适合完整研究流程。",
  },
  {
    id: "kimi",
    label: "Kimi",
    group: "国内主流",
    baseUrl: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "优先覆盖阅读理解与总结场景，默认不提供 Embedding。",
  },
  {
    id: "doubao",
    label: "豆包 / Ark",
    group: "国内主流",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    model: "doubao-seed-1-6-thinking",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "保留为常用接入入口，默认聚焦聊天模型。",
  },
  {
    id: "openai",
    label: "OpenAI",
    group: "国际常用",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
    embeddingModel: "text-embedding-3-small",
    supportsEmbeddings: true,
    note: "聊天与 Embedding 都可直接配置。",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    group: "国际常用",
    baseUrl: "https://api.anthropic.com/v1",
    model: "claude-sonnet-4-20250514",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "适合只接聊天模型；研究页会停留在基础检索。",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    group: "国际常用",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "openai/gpt-4.1-mini",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "适合统一切换聊天模型，Embedding 仍建议走单独兼容服务。",
  },
  {
    id: "custom",
    label: "自定义兼容服务",
    group: "手动配置",
    baseUrl: "",
    model: "",
    embeddingModel: "",
    supportsEmbeddings: false,
    note: "保留完整手动编辑能力，不锁定厂商。",
  },
];

const DEFAULT_SETTINGS = {
  providerPresetId: "deepseek",
  mode: "user-key",
  baseUrl: "https://api.deepseek.com/v1",
  apiKey: "",
  model: "deepseek-chat",
  embeddingModel: "",
};

const EMPTY_NATIVE_STATUS = {
  mode: "typescript-only",
  addonPath: null,
  addonVersion: null,
  loadError: null,
  capabilities: [],
};

function getPreset(presetId) {
  return PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
}

function normalizeSettings(settings = {}) {
  const preset = getPreset(
    settings.providerPresetId ?? DEFAULT_SETTINGS.providerPresetId,
  );
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    mode: "user-key",
    providerPresetId: settings.providerPresetId ?? preset.id,
    baseUrl:
      typeof settings.baseUrl === "string" ? settings.baseUrl : preset.baseUrl,
    model: typeof settings.model === "string" ? settings.model : preset.model,
    embeddingModel:
      typeof settings.embeddingModel === "string"
        ? settings.embeddingModel
        : preset.embeddingModel,
  };
}

function applyPreset(settings, presetId) {
  const preset = getPreset(presetId);
  if (preset.id === "custom") {
    return {
      ...settings,
      mode: "user-key",
      providerPresetId: "custom",
    };
  }
  return {
    ...settings,
    mode: "user-key",
    providerPresetId: preset.id,
    baseUrl: preset.baseUrl,
    model: preset.model,
    embeddingModel: preset.embeddingModel,
  };
}

function getPresetSummary(settings) {
  const preset = getPreset(settings.providerPresetId);
  const apiConfigured = Boolean(
    settings.baseUrl?.trim() &&
    settings.model?.trim() &&
    settings.apiKey?.trim(),
  );
  const embeddingConfigured = Boolean(
    apiConfigured && settings.embeddingModel?.trim(),
  );
  if (!apiConfigured) {
    return "还没有填入可用 API Key。当前可以先保存预置，之后再补上密钥。";
  }
  if (!preset.supportsEmbeddings && !embeddingConfigured) {
    return "当前预置默认不提供 Embedding，研究页会自动使用基础检索。";
  }
  if (embeddingConfigured) {
    return "聊天模型与 Embedding 都已配置，研究页可以尝试语义检索。";
  }
  return "聊天模型已配置，Embedding 仍为空；研究页会保留基础检索。";
}

function SettingsPage() {
  const readerApi = a();
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
  const [nativeStatus, setNativeStatus] = React.useState(EMPTY_NATIVE_STATUS);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([readerApi.settings.get(), readerApi.native.getStatus()])
      .then(([savedSettings, status]) => {
        if (cancelled) {
          return;
        }
        setSettings(normalizeSettings(savedSettings));
        setNativeStatus(status ?? EMPTY_NATIVE_STATUS);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [readerApi]);

  const activePreset = getPreset(settings.providerPresetId);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextSettings = normalizeSettings(settings);
    setSettings(await readerApi.settings.save(nextSettings));
    setMessage("设置已保存。");
  }

  return jsx.jsxs("section", {
    className: "page-stack",
    children: [
      jsx.jsx("header", {
        className: "page-hero",
        children: jsx.jsxs("div", {
          children: [
            jsx.jsx("p", { className: "eyebrow", children: "AI 配置" }),
            jsx.jsx("h1", {
              children: "默认 DeepSeek，也支持切换常用 API 服务",
            }),
            jsx.jsx("p", {
              className: "page-copy",
              children:
                "先用服务预置带出常用 Base URL 和模型，再按你的账号与配额情况微调。未配置 API Key 时，阅读器仍可继续做标注与基础检索。",
            }),
          ],
        }),
      }),
      jsx.jsxs("form", {
        className: "form-card",
        onSubmit: handleSubmit,
        children: [
          jsx.jsxs("label", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "服务预置" }),
              jsx.jsxs("select", {
                "aria-label": "服务预置",
                value: settings.providerPresetId,
                onChange: (event) => {
                  setSettings((current) =>
                    applyPreset(current, event.target.value),
                  );
                  setMessage("");
                },
                children: PRESETS.map((preset) =>
                  jsx.jsx(
                    "option",
                    {
                      value: preset.id,
                      children: `${preset.group} · ${preset.label}`,
                    },
                    preset.id,
                  ),
                ),
              }),
            ],
          }),
          jsx.jsxs("div", {
            className: "selection-card",
            children: [
              jsx.jsxs("strong", {
                children: ["当前预置：", activePreset.label],
              }),
              jsx.jsx("p", { children: activePreset.note }),
              jsx.jsxs("p", {
                children: [
                  "Embedding：",
                  activePreset.supportsEmbeddings
                    ? "默认支持，可直接配置模型"
                    : "当前预置默认不提供",
                ],
              }),
              jsx.jsx("p", { children: getPresetSummary(settings) }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "Base URL" }),
              jsx.jsx("input", {
                "aria-label": "Base URL",
                value: settings.baseUrl ?? "",
                onChange: (event) =>
                  setSettings((current) => ({
                    ...current,
                    baseUrl: event.target.value,
                    providerPresetId:
                      current.providerPresetId === "custom"
                        ? "custom"
                        : current.providerPresetId,
                  })),
              }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "API Key" }),
              jsx.jsx("input", {
                "aria-label": "API Key",
                value: settings.apiKey ?? "",
                onChange: (event) =>
                  setSettings((current) => ({
                    ...current,
                    apiKey: event.target.value,
                  })),
              }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "模型" }),
              jsx.jsx("input", {
                "aria-label": "模型",
                value: settings.model ?? "",
                onChange: (event) =>
                  setSettings((current) => ({
                    ...current,
                    model: event.target.value,
                  })),
              }),
            ],
          }),
          jsx.jsxs("label", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "Embedding 模型" }),
              jsx.jsx("input", {
                "aria-label": "Embedding 模型",
                value: settings.embeddingModel ?? "",
                placeholder: activePreset.supportsEmbeddings
                  ? ""
                  : "当前预置默认留空",
                onChange: (event) =>
                  setSettings((current) => ({
                    ...current,
                    embeddingModel: event.target.value,
                  })),
              }),
            ],
          }),
          jsx.jsxs("div", {
            className: "form-actions",
            children: [
              jsx.jsx("button", {
                className: "primary-button",
                type: "submit",
                disabled: loading,
                children: "保存设置",
              }),
              message
                ? jsx.jsx("span", { className: "pill", children: message })
                : null,
            ],
          }),
        ],
      }),
      jsx.jsxs("article", {
        className: "form-card",
        children: [
          jsx.jsxs("div", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "预置服务" }),
              jsx.jsx("p", {
                children:
                  "这组预置覆盖 DeepSeek、Qwen、Kimi、豆包、OpenAI、Anthropic 和 OpenRouter。你也可以切到“自定义兼容服务”后完全手动填写。",
              }),
            ],
          }),
          jsx.jsxs("div", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "当前运行模式" }),
              jsx.jsx("strong", {
                children:
                  nativeStatus.mode === "native-addon"
                    ? "已加载原生模块"
                    : "TypeScript 主体 + 原生扩展预留",
              }),
              jsx.jsx("p", {
                children: nativeStatus.addonPath
                  ? nativeStatus.addonPath
                  : "当前没有加载 C++/native addon，这符合首版本地优先、快速迭代的路线。",
              }),
              nativeStatus.addonVersion
                ? jsx.jsxs("p", {
                    children: ["原生模块版本：", nativeStatus.addonVersion],
                  })
                : null,
              nativeStatus.loadError
                ? jsx.jsxs("p", {
                    children: ["加载失败：", nativeStatus.loadError],
                  })
                : null,
            ],
          }),
          jsx.jsxs("div", {
            className: "field",
            children: [
              jsx.jsx("span", { children: "预留能力" }),
              nativeStatus.capabilities.length > 0
                ? jsx.jsx("div", {
                    className: "stack-list",
                    children: nativeStatus.capabilities.map((capability) =>
                      jsx.jsxs(
                        "article",
                        {
                          className: "selection-card",
                          children: [
                            jsx.jsx("strong", { children: capability.label }),
                            jsx.jsx("p", { children: capability.summary }),
                            jsx.jsxs("span", {
                              children: [
                                capability.availability === "available"
                                  ? "已启用"
                                  : "规划中",
                                " · ",
                                capability.implementation,
                              ],
                            }),
                          ],
                        },
                        capability.id,
                      ),
                    ),
                  })
                : jsx.jsx("p", { children: "还没有登记任何原生模块能力。" }),
            ],
          }),
        ],
      }),
    ],
  });
}

export { SettingsPage };
