import e from "node:path";
import { fileURLToPath as t, pathToFileURL as n } from "node:url";
import { BrowserWindow as r, app as i, dialog as a, ipcMain as o } from "electron";
import { access as s, appendFile as c, mkdir as l } from "node:fs/promises";
import { createRequire as u } from "node:module";
import { createHash as d, webcrypto as ee } from "node:crypto";
import { promises as f } from "node:fs";
import p from "sql.js";
//#region electron/native-runtime.ts
var te = u(import.meta.url), ne = e.dirname(t(import.meta.url)), re = "research_reader_native.node", ie = [
	{
		id: "pdf-rendering",
		label: "PDF rendering acceleration",
		summary: "为超大 PDF 的渲染与文本提取预留原生加速位",
		availability: "planned",
		implementation: "native-addon"
	},
	{
		id: "ocr",
		label: "OCR",
		summary: "为扫描版 PDF 预留 OCR 与版面识别能力",
		availability: "planned",
		implementation: "native-addon"
	},
	{
		id: "document-indexing",
		label: "Document indexing",
		summary: "为大体量资料库预留高性能索引能力",
		availability: "planned",
		implementation: "native-addon"
	}
];
function ae(e = {}) {
	return {
		mode: "typescript-only",
		addonPath: null,
		addonVersion: null,
		loadError: null,
		capabilities: ie,
		...e
	};
}
function oe(e = process.env) {
	if (e.RESEARCH_READER_NATIVE_ADDON?.trim()) return !0;
	let t = e.RESEARCH_READER_ENABLE_NATIVE?.trim().toLowerCase();
	return t === "1" || t === "true" || t === "yes" || t === "on";
}
function se(t = process.platform, n = process.arch) {
	return e.join("native", "modules", `${t}-${n}`, re);
}
function ce({ envAddonPath: t, processCwd: n, currentDir: r, resourcesPath: i, platform: a, arch: o }) {
	let s = se(a, o);
	return [
		t,
		e.resolve(n, s),
		e.resolve(r, "..", s),
		i ? e.resolve(i, s) : null
	].filter((e) => !!e);
}
async function le(e) {
	try {
		return await s(e), e;
	} catch {
		return null;
	}
}
async function ue() {
	if (!oe()) return null;
	let e = ce({
		envAddonPath: process.env.RESEARCH_READER_NATIVE_ADDON,
		processCwd: process.cwd(),
		currentDir: ne,
		resourcesPath: process.resourcesPath,
		platform: process.platform,
		arch: process.arch
	});
	for (let t of e) {
		let e = await le(t);
		if (e) return e;
	}
	return null;
}
async function de(e) {
	return te(e);
}
function fe(e) {
	return (e.capabilities ?? []).map((e) => ({
		...e,
		implementation: "native-addon"
	}));
}
function pe(e) {
	return {
		engine: "native-addon",
		classification: e.classification ?? "unknown",
		supportsSelectionLikely: !!e.supportsSelectionLikely,
		summary: e.summary ?? "Native addon could not classify the PDF confidently.",
		signals: Array.isArray(e.signals) ? e.signals.map((e) => String(e)) : []
	};
}
function m(e) {
	return {
		status: "unavailable",
		provider: e,
		resultMessage: "当前构建未接入 OCR 引擎。",
		payloadJson: JSON.stringify({ reason: "provider-unavailable" })
	};
}
function me(e, t) {
	return {
		status: e.status ?? "unavailable",
		provider: e.provider ?? t,
		resultMessage: e.resultMessage ?? "当前构建未接入 OCR 引擎。",
		payloadJson: e.payloadJson ?? JSON.stringify({ reason: "provider-unavailable" })
	};
}
async function he(e = {}) {
	let t = e.resolveAddonPath ?? ue, n = e.loadAddon ?? de, r = await t();
	if (!r) return {
		async getStatus() {
			return ae();
		},
		async inspectPdf() {
			return null;
		},
		async startOcr() {
			return m("typescript-fallback");
		}
	};
	try {
		let e = await n(r), t = e.getMetadata ? await e.getMetadata() : {};
		return {
			async getStatus() {
				return {
					mode: "native-addon",
					addonPath: r,
					addonVersion: t.version ?? null,
					loadError: null,
					capabilities: fe(t)
				};
			},
			async inspectPdf(t) {
				return e.inspectPdf ? pe(await e.inspectPdf(t)) : null;
			},
			async startOcr(t) {
				return e.requestOcr ? me(await e.requestOcr(t), "native-addon") : m("native-addon");
			}
		};
	} catch (e) {
		return {
			async getStatus() {
				return ae({
					addonPath: r,
					loadError: e instanceof Error ? e.message : "Failed to load native addon."
				});
			},
			async inspectPdf() {
				return null;
			},
			async startOcr() {
				return m("typescript-fallback");
			}
		};
	}
}
//#endregion
//#region node_modules/nanoid/url-alphabet/index.js
var ge = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", _e = 128, h, g;
function ve(e) {
	!h || h.length < e ? (h = Buffer.allocUnsafe(e * _e), ee.getRandomValues(h), g = 0) : g + e > h.length && (ee.getRandomValues(h), g = 0), g += e;
}
function _(e = 21) {
	ve(e |= 0);
	let t = "";
	for (let n = g - e; n < g; n++) t += ge[h[n] & 63];
	return t;
}
//#endregion
//#region node_modules/marked/lib/marked.esm.js
function v() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var y = v();
function ye(e) {
	y = e;
}
var b = { exec: () => null };
function x(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(S.caret, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var be = (() => {
	try {
		return !0;
	} catch {
		return !1;
	}
})(), S = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
	hrRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
	fencesBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
	headingBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
	htmlBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"),
	blockquoteBeginRegex: (e) => RegExp(`^ {0,${Math.min(3, e - 1)}}>`)
}, xe = /^(?:[ \t]*(?:\n|$))+/, Se = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ce = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, C = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, we = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Te = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ee = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, De = x(Ee).replace(/bull/g, Te).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Oe = x(Ee).replace(/bull/g, Te).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ke = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ae = /^[^\n]+/, je = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Me = x(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", je).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ne = x(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Te).getRegex(), w = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Pe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fe = x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Pe).replace("tag", w).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ie = x(ke).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", w).getRegex(), Le = {
	blockquote: x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ie).getRegex(),
	code: Se,
	def: Me,
	fences: Ce,
	heading: we,
	hr: C,
	html: Fe,
	lheading: De,
	list: Ne,
	newline: xe,
	paragraph: Ie,
	table: b,
	text: Ae
}, Re = x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", w).getRegex(), ze = {
	...Le,
	lheading: Oe,
	table: Re,
	paragraph: x(ke).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", w).getRegex()
}, Be = {
	...Le,
	html: x("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", Pe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: b,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: x(ke).replace("hr", C).replace("heading", " *#{1,6} *[^\n]").replace("lheading", De).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Ve = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, He = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ue = /^( {2,}|\\)\n(?!\s*$)/, We = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, T = /[\p{P}\p{S}]/u, E = /[\s\p{P}\p{S}]/u, Ge = /[^\s\p{P}\p{S}]/u, Ke = x(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, E).getRegex(), qe = /(?!~)[\p{P}\p{S}]/u, Je = /(?!~)[\s\p{P}\p{S}]/u, Ye = /(?:[^\s\p{P}\p{S}]|~)/u, Xe = x(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", be ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ze = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Qe = x(Ze, "u").replace(/punct/g, T).getRegex(), $e = x(Ze, "u").replace(/punct/g, qe).getRegex(), et = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", tt = x(et, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), nt = x(et, "gu").replace(/notPunctSpace/g, Ye).replace(/punctSpace/g, Je).replace(/punct/g, qe).getRegex(), rt = x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), it = x(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, T).getRegex(), at = x("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, E).replace(/punct/g, T).getRegex(), ot = x(/\\(punct)/, "gu").replace(/punct/g, T).getRegex(), st = x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ct = x(Pe).replace("(?:-->|$)", "-->").getRegex(), lt = x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ct).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), D = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, ut = x(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", D).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), dt = x(/^!?\[(label)\]\[(ref)\]/).replace("label", D).replace("ref", je).getRegex(), ft = x(/^!?\[(ref)\](?:\[\])?/).replace("ref", je).getRegex(), pt = x("reflink|nolink(?!\\()", "g").replace("reflink", dt).replace("nolink", ft).getRegex(), mt = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, O = {
	_backpedal: b,
	anyPunctuation: ot,
	autolink: st,
	blockSkip: Xe,
	br: Ue,
	code: He,
	del: b,
	delLDelim: b,
	delRDelim: b,
	emStrongLDelim: Qe,
	emStrongRDelimAst: tt,
	emStrongRDelimUnd: rt,
	escape: Ve,
	link: ut,
	nolink: ft,
	punctuation: Ke,
	reflink: dt,
	reflinkSearch: pt,
	tag: lt,
	text: We,
	url: b
}, ht = {
	...O,
	link: x(/^!?\[(label)\]\((.*?)\)/).replace("label", D).getRegex(),
	reflink: x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", D).getRegex()
}, k = {
	...O,
	emStrongRDelimAst: nt,
	emStrongLDelim: $e,
	delLDelim: it,
	delRDelim: at,
	url: x(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", mt).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: x(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", mt).getRegex()
}, gt = {
	...k,
	br: x(Ue).replace("{2,}", "*").getRegex(),
	text: x(k.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, A = {
	normal: Le,
	gfm: ze,
	pedantic: Be
}, j = {
	normal: O,
	gfm: k,
	breaks: gt,
	pedantic: ht
}, _t = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, vt = (e) => _t[e];
function M(e, t) {
	if (t) {
		if (S.escapeTest.test(e)) return e.replace(S.escapeReplace, vt);
	} else if (S.escapeTestNoEncode.test(e)) return e.replace(S.escapeReplaceNoEncode, vt);
	return e;
}
function yt(e) {
	try {
		e = encodeURI(e).replace(S.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function bt(e, t) {
	let n = e.replace(S.findPipe, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(S.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(S.slashPipe, "|");
	return n;
}
function N(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function xt(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function St(e, t = 0) {
	let n = t, r = "";
	for (let t of e) if (t === "	") {
		let e = 4 - n % 4;
		r += " ".repeat(e), n += e;
	} else r += t, n++;
	return r;
}
function Ct(e, t, n, r, i) {
	let a = t.href, o = t.title || null, s = e[1].replace(i.other.outputLinkReplace, "$1");
	r.state.inLink = !0;
	let c = {
		type: e[0].charAt(0) === "!" ? "image" : "link",
		raw: n,
		href: a,
		title: o,
		text: s,
		tokens: r.inlineTokens(s)
	};
	return r.state.inLink = !1, c;
}
function wt(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split("\n").map((e) => {
		let t = e.match(n.other.beginningSpace);
		if (t === null) return e;
		let [r] = t;
		return r.length >= i.length ? e.slice(i.length) : e;
	}).join("\n");
}
var P = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || y;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = t[0].replace(this.rules.other.codeRemoveIndent, "");
			return {
				type: "code",
				raw: t[0],
				codeBlockStyle: "indented",
				text: this.options.pedantic ? e : N(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = wt(e, t[3] || "", this.rules);
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (this.rules.other.endingHash.test(e)) {
				let t = N(e, "#");
				(this.options.pedantic || !t || this.rules.other.endingSpaceChar.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: t[0],
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: N(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = N(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o;
				for (o = 0; o < e.length; o++) if (this.rules.other.blockquoteStart.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
				n = n ? `${n}
${s}` : s, r = r ? `${r}
${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i.at(-1);
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.blockquote(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - t.raw.length) + o.raw, r = r.substring(0, r.length - t.text.length) + o.text;
					break;
				} else if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i.at(-1).raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let n = !1, r = "", s = "";
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				r = t[0], e = e.substring(r.length);
				let c = St(t[2].split("\n", 1)[0], t[1].length), l = e.split("\n", 1)[0], u = !c.trim(), d = 0;
				if (this.options.pedantic ? (d = 2, s = c.trimStart()) : u ? d = t[1].length + 1 : (d = c.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, s = c.slice(d), d += t[1].length), u && this.rules.other.blankLine.test(l) && (r += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = this.rules.other.nextBulletRegex(d), n = this.rules.other.hrRegex(d), i = this.rules.other.fencesBeginRegex(d), a = this.rules.other.headingBeginRegex(d), o = this.rules.other.htmlBeginRegex(d), ee = this.rules.other.blockquoteBeginRegex(d);
					for (; e;) {
						let f = e.split("\n", 1)[0], p;
						if (l = f, this.options.pedantic ? (l = l.replace(this.rules.other.listReplaceNesting, "  "), p = l) : p = l.replace(this.rules.other.tabCharGlobal, "    "), i.test(l) || a.test(l) || o.test(l) || ee.test(l) || t.test(l) || n.test(l)) break;
						if (p.search(this.rules.other.nonSpaceChar) >= d || !l.trim()) s += "\n" + p.slice(d);
						else {
							if (u || c.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || i.test(c) || a.test(c) || n.test(c)) break;
							s += "\n" + l;
						}
						u = !l.trim(), r += f + "\n", e = e.substring(f.length + 1), c = p.slice(d);
					}
				}
				i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(r) && (o = !0)), i.items.push({
					type: "list_item",
					raw: r,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += r;
			}
			let s = i.items.at(-1);
			if (s) s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let e of i.items) {
				if (this.lexer.state.top = !1, e.tokens = this.lexer.blockTokens(e.text, []), e.task) {
					if (e.text = e.text.replace(this.rules.other.listReplaceTask, ""), e.tokens[0]?.type === "text" || e.tokens[0]?.type === "paragraph") {
						e.tokens[0].raw = e.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), e.tokens[0].text = e.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
						for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
							this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask, "");
							break;
						}
					}
					let t = this.rules.other.listTaskCheckbox.exec(e.raw);
					if (t) {
						let n = {
							type: "checkbox",
							raw: t[0] + " ",
							checked: t[0] !== "[ ]"
						};
						e.checked = n.checked, i.loose ? e.tokens[0] && ["paragraph", "text"].includes(e.tokens[0].type) && "tokens" in e.tokens[0] && e.tokens[0].tokens ? (e.tokens[0].raw = n.raw + e.tokens[0].raw, e.tokens[0].text = n.raw + e.tokens[0].text, e.tokens[0].tokens.unshift(n)) : e.tokens.unshift({
							type: "paragraph",
							raw: n.raw,
							text: n.raw,
							tokens: [n]
						}) : e.tokens.unshift(n);
					}
				}
				if (!i.loose) {
					let t = e.tokens.filter((e) => e.type === "space");
					i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
				}
			}
			if (i.loose) for (let e of i.items) {
				e.loose = !0;
				for (let t of e.tokens) t.type === "text" && (t.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) return {
			type: "html",
			block: !0,
			raw: t[0],
			pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
			text: t[0]
		};
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: t[0],
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = bt(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [], a = {
			type: "table",
			raw: t[0],
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) this.rules.other.tableAlignRight.test(e) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(e) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(bt(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let e = t[1].trim();
			return {
				type: "heading",
				raw: t[0],
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
				if (!this.rules.other.endAngleBracket.test(e)) return;
				let t = N(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = xt(t[2], "()");
				if (e === -2) return;
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = this.rules.other.pedanticHrefTitle.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (n = this.options.pedantic && !this.rules.other.endAngleBracket.test(e) ? n.slice(1) : n.slice(1, -1)), Ct(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return Ct(n, e, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
				if (a = [...i].length, r[3] || r[4]) {
					o += a;
					continue;
				} else if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
					s += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o + s);
				let t = [...r[0]][0].length, c = e.slice(0, n + r.index + t + a);
				if (Math.min(n, a) % 2) {
					let e = c.slice(1, -1);
					return {
						type: "em",
						raw: c,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = c.slice(2, -2);
				return {
					type: "strong",
					raw: c,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(e), r = this.rules.other.startingSpaceChar.test(e) && this.rules.other.endingSpaceChar.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = this.rules.inline.delRDelim;
			for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (a = [...i].length, a !== n)) continue;
				if (r[3] || r[4]) {
					o += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o);
				let t = [...r[0]][0].length, s = e.slice(0, n + r.index + t + a), c = s.slice(n, -n);
				return {
					type: "del",
					raw: s,
					text: c,
					tokens: this.lexer.inlineTokens(c)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = t[1], n = "mailto:" + e) : (e = t[1], n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = t[0], n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = t[0], n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: e
			};
		}
	}
}, F = class e {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || y, this.options.tokenizer = this.options.tokenizer || new P(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: S,
			block: A.normal,
			inline: j.normal
		};
		this.options.pedantic ? (t.block = A.pedantic, t.inline = j.pedantic) : this.options.gfm && (t.block = A.gfm, this.options.breaks ? t.inline = j.breaks : t.inline = j.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: A,
			inline: j
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(S.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(S.tabCharGlobal, "    ").replace(S.spaceLine, "")); e;) {
			let r;
			if (this.options.extensions?.block?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.raw.length === 1 && n !== void 0 ? n.raw += "\n" : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "paragraph" || n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.raw, this.inlineQueue.at(-1).src = n.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				}, t.push(r));
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startBlock) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(i))) {
				let a = t.at(-1);
				n && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith("\n") ? "" : "\n") + r.raw, a.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += (n.raw.endsWith("\n") ? "" : "\n") + r.raw, n.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = n.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e, r = null;
		if (this.tokens.links) {
			let e = Object.keys(this.tokens.links);
			if (e.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null;) e.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
		}
		for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null;) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		let i;
		for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null;) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let a = !1, o = "";
		for (; e;) {
			a || (o = ""), a = !1;
			let r;
			if (this.options.extensions?.inline?.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.escape(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.tag(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.link(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(r.raw.length);
				let n = t.at(-1);
				r.type === "text" && n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.emStrong(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.codespan(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.br(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.del(e, n, o)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.autolink(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (!this.state.inLink && (r = this.tokenizer.url(e))) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startInline) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (r = this.tokenizer.inlineText(i)) {
				e = e.substring(r.raw.length), r.raw.slice(-1) !== "_" && (o = r.raw.slice(-1)), a = !0;
				let n = t.at(-1);
				n?.type === "text" ? (n.raw += r.raw, n.text += r.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				} else throw Error(t);
			}
		}
		return t;
	}
}, I = class {
	options;
	parser;
	constructor(e) {
		this.options = e || y;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(S.notSpaceStart)?.[0], i = e.replace(S.endingNewline, "") + "\n";
		return r ? "<pre><code class=\"language-" + M(r) + "\">" + (n ? i : M(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : M(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${M(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = yt(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + M(t) + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = yt(e);
		if (i === null) return M(n);
		e = i;
		let a = `<img src="${e}" alt="${M(n)}"`;
		return t && (a += ` title="${M(t)}"`), a += ">", a;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : M(e.text);
	}
}, L = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
}, R = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || y, this.options.renderer = this.options.renderer || new I(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this.options.extensions?.renderers?.[r.type]) {
				let e = r, n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (n !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(e.type)) {
					t += n || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "space":
					t += this.renderer.space(i);
					break;
				case "hr":
					t += this.renderer.hr(i);
					break;
				case "heading":
					t += this.renderer.heading(i);
					break;
				case "code":
					t += this.renderer.code(i);
					break;
				case "table":
					t += this.renderer.table(i);
					break;
				case "blockquote":
					t += this.renderer.blockquote(i);
					break;
				case "list":
					t += this.renderer.list(i);
					break;
				case "checkbox":
					t += this.renderer.checkbox(i);
					break;
				case "html":
					t += this.renderer.html(i);
					break;
				case "def":
					t += this.renderer.def(i);
					break;
				case "paragraph":
					t += this.renderer.paragraph(i);
					break;
				case "text":
					t += this.renderer.text(i);
					break;
				default: {
					let e = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "checkbox":
					n += t.checkbox(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, z = class {
	options;
	block;
	constructor(e) {
		this.options = e || y;
	}
	static passThroughHooks = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer() {
		return this.block ? F.lex : F.lexInline;
	}
	provideParser() {
		return this.block ? R.parse : R.parseInline;
	}
}, B = new class {
	defaults = v();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = R;
	Renderer = I;
	TextRenderer = L;
	Lexer = F;
	Tokenizer = P;
	Hooks = z;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(Infinity);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new I(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new P(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new z();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (["options", "block"].includes(n)) continue;
					let r = n, i = e.hooks[r], a = t[r];
					z.passThroughHooks.has(n) ? t[r] = (e) => {
						if (this.defaults.async && z.passThroughHooksRespectAsync.has(n)) return (async () => {
							let n = await i.call(t, e);
							return a.call(t, n);
						})();
						let r = i.call(t, e);
						return a.call(t, r);
					} : t[r] = (...e) => {
						if (this.defaults.async) return (async () => {
							let n = await i.apply(t, e);
							return n === !1 && (n = await a.apply(t, e)), n;
						})();
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return F.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return R.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, a = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return a(/* @__PURE__ */ Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return a(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return a(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let n = i.hooks ? await i.hooks.preprocess(t) : t, r = await (i.hooks ? await i.hooks.provideLexer() : e ? F.lex : F.lexInline)(n, i), a = i.hooks ? await i.hooks.processAllTokens(r) : r;
				i.walkTokens && await Promise.all(this.walkTokens(a, i.walkTokens));
				let o = await (i.hooks ? await i.hooks.provideParser() : e ? R.parse : R.parseInline)(a, i);
				return i.hooks ? await i.hooks.postprocess(o) : o;
			})().catch(a);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let n = (i.hooks ? i.hooks.provideLexer() : e ? F.lex : F.lexInline)(t, i);
				i.hooks && (n = i.hooks.processAllTokens(n)), i.walkTokens && this.walkTokens(n, i.walkTokens);
				let r = (i.hooks ? i.hooks.provideParser() : e ? R.parse : R.parseInline)(n, i);
				return i.hooks && (r = i.hooks.postprocess(r)), r;
			} catch (e) {
				return a(e);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + M(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}();
function V(e, t) {
	return B.parse(e, t);
}
V.options = V.setOptions = function(e) {
	return B.setOptions(e), V.defaults = B.defaults, ye(V.defaults), V;
}, V.getDefaults = v, V.defaults = y, V.use = function(...e) {
	return B.use(...e), V.defaults = B.defaults, ye(V.defaults), V;
}, V.walkTokens = function(e, t) {
	return B.walkTokens(e, t);
}, V.parseInline = B.parseInline, V.Parser = R, V.parser = R.parse, V.Renderer = I, V.TextRenderer = L, V.Lexer = F, V.lexer = F.lex, V.Tokenizer = P, V.Hooks = z, V.parse = V, V.options, V.setOptions, V.use, V.walkTokens, V.parseInline, R.parse, F.lex;
//#endregion
//#region electron/library-search.ts
function H(e) {
	return e.replace(/\s+/g, " ").trim();
}
function U(e, t) {
	let n = e.toLowerCase(), r = t ? n.indexOf(t) : -1;
	if (!t || r === -1) return e.slice(0, 180).trim();
	let i = Math.max(0, r - 48), a = Math.min(e.length, r + t.length + 96);
	return e.slice(i, a).trim();
}
function Tt(e) {
	return e.split(/\n\s*\n/).map((e) => H(e)).filter(Boolean).map((e, t) => ({
		sourceType: "block",
		anchorLabel: `Block ${t + 1}`,
		positionPayloadJson: JSON.stringify({ blockId: `block-${t + 1}` }),
		excerpt: U(e),
		searchableText: e,
		sortOrder: t
	}));
}
function Et(e) {
	let t = V.lexer(e), n = [];
	return t.forEach((e, t) => {
		if (e.type === "heading" || e.type === "paragraph" || e.type === "code") {
			let r = H(e.text ?? "");
			r && n.push({
				id: `block-${t + 1}`,
				text: r,
				order: n.length
			});
			return;
		}
		if (e.type === "blockquote") {
			let r = H((e.tokens ?? []).map((e) => e.text ?? "").join(" "));
			r && n.push({
				id: `block-${t + 1}`,
				text: r,
				order: n.length
			});
			return;
		}
		e.type === "list" && (e.items ?? []).forEach((e, r) => {
			let i = H(e.text ?? "");
			i && n.push({
				id: `block-${t + 1}-${r + 1}`,
				text: i,
				order: n.length
			});
		});
	}), n;
}
function Dt(e) {
	return Et(e).map((e) => ({
		sourceType: "block",
		anchorLabel: `Block ${e.order + 1}`,
		positionPayloadJson: JSON.stringify({ blockId: e.id }),
		excerpt: U(e.text),
		searchableText: e.text,
		sortOrder: e.order
	}));
}
async function Ot(e) {
	let t = await f.readFile(e), n = await import("pdfjs-dist/build/pdf.js"), r = (n.default ?? n).getDocument({
		data: new Uint8Array(t),
		disableWorker: !0,
		isEvalSupported: !1,
		useWorkerFetch: !1
	});
	try {
		let e = await r.promise, t = [];
		for (let n = 1; n <= e.numPages; n += 1) {
			let r = H((await (await e.getPage(n)).getTextContent()).items.map((e) => e.str ?? "").join(" "));
			r && t.push({
				sourceType: "page",
				anchorLabel: `Page ${n}`,
				positionPayloadJson: JSON.stringify({ page: n - 1 }),
				excerpt: U(r),
				searchableText: r,
				sortOrder: n - 1
			});
		}
		return t;
	} finally {
		await r.destroy?.();
	}
}
async function kt(e, t, n) {
	try {
		if (e.format === "epub") return {
			status: "unsupported",
			errorMessage: "EPUB 未纳入首版内容检索。",
			chunks: []
		};
		if (e.format === "pdf") {
			let t = await n.extractPdfSearchChunks(e.managedPath);
			return t.length === 0 ? {
				status: "unsupported",
				errorMessage: "当前未建立内容索引，需后续 OCR 支持。",
				chunks: []
			} : {
				status: "indexed",
				errorMessage: "",
				chunks: t
			};
		}
		let r = t ?? await f.readFile(e.managedPath, "utf8"), i = e.format === "txt" ? Tt(r) : Dt(r);
		return i.length === 0 ? {
			status: "unsupported",
			errorMessage: "文档内容为空，未建立内容索引。",
			chunks: []
		} : {
			status: "indexed",
			errorMessage: "",
			chunks: i
		};
	} catch (e) {
		return {
			status: "failed",
			errorMessage: e instanceof Error ? e.message : "索引构建失败。",
			chunks: []
		};
	}
}
function At(e, t) {
	return U(e, t.trim().toLowerCase());
}
function jt(e) {
	return e.trim().toLowerCase();
}
function Mt(e) {
	return e === "pdf" || e === "txt" || e === "md";
}
//#endregion
//#region src/shared/domain/documents.ts
function Nt(e) {
	let t = e.trim().toLowerCase();
	return t.endsWith(".pdf") ? "pdf" : t.endsWith(".epub") ? "epub" : t.endsWith(".txt") ? "txt" : t.endsWith(".md") ? "md" : null;
}
function Pt(e, t, n) {
	let r = e.find((e) => e.checksum === t.checksum);
	if (r) return {
		documents: e,
		document: r,
		deduplicated: !0,
		events: []
	};
	let i = {
		id: n(),
		title: t.title,
		format: t.format,
		checksum: t.checksum,
		managedPath: t.managedPath,
		originalName: t.originalName,
		createdAt: t.createdAt,
		lastOpenedAt: t.createdAt
	};
	return {
		documents: [i, ...e],
		document: i,
		deduplicated: !1,
		events: [{
			id: `event-${i.id}`,
			documentId: i.id,
			eventType: "document-imported",
			payloadJson: JSON.stringify({
				title: i.title,
				format: i.format
			}),
			createdAt: t.createdAt
		}]
	};
}
//#endregion
//#region src/shared/domain/annotations.ts
function Ft(e, t, n, r) {
	return {
		id: t(),
		documentId: e.documentId,
		format: e.format,
		anchorType: e.anchorType,
		anchorPayloadJson: JSON.stringify(e.anchorPayload),
		selectedText: e.selectedText,
		color: r,
		note: e.note ?? "",
		createdAt: n,
		updatedAt: n
	};
}
//#endregion
//#region src/shared/domain/bookmarks.ts
function It(e, t, n) {
	return {
		id: t(),
		documentId: e.documentId,
		format: e.format,
		positionPayloadJson: e.positionPayloadJson,
		title: e.title.trim(),
		note: e.note?.trim() ?? "",
		createdAt: n,
		updatedAt: n
	};
}
//#endregion
//#region src/shared/domain/ai.ts
function Lt() {
	return /* @__PURE__ */ Error("Managed cloud provider is not enabled in v1.");
}
var AI_PROVIDER_PRESETS = {
	deepseek: {
		id: "deepseek",
		label: "DeepSeek",
		baseUrl: "https://api.deepseek.com/v1",
		model: "deepseek-chat",
		embeddingModel: ""
	},
	qwen: {
		id: "qwen",
		label: "Qwen / DashScope",
		baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
		model: "qwen-plus",
		embeddingModel: "text-embedding-v3"
	},
	kimi: {
		id: "kimi",
		label: "Kimi",
		baseUrl: "https://api.moonshot.cn/v1",
		model: "moonshot-v1-8k",
		embeddingModel: ""
	},
	doubao: {
		id: "doubao",
		label: "Doubao / Ark",
		baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
		model: "doubao-seed-1-6-thinking",
		embeddingModel: ""
	},
	openai: {
		id: "openai",
		label: "OpenAI",
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-4.1-mini",
		embeddingModel: "text-embedding-3-small"
	},
	anthropic: {
		id: "anthropic",
		label: "Anthropic",
		baseUrl: "https://api.anthropic.com/v1",
		model: "claude-sonnet-4-20250514",
		embeddingModel: ""
	},
	openrouter: {
		id: "openrouter",
		label: "OpenRouter",
		baseUrl: "https://openrouter.ai/api/v1",
		model: "openai/gpt-4.1-mini",
		embeddingModel: ""
	},
	custom: {
		id: "custom",
		label: "Custom",
		baseUrl: "",
		model: "",
		embeddingModel: ""
	}
};
function getAiPresetDefinition(e) {
	if (!e || typeof e != "string") return AI_PROVIDER_PRESETS.deepseek;
	return AI_PROVIDER_PRESETS[e] ?? AI_PROVIDER_PRESETS.deepseek;
}
function normalizeAiSettings(e = {}) {
	let t = typeof e.providerPresetId == "string" && e.providerPresetId ? e.providerPresetId : W.providerPresetId, n = getAiPresetDefinition(t);
	return {
		...W,
		...e,
		mode: "user-key",
		providerPresetId: t,
		baseUrl: typeof e.baseUrl == "string" ? e.baseUrl : n.baseUrl,
		model: typeof e.model == "string" ? e.model : n.model,
		embeddingModel: typeof e.embeddingModel == "string" ? e.embeddingModel : n.embeddingModel
	};
}
function validateAiChatSettings(e) {
	if (e.mode === "managed-cloud") return Lt();
	if (!e.baseUrl?.trim() || !e.model?.trim()) return /* @__PURE__ */ Error("请先在 AI 设置中选择一个服务预置，或手动补全 Base URL 与模型名称。");
	if (!e.apiKey?.trim()) return /* @__PURE__ */ Error("请先在 AI 设置中填写 API Key，然后再生成 AI 卡片。");
	return null;
}
function Rt(e) {
	let t = normalizeAiSettings(e), n = validateAiChatSettings(t);
	if (n) throw n;
	return {
		mode: "user-key",
		baseUrl: t.baseUrl.replace(/\/+$/, ""),
		apiKey: t.apiKey.trim(),
		model: t.model.trim()
	};
}
function zt(e, t) {
	let n = {
		explain: "Explain the selected passage for a research reader.",
		summarize: "Summarize the selected passage for quick study review.",
		translate: "Translate the selected passage into concise Chinese while preserving meaning.",
		extract_terms: "Extract the important terms and explain why they matter."
	};
	return {
		endpoint: `${e.baseUrl}/chat/completions`,
		headers: {
			Authorization: `Bearer ${e.apiKey}`,
			"Content-Type": "application/json"
		},
		body: {
			model: e.model,
			temperature: .2,
			messages: [{
				role: "system",
				content: "You are an expert research reading assistant. Return structured markdown with brief key points."
			}, {
				role: "user",
				content: [
					n[t.actionType],
					`Document: ${t.documentTitle}`,
					`Format: ${t.format}`,
					`Context before: ${t.contextBefore}`,
					`Selection: ${t.selectionText}`,
					`Context after: ${t.contextAfter}`
				].join("\n")
			}]
		}
	};
}
//#endregion
//#region src/shared/domain/timeline.ts
function Bt(e, t) {
	return e.filter((e) => {
		let n = !t.documentId || e.documentId === t.documentId, r = !t.eventType || e.eventType === t.eventType;
		return n && r;
	});
}
//#endregion
//#region src/shared/domain/review.ts
function Vt(e, t, n = "newest") {
	let r = e.updatedAt ?? e.createdAt ?? "", i = t.updatedAt ?? t.createdAt ?? "";
	return n === "oldest" ? r.localeCompare(i) : i.localeCompare(r);
}
function Ht({ documents: e, annotations: t, aiCards: n, filters: r }) {
	let i = new Map(e.map((e) => [e.id, e])), a = new Map(t.map((e) => [e.id, e])), o = n.filter((e) => r?.color ? (e.annotationId ? a.get(e.annotationId) : null)?.color === r.color : !0), s = ["# Research Review Export", ""], c = [...t].sort((e, t) => Vt(e, t, r?.sortOrder)), l = [...o].sort((e, t) => Vt(e, t, r?.sortOrder));
	return s.push("## Annotations", ""), c.length === 0 ? s.push("- No annotations matched the current filters.", "") : c.forEach((e) => {
		let t = i.get(e.documentId);
		s.push(`### ${t?.title ?? e.documentId}`), s.push(`- Updated: ${e.updatedAt}`), s.push(`- Color: ${e.color}`), s.push(`- Selected text: ${e.selectedText}`), s.push(`- Note: ${e.note || "(empty)"}`), s.push("");
	}), s.push("## AI Cards", ""), l.length === 0 ? s.push("- No AI cards matched the current filters.", "") : l.forEach((e) => {
		let t = i.get(e.documentId);
		s.push(`### ${t?.title ?? e.documentId}`), s.push(`- Created: ${e.createdAt}`), s.push(`- Action: ${e.actionType}`), s.push(`- Title: ${e.title}`), s.push(""), s.push(e.bodyMarkdown), s.push("");
	}), s.join("\n").trim();
}
//#endregion
//#region electron/storage.ts
var W = {
	providerPresetId: "deepseek",
	mode: "user-key",
	baseUrl: "https://api.deepseek.com/v1",
	apiKey: "",
	model: "deepseek-chat",
	embeddingModel: ""
};
function G() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function Ut(e) {
	return {
		id: String(e.id),
		title: String(e.title),
		format: e.format,
		checksum: String(e.checksum),
		managedPath: String(e.managed_path),
		originalName: String(e.original_name),
		createdAt: String(e.created_at),
		lastOpenedAt: String(e.last_opened_at)
	};
}
function Wt(e) {
	return {
		id: String(e.id),
		documentId: String(e.document_id),
		format: e.format,
		anchorType: e.anchor_type,
		anchorPayloadJson: String(e.anchor_payload_json),
		selectedText: String(e.selected_text),
		color: e.color,
		note: String(e.note ?? ""),
		createdAt: String(e.created_at),
		updatedAt: String(e.updated_at)
	};
}
function Gt(e) {
	return {
		documentId: String(e.document_id),
		format: e.format,
		positionPayloadJson: String(e.position_payload_json),
		updatedAt: String(e.updated_at)
	};
}
function Kt(e) {
	return {
		id: String(e.id),
		documentId: String(e.document_id),
		format: e.format,
		positionPayloadJson: String(e.position_payload_json),
		title: String(e.title),
		note: String(e.note ?? ""),
		createdAt: String(e.created_at),
		updatedAt: String(e.updated_at)
	};
}
function qt(e) {
	return {
		id: String(e.id),
		documentId: String(e.document_id),
		annotationId: e.annotation_id ? String(e.annotation_id) : void 0,
		actionType: e.action_type,
		title: String(e.title),
		bodyMarkdown: String(e.body_markdown),
		keyPointsJson: String(e.key_points_json),
		createdAt: String(e.created_at)
	};
}
function Jt(e) {
	return {
		id: String(e.id),
		documentId: e.document_id ? String(e.document_id) : void 0,
		eventType: e.event_type,
		payloadJson: String(e.payload_json),
		createdAt: String(e.created_at)
	};
}
function Yt(e) {
	return {
		id: String(e.id),
		documentId: String(e.document_id),
		status: String(e.status),
		provider: String(e.provider),
		resultMessage: String(e.result_message),
		payloadJson: String(e.payload_json),
		createdAt: String(e.created_at),
		updatedAt: String(e.updated_at)
	};
}
function Xt(e) {
	let t = e.format, n = e.status;
	return {
		documentId: String(e.document_id),
		documentTitle: String(e.document_title),
		format: t,
		status: n,
		errorMessage: String(e.error_message ?? ""),
		indexVersion: Number(e.index_version ?? 1),
		updatedAt: String(e.updated_at),
		canRebuild: n === "failed" && Mt(t)
	};
}
function Zt(e) {
	return {
		id: String(e.id),
		query: String(e.query_text),
		documentId: e.document_id ? String(e.document_id) : void 0,
		sourceType: e.source_type ? String(e.source_type) : void 0,
		mode: String(e.mode),
		resultCount: Number(e.result_count ?? 0),
		answerTitle: e.answer_title ? String(e.answer_title) : void 0,
		createdAt: String(e.created_at)
	};
}
function Qt(e) {
	let t = e?.choices?.[0]?.message?.content;
	if (typeof t == "string") return t;
	if (Array.isArray(t)) return t.map((e) => typeof e?.text == "string" ? e.text : "").join("\n");
	throw Error("AI provider did not return readable content.");
}
function $t(e) {
	let t = e.split("\n").map((e) => e.trim()).filter((e) => e.startsWith("- ") || e.startsWith("* ")).map((e) => e.slice(2).trim());
	return t.length > 0 ? t.slice(0, 6) : [e.slice(0, 160).trim()];
}
function K(e) {
	return e.replace(/\s+/g, " ").trim().toLowerCase();
}
function en(e) {
	return e.replace(/\s+/g, " ").trim().slice(0, 220);
}
function tn(e, t) {
	if (!t) return 0;
	let n = 0, r = e.indexOf(t);
	for (; r !== -1;) n += 1, r = e.indexOf(t, r + t.length);
	return n;
}
function nn(e, t) {
	if (e.length === 0 || e.length !== t.length) return 0;
	let n = 0, r = 0, i = 0;
	for (let a = 0; a < e.length; a += 1) {
		let o = e[a] ?? 0, s = t[a] ?? 0;
		n += o * s, r += o * o, i += s * s;
	}
	return !r || !i ? 0 : n / (Math.sqrt(r) * Math.sqrt(i));
}
function q(e) {
	let t = normalizeAiSettings(e);
	return !!(t.mode === "user-key" && t.baseUrl?.trim() && t.apiKey?.trim() && t.embeddingModel?.trim());
}
function rn(e) {
	let t = normalizeAiSettings(e);
	return !!(t.mode === "user-key" && t.baseUrl?.trim() && t.apiKey?.trim() && t.model?.trim());
}
function an(e) {
	let t = e.note.trim() || e.selectedText.slice(0, 96), n = [e.selectedText.trim(), e.note.trim()].filter(Boolean).join("\n");
	return {
		sourceType: "annotation",
		sourceRecordId: e.id,
		documentId: e.documentId,
		title: t,
		excerpt: en(e.selectedText),
		contentText: n,
		jumpKind: "annotation",
		jumpPayloadJson: JSON.stringify({ annotationId: e.id }),
		updatedAt: e.updatedAt
	};
}
function on(e) {
	let t = [e.title.trim(), e.note.trim()].filter(Boolean).join("\n");
	return {
		sourceType: "bookmark",
		sourceRecordId: e.id,
		documentId: e.documentId,
		title: e.title,
		excerpt: en(e.note || e.title),
		contentText: t,
		jumpKind: "position",
		jumpPayloadJson: e.positionPayloadJson,
		updatedAt: e.updatedAt
	};
}
function sn(e) {
	let t = (() => {
		try {
			return JSON.parse(e.keyPointsJson);
		} catch {
			return [];
		}
	})(), n = [
		e.title.trim(),
		e.bodyMarkdown.trim(),
		...t
	].filter(Boolean).join("\n");
	return {
		sourceType: "ai_card",
		sourceRecordId: e.id,
		documentId: e.documentId,
		title: e.title,
		excerpt: en(e.bodyMarkdown),
		contentText: n,
		jumpKind: "ai_card",
		jumpPayloadJson: JSON.stringify({ aiCardId: e.id }),
		updatedAt: e.createdAt
	};
}
function cn2(e, t) {
	try {
		return JSON.parse(String(e ?? ""));
	} catch {
		return t;
	}
}
function ln2(e, t) {
	let n = e instanceof Error ? e.message : "";
	if (/Failed to parse URL|Invalid URL/i.test(n)) return "Base URL 无效，请检查协议与地址格式。";
	if (/fetch failed|NetworkError|network/i.test(n)) return "网络连接失败，请检查网络或服务可达性。";
	let r = n.match(/AI provider returned (\d+)/i), i = n.match(/Embedding provider returned (\d+)/i);
	return r?.[1] ? `AI 服务返回 ${r[1]}，请检查 API Key、Base URL 或配额。` : i?.[1] ? `Embedding 服务返回 ${i[1]}，请检查 Embedding 模型或 Key。` : /Embedding provider returned an unexpected vector count/i.test(n) ? "Embedding 服务返回的向量数量异常，请检查模型或服务兼容性。" : n || t;
}
function un2(e, t = {}) {
	return {
		id: String(e.id),
		title: String(e.title),
		description: String(e.description ?? ""),
		createdAt: String(e.created_at),
		updatedAt: String(e.updated_at),
		lastActivityAt: String(e.last_activity_at),
		documentCount: Number(t.documentCount ?? e.document_count ?? 0),
		artifactSummary: {
			ready: Number(t.readyCount ?? e.ready_count ?? 0),
			failed: Number(t.failedCount ?? e.failed_count ?? 0),
			unavailable: Number(t.unavailableCount ?? e.unavailable_count ?? 0),
			generating: Number(t.generatingCount ?? e.generating_count ?? 0)
		}
	};
}
function dn2(e) {
	return {
		notebookId: String(e.notebook_id),
		documentId: String(e.document_id),
		addedAt: String(e.added_at)
	};
}
function fn2(e) {
	let t = cn2(e.content_json, null);
	return {
		id: String(e.id),
		notebookId: String(e.notebook_id),
		documentId: e.document_id ? String(e.document_id) : void 0,
		artifactType: String(e.artifact_type),
		status: String(e.status),
		title: String(e.title ?? ""),
		contentMarkdown: String(e.content_markdown ?? ""),
		contentJson: t,
		errorMessage: String(e.error_message ?? ""),
		createdAt: String(e.created_at),
		updatedAt: String(e.updated_at)
	};
}
function pn2(e, t) {
	return {
		...e,
		jumpAvailable: t.isResearchJumpAvailable(e.sourceType ?? "document_chunk", e.documentId, e.jumpKind, e.jumpPayloadJson)
	};
}
function mn2(e, t) {
	let n = cn2(e.citations_json, []).map((e) => pn2({
		evidenceId: String(e.evidenceId ?? e.id ?? ""),
		documentId: e.documentId ? String(e.documentId) : void 0,
		documentTitle: String(e.documentTitle ?? "未关联文档"),
		title: String(e.title ?? ""),
		excerpt: String(e.excerpt ?? ""),
		jumpKind: String(e.jumpKind ?? "position"),
		jumpPayloadJson: String(e.jumpPayloadJson ?? "{}"),
		sourceType: String(e.sourceType ?? "document_chunk"),
		score: Number(e.score ?? 0)
	}, t)), r = cn2(e.fact_check_json, []).map((e) => ({
		claim: String(e.claim ?? ""),
		status: e.status === "mixed" || e.status === "needs-review" ? e.status : "supported",
		evidenceIds: Array.isArray(e.evidenceIds) ? e.evidenceIds.map((e) => String(e)) : []
	})), i = String(e.answer_status ?? (e.answer_markdown ? "ready" : "unavailable"));
	return {
		id: String(e.id),
		notebookId: String(e.notebook_id),
		questionText: String(e.question_text),
		answerMarkdown: String(e.answer_markdown ?? ""),
		answerStatus: i,
		mode: String(e.mode),
		citationIds: cn2(e.citation_ids_json, []).map((e) => String(e)),
		citations: n,
		factChecks: r,
		errorMessage: String(e.error_message ?? ""),
		createdAt: String(e.created_at)
	};
}
function hn2(e, t, n) {
	return e === "doc_summary" ? `${t} · 文档摘要` : e === "doc_outline" ? `${t} · 文档提纲` : e === "notebook_overview" ? `${n} · 主题总览` : `${n} · 关键概念`;
}
function gn2(e) {
	let t = new Map();
	return e.forEach((e) => {
		t.set(e.status, (t.get(e.status) ?? 0) + 1);
	}), {
		ready: t.get("ready") ?? 0,
		failed: t.get("failed") ?? 0,
		unavailable: t.get("unavailable") ?? 0,
		generating: t.get("generating") ?? 0
	};
}
function _n2(e) {
	return {
		evidenceId: String(e.id),
		documentId: e.documentId,
		documentTitle: e.documentTitle,
		title: e.title,
		excerpt: e.excerpt,
		jumpKind: e.jumpKind,
		jumpPayloadJson: e.jumpPayloadJson,
		sourceType: e.sourceType,
		score: e.score
	};
}
function vn2(e, t) {
	let n = e.split(/\n+/).map((e) => e.replace(/^[-*#\d.\s]+/, "").trim()).filter(Boolean).slice(0, 3);
	return n.length > 0 ? n.map((e, n) => ({
		claim: e,
		status: "supported",
		evidenceIds: t.slice(n, n + 2).map((e) => e.evidenceId)
	})) : t.slice(0, 3).map((e) => ({
		claim: e.excerpt.slice(0, 120),
		status: "supported",
		evidenceIds: [e.evidenceId]
	}));
}
function yn2(e) {
	try {
		return JSON.parse(e);
	} catch {}
	let t = e.match(/```json\s*([\s\S]*?)```/i);
	if (t?.[1]) try {
		return JSON.parse(t[1]);
	} catch {}
	return null;
}
function bn2(e, t, n) {
	if (Array.isArray(e)) return e.map((e, r) => ({
		term: String(e.term ?? `概念 ${r + 1}`),
		explanation: String(e.explanation ?? e.description ?? ""),
		relatedDocumentIds: n,
		relatedEvidenceIds: t.slice(r, r + 2)
	})).filter((e) => e.term.trim());
	let r = String(e ?? "").split("\n").map((e) => e.replace(/^[-*#\d.\s]+/, "").trim()).filter(Boolean).slice(0, 6);
	return r.map((e, r) => ({
		term: e.split(/[:：]/)[0] || `概念 ${r + 1}`,
		explanation: e.includes("：") || e.includes(":") ? e.split(/[:：]/).slice(1).join("：").trim() : e,
		relatedDocumentIds: n,
		relatedEvidenceIds: t.slice(r, r + 2)
	}));
}
function xn2(e, t, n, r, i = "") {
	let a = [`Notebook: ${e}`];
	return t && a.push(`Document: ${t}`), a.push(`Task: ${n}`, `Return format: ${r}`, "", "Source:", i), a.join("\n");
}
function Sn2(e, t, n, r) {
	return {
		endpoint: `${e.baseUrl}/chat/completions`,
		headers: {
			Authorization: `Bearer ${e.apiKey}`,
			"Content-Type": "application/json"
		},
		body: {
			model: e.model,
			temperature: .2,
			messages: [{
				role: "system",
				content: r
			}, {
				role: "user",
				content: t
			}],
			...(n ? { response_format: n } : {})
		}
	};
}
var cn = class {
	sql;
	db;
	dbPath;
	documentsDir;
	settingsPath;
	baseDir;
	nativePdfInspector;
	searchIndexDependencies;
	constructor(t, n = null, r = {}) {
		this.baseDir = t, this.dbPath = e.join(t, "reader.sqlite"), this.documentsDir = e.join(t, "documents"), this.settingsPath = e.join(t, "settings.json"), this.nativePdfInspector = n, this.searchIndexDependencies = {
			extractPdfSearchChunks: Ot,
			...r
		};
	}
	async init() {
		await f.mkdir(this.baseDir, { recursive: !0 }), await f.mkdir(this.documentsDir, { recursive: !0 }), this.sql = await p();
		let e = await this.safeReadFile(this.dbPath);
		this.db = e ? new this.sql.Database(new Uint8Array(e)) : new this.sql.Database(), this.db.run("\n      CREATE TABLE IF NOT EXISTS documents (\n        id TEXT PRIMARY KEY,\n        title TEXT NOT NULL,\n        format TEXT NOT NULL,\n        checksum TEXT NOT NULL UNIQUE,\n        managed_path TEXT NOT NULL,\n        original_name TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        last_opened_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS reading_positions (\n        document_id TEXT PRIMARY KEY,\n        format TEXT NOT NULL,\n        position_payload_json TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS annotations (\n        id TEXT PRIMARY KEY,\n        document_id TEXT NOT NULL,\n        format TEXT NOT NULL,\n        anchor_type TEXT NOT NULL,\n        anchor_payload_json TEXT NOT NULL,\n        selected_text TEXT NOT NULL,\n        color TEXT NOT NULL,\n        note TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS bookmarks (\n        id TEXT PRIMARY KEY,\n        document_id TEXT NOT NULL,\n        format TEXT NOT NULL,\n        position_payload_json TEXT NOT NULL,\n        title TEXT NOT NULL,\n        note TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS ai_cards (\n        id TEXT PRIMARY KEY,\n        document_id TEXT NOT NULL,\n        annotation_id TEXT,\n        action_type TEXT NOT NULL,\n        title TEXT NOT NULL,\n        body_markdown TEXT NOT NULL,\n        key_points_json TEXT NOT NULL,\n        created_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS reading_events (\n        id TEXT PRIMARY KEY,\n        document_id TEXT,\n        event_type TEXT NOT NULL,\n        payload_json TEXT NOT NULL,\n        created_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS ocr_jobs (\n        id TEXT PRIMARY KEY,\n        document_id TEXT NOT NULL,\n        status TEXT NOT NULL,\n        provider TEXT NOT NULL,\n        result_message TEXT NOT NULL,\n        payload_json TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS document_search_chunks (\n        id TEXT PRIMARY KEY,\n        document_id TEXT NOT NULL,\n        format TEXT NOT NULL,\n        source_type TEXT NOT NULL,\n        anchor_label TEXT NOT NULL,\n        anchor_payload_json TEXT NOT NULL,\n        excerpt TEXT NOT NULL,\n        searchable_text TEXT NOT NULL,\n        normalized_text TEXT NOT NULL,\n        sort_order INTEGER NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS document_index_states (\n        document_id TEXT PRIMARY KEY,\n        format TEXT NOT NULL,\n        status TEXT NOT NULL,\n        error_message TEXT NOT NULL,\n        index_version INTEGER NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS research_chunks (\n        id TEXT PRIMARY KEY,\n        source_type TEXT NOT NULL,\n        source_record_id TEXT NOT NULL,\n        document_id TEXT,\n        title TEXT NOT NULL,\n        excerpt TEXT NOT NULL,\n        content_text TEXT NOT NULL,\n        normalized_text TEXT NOT NULL,\n        jump_kind TEXT NOT NULL,\n        jump_payload_json TEXT NOT NULL,\n        updated_at TEXT NOT NULL,\n        UNIQUE(source_type, source_record_id)\n      );\n\n      CREATE TABLE IF NOT EXISTS research_embeddings (\n        chunk_id TEXT PRIMARY KEY,\n        provider TEXT NOT NULL,\n        model TEXT NOT NULL,\n        vector_json TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS research_snapshots (\n        id TEXT PRIMARY KEY,\n        query_text TEXT NOT NULL,\n        document_id TEXT,\n        source_type TEXT,\n        mode TEXT NOT NULL,\n        result_count INTEGER NOT NULL,\n        answer_title TEXT,\n        answer_body_markdown TEXT,\n        answer_evidence_ids_json TEXT,\n        answer_generated_at TEXT,\n        created_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS research_snapshot_evidences (\n        id TEXT PRIMARY KEY,\n        snapshot_id TEXT NOT NULL,\n        source_type TEXT NOT NULL,\n        document_id TEXT,\n        document_title TEXT NOT NULL,\n        title TEXT NOT NULL,\n        excerpt TEXT NOT NULL,\n        score REAL NOT NULL,\n        jump_kind TEXT NOT NULL,\n        jump_payload_json TEXT NOT NULL,\n        result_order INTEGER NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS notebooks (\n        id TEXT PRIMARY KEY,\n        title TEXT NOT NULL,\n        description TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        updated_at TEXT NOT NULL,\n        last_activity_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS notebook_documents (\n        notebook_id TEXT NOT NULL,\n        document_id TEXT NOT NULL,\n        added_at TEXT NOT NULL,\n        PRIMARY KEY (notebook_id, document_id)\n      );\n\n      CREATE TABLE IF NOT EXISTS notebook_turns (\n        id TEXT PRIMARY KEY,\n        notebook_id TEXT NOT NULL,\n        question_text TEXT NOT NULL,\n        answer_markdown TEXT NOT NULL,\n        answer_status TEXT NOT NULL,\n        mode TEXT NOT NULL,\n        citation_ids_json TEXT NOT NULL,\n        citations_json TEXT NOT NULL,\n        fact_check_json TEXT NOT NULL,\n        error_message TEXT NOT NULL,\n        created_at TEXT NOT NULL\n      );\n\n      CREATE TABLE IF NOT EXISTS notebook_artifacts (\n        id TEXT PRIMARY KEY,\n        notebook_id TEXT NOT NULL,\n        document_id TEXT,\n        artifact_type TEXT NOT NULL,\n        status TEXT NOT NULL,\n        title TEXT NOT NULL,\n        content_markdown TEXT NOT NULL,\n        content_json TEXT,\n        error_message TEXT NOT NULL,\n        created_at TEXT NOT NULL,\n        updated_at TEXT NOT NULL\n      );\n    "), await this.backfillMissingSearchIndexes(), await this.backfillResearchNoteCorpus(), await this.persist();
	}
	async listDocuments() {
		return this.queryAll("SELECT * FROM documents ORDER BY last_opened_at DESC").map(Ut);
	}
	async importDocumentFromPath(t) {
		let n = await f.readFile(t), r = d("sha256").update(n).digest("hex"), i = await this.findDocumentByChecksum(r);
		if (i) return i;
		let a = Nt(e.basename(t));
		if (!a) throw Error("Unsupported format. Only PDF, EPUB, TXT, and MD are supported in v1.");
		let o = e.extname(t) || `.${a}`, s = e.join(this.documentsDir, `${r}${o}`);
		await f.copyFile(t, s);
		let c = G(), l = Pt(await this.listDocuments(), {
			title: e.parse(t).name,
			format: a,
			checksum: r,
			managedPath: s,
			originalName: e.basename(t),
			createdAt: c
		}, () => _());
		if (!l.deduplicated) {
			let e = l.document;
			this.db.run("INSERT INTO documents (id, title, format, checksum, managed_path, original_name, created_at, last_opened_at)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
				e.id,
				e.title,
				e.format,
				e.checksum,
				e.managedPath,
				e.originalName,
				e.createdAt,
				e.lastOpenedAt
			]), l.events.forEach((e) => {
				this.insertTimelineEvent(e);
			}), await this.indexDocumentForSearch(e), await this.persist();
		}
		return l.document;
	}
	async openDocument(e) {
		let t = await this.findDocumentById(e);
		if (!t) throw Error("Document not found.");
		let r = G();
		this.db.run("UPDATE documents SET last_opened_at = ? WHERE id = ?", [r, e]), this.insertTimelineEvent({
			id: _(),
			documentId: e,
			eventType: "document-opened",
			payloadJson: JSON.stringify({}),
			createdAt: r
		}), await this.persist();
		let i = {
			...t,
			lastOpenedAt: r
		}, a = i.format === "txt" || i.format === "md" ? await f.readFile(i.managedPath, "utf8") : void 0, o = i.format === "pdf" && this.nativePdfInspector ? await this.nativePdfInspector.inspectPdf(i.managedPath) : null;
		return {
			document: i,
			sourcePath: i.managedPath,
			sourceUrl: n(i.managedPath).toString(),
			content: a,
			tableOfContents: [],
			readingPosition: await this.getReadingPosition(e),
			annotations: await this.listAnnotationsByDocument(e),
			bookmarks: await this.listBookmarksByDocument(e),
			aiCards: await this.listAiCardsByDocument(e),
			pdfInspection: o,
			ocrJob: await this.getLatestOcrJob(e)
		};
	}
	async renameDocument(e, t) {
		let n = await this.findDocumentById(e);
		if (!n) throw Error("Document not found.");
		let r = t.trim() || n.title;
		return this.db.run("UPDATE documents SET title = ? WHERE id = ?", [r, e]), await this.persist(), {
			...n,
			title: r
		};
	}
	async deleteDocument(e) {
		let t = await this.findDocumentById(e);
		if (!t) throw Error("Document not found.");
		let n = this.queryAll("SELECT notebook_id FROM notebook_documents WHERE document_id = ?", [e]).map((e) => String(e.notebook_id));
		await this.deleteResearchChunksByDocument(e), this.db.run("DELETE FROM notebook_documents WHERE document_id = ?", [e]), this.db.run("DELETE FROM notebook_artifacts WHERE document_id = ?", [e]), this.db.run("DELETE FROM documents WHERE id = ?", [e]), this.db.run("DELETE FROM reading_positions WHERE document_id = ?", [e]), this.db.run("DELETE FROM bookmarks WHERE document_id = ?", [e]), this.db.run("DELETE FROM annotations WHERE document_id = ?", [e]), this.db.run("DELETE FROM ai_cards WHERE document_id = ?", [e]), this.db.run("DELETE FROM ocr_jobs WHERE document_id = ?", [e]), this.db.run("DELETE FROM reading_events WHERE document_id = ?", [e]), this.db.run("DELETE FROM document_search_chunks WHERE document_id = ?", [e]), this.db.run("DELETE FROM document_index_states WHERE document_id = ?", [e]);
		for (let e of n) await this.refreshNotebookAggregateArtifacts(e);
		await this.persist();
		try {
			await f.rm(t.managedPath, { force: !0 });
		} catch {}
	}
	async startOcr(e) {
		let t = await this.findDocumentById(e), n = this.nativePdfInspector;
		if (!t) throw Error("Document not found.");
		if (t.format !== "pdf") throw Error("OCR 目前只支持 PDF 文档。");
		if (!n) throw Error("当前只有疑似扫描版 PDF 才能启动 OCR。");
		let r = await n.inspectPdf(t.managedPath);
		if (!r || r.classification !== "likely-scanned") throw Error("当前只有疑似扫描版 PDF 才能启动 OCR。");
		let i = G(), a = await n.startOcr(t.managedPath), o = {
			id: _(),
			documentId: e,
			status: a.status,
			provider: a.provider,
			resultMessage: a.resultMessage,
			payloadJson: a.payloadJson,
			createdAt: i,
			updatedAt: i
		};
		return this.db.run("INSERT INTO ocr_jobs\n       (id, document_id, status, provider, result_message, payload_json, created_at, updated_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
			o.id,
			o.documentId,
			o.status,
			o.provider,
			o.resultMessage,
			o.payloadJson,
			o.createdAt,
			o.updatedAt
		]), await this.persist(), o;
	}
	async saveReadingPosition(e) {
		let t = G();
		return await this.getReadingPosition(e.documentId) ? this.db.run("UPDATE reading_positions SET format = ?, position_payload_json = ?, updated_at = ? WHERE document_id = ?", [
			e.format,
			e.positionPayloadJson,
			t,
			e.documentId
		]) : this.db.run("INSERT INTO reading_positions (document_id, format, position_payload_json, updated_at) VALUES (?, ?, ?, ?)", [
			e.documentId,
			e.format,
			e.positionPayloadJson,
			t
		]), this.insertTimelineEvent({
			id: _(),
			documentId: e.documentId,
			eventType: "reading-position-saved",
			payloadJson: e.positionPayloadJson,
			createdAt: t
		}), await this.persist(), {
			documentId: e.documentId,
			format: e.format,
			positionPayloadJson: e.positionPayloadJson,
			updatedAt: t
		};
	}
	async listBookmarksByDocument(e) {
		return this.queryAll("SELECT * FROM bookmarks WHERE document_id = ? ORDER BY updated_at DESC", [e]).map(Kt);
	}
	async upsertBookmark(e) {
		let t = G(), n = e.id ? await this.findBookmarkById(e.id) : null;
		if (n) {
			let r = {
				...n,
				positionPayloadJson: e.positionPayloadJson,
				title: e.title.trim(),
				note: e.note?.trim() ?? "",
				updatedAt: t
			};
			return this.db.run("UPDATE bookmarks\n         SET position_payload_json = ?, title = ?, note = ?, updated_at = ?\n         WHERE id = ?", [
				r.positionPayloadJson,
				r.title,
				r.note,
				r.updatedAt,
				r.id
			]), await this.upsertResearchChunk(on(r)), await this.persist(), r;
		}
		let r = It({
			documentId: e.documentId,
			format: e.format,
			positionPayloadJson: e.positionPayloadJson,
			title: e.title,
			note: e.note
		}, () => _(), t);
		return this.db.run("INSERT INTO bookmarks\n       (id, document_id, format, position_payload_json, title, note, created_at, updated_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
			r.id,
			r.documentId,
			r.format,
			r.positionPayloadJson,
			r.title,
			r.note,
			r.createdAt,
			r.updatedAt
		]), await this.upsertResearchChunk(on(r)), await this.persist(), r;
	}
	async deleteBookmark(e) {
		this.db.run("DELETE FROM bookmarks WHERE id = ?", [e]), await this.deleteResearchChunkBySource("bookmark", e), await this.persist();
	}
	async listAnnotationsByDocument(e) {
		return this.listAnnotations({ documentId: e });
	}
	async listAnnotations(e = {}) {
		return this.queryAll("SELECT * FROM annotations ORDER BY updated_at DESC").map(Wt).filter((t) => {
			let n = !e.documentId || t.documentId === e.documentId, r = !e.color || t.color === e.color;
			return n && r;
		});
	}
	async upsertAnnotation(e) {
		let t = G(), n = e.id ? await this.findAnnotationById(e.id) : null;
		if (n) {
			let r = {
				...n,
				selectedText: e.selectedText,
				color: e.color,
				note: e.note ?? "",
				anchorPayloadJson: JSON.stringify(e.anchorPayload),
				updatedAt: t
			};
			return this.db.run("UPDATE annotations\n         SET selected_text = ?, color = ?, note = ?, anchor_payload_json = ?, updated_at = ?\n         WHERE id = ?", [
				r.selectedText,
				r.color,
				r.note,
				r.anchorPayloadJson,
				r.updatedAt,
				r.id
			]), await this.upsertResearchChunk(an(r)), await this.persist(), r;
		}
		let r = Ft({
			documentId: e.documentId,
			format: e.format,
			anchorType: e.anchorType,
			anchorPayload: e.anchorPayload,
			selectedText: e.selectedText,
			note: e.note
		}, () => _(), t, e.color);
		return this.db.run("INSERT INTO annotations\n       (id, document_id, format, anchor_type, anchor_payload_json, selected_text, color, note, created_at, updated_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			r.id,
			r.documentId,
			r.format,
			r.anchorType,
			r.anchorPayloadJson,
			r.selectedText,
			r.color,
			r.note,
			r.createdAt,
			r.updatedAt
		]), this.insertTimelineEvent({
			id: _(),
			documentId: r.documentId,
			eventType: "annotation-created",
			payloadJson: JSON.stringify({ annotationId: r.id }),
			createdAt: t
		}), await this.upsertResearchChunk(an(r)), await this.persist(), r;
	}
	async deleteAnnotation(e) {
		let t = await this.findAnnotationById(e);
		this.db.run("DELETE FROM annotations WHERE id = ?", [e]), await this.deleteResearchChunkBySource("annotation", e), t && this.insertTimelineEvent({
			id: _(),
			documentId: t.documentId,
			eventType: "annotation-deleted",
			payloadJson: JSON.stringify({ annotationId: e }),
			createdAt: G()
		}), await this.persist();
	}
	async interpretSelection(e) {
		let t = await this.getSettings(), n = zt(Rt(t), {
			actionType: e.actionType,
			documentTitle: e.documentTitle,
			format: e.format,
			selectionText: e.selectionText,
			contextBefore: e.contextBefore,
			contextAfter: e.contextAfter
		}), r = await fetch(n.endpoint, {
			method: "POST",
			headers: n.headers,
			body: JSON.stringify(n.body)
		});
		if (!r.ok) throw Error(`AI provider returned ${r.status}.`);
		let i = Qt(await r.json()), a = G(), o = {
			id: _(),
			documentId: e.documentId,
			annotationId: e.annotationId,
			actionType: e.actionType,
			title: `${e.actionType} · ${e.selectionText.slice(0, 32)}`,
			bodyMarkdown: i,
			keyPointsJson: JSON.stringify($t(i)),
			createdAt: a
		};
		return this.db.run("INSERT INTO ai_cards\n       (id, document_id, annotation_id, action_type, title, body_markdown, key_points_json, created_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
			o.id,
			o.documentId,
			o.annotationId ?? null,
			o.actionType,
			o.title,
			o.bodyMarkdown,
			o.keyPointsJson,
			o.createdAt
		]), this.insertTimelineEvent({
			id: _(),
			documentId: e.documentId,
			eventType: "ai-card-created",
			payloadJson: JSON.stringify({
				aiCardId: o.id,
				actionType: o.actionType
			}),
			createdAt: a
		}), await this.upsertResearchChunk(sn(o)), await this.persist(), o;
	}
	async listAiCards(e = {}) {
		return this.queryAll("SELECT * FROM ai_cards ORDER BY created_at DESC").map(qt).filter((t) => {
			let n = !e.documentId || t.documentId === e.documentId, r = !e.actionType || t.actionType === e.actionType;
			return n && r;
		});
	}
	async listTimeline(e = {}) {
		return Bt(this.queryAll("SELECT * FROM reading_events ORDER BY created_at DESC").map(Jt), e);
	}
	async exportReviewMarkdown(e = {}) {
		return Ht({
			documents: await this.listDocuments(),
			annotations: await this.listAnnotations({
				documentId: e.documentId,
				color: e.color
			}),
			aiCards: await this.listAiCards({
				documentId: e.documentId,
				actionType: e.actionType
			}),
			filters: e
		});
	}
	async queryLibrarySearch(e) {
		let t = jt(e.query), n = await this.listDocuments(), r = new Map(n.map((e) => [e.id, e])), i = await this.listDocumentIndexStates(e.format);
		if (!t) return {
			query: e.query,
			results: [],
			indexedDocumentCount: i.filter((e) => e.status === "indexed").length,
			unsupportedDocuments: i.filter((e) => e.status === "unsupported"),
			failedDocuments: i.filter((e) => e.status === "failed")
		};
		let a = e.matchKind === "content" ? [] : n.filter((n) => !e.format || n.format === e.format ? n.title.toLowerCase().includes(t) || n.originalName.toLowerCase().includes(t) : !1).map((e) => ({
			id: `title-${e.id}`,
			documentId: e.id,
			documentTitle: e.title,
			format: e.format,
			matchKind: "title",
			excerpt: e.originalName,
			positionPayloadJson: null,
			anchorLabel: "标题"
		})), o = [];
		return e.matchKind !== "title" && this.queryAll(`SELECT * FROM document_search_chunks
         WHERE normalized_text LIKE ?
         ${e.format ? "AND format = ?" : ""}
         ORDER BY document_id ASC, sort_order ASC`, e.format ? [`%${t}%`, e.format] : [`%${t}%`]).forEach((e) => {
			let n = r.get(String(e.document_id));
			n && o.push({
				id: String(e.id),
				documentId: n.id,
				documentTitle: n.title,
				format: e.format,
				matchKind: "content",
				excerpt: At(String(e.searchable_text), t),
				positionPayloadJson: String(e.anchor_payload_json),
				anchorLabel: String(e.anchor_label)
			});
		}), {
			query: e.query,
			results: [...a, ...o],
			indexedDocumentCount: i.filter((e) => e.status === "indexed").length,
			unsupportedDocuments: i.filter((e) => e.status === "unsupported"),
			failedDocuments: i.filter((e) => e.status === "failed")
		};
	}
	async listSearchIndexStates() {
		return this.listDocumentIndexStates();
	}
	async rebuildDocumentSearchIndex(e) {
		let t = await this.findDocumentById(e);
		if (!t) throw Error("Document not found.");
		if (!Mt(t.format)) throw Error("当前文档格式不支持手动重建内容索引。");
		if (!(await this.findDocumentIndexState(e))?.canRebuild) throw Error("当前文档的索引状态不支持手动重建。");
		await this.indexDocumentForSearch(t), await this.persist();
		let n = await this.findDocumentIndexState(e);
		if (!n) throw Error("索引重建后未找到最新状态。");
		return n;
	}
	async getResearchStatus() {
		let e = await this.getSettings(), t = Number(this.queryAll("SELECT COUNT(*) AS total FROM research_chunks WHERE source_type IN ('annotation', 'bookmark', 'ai_card')")[0]?.total ?? 0), n = Number(this.queryAll("SELECT COUNT(*) AS total FROM research_chunks WHERE source_type = 'document_chunk'")[0]?.total ?? 0), r = Number(this.queryAll("SELECT COUNT(*) AS total FROM research_embeddings")[0]?.total ?? 0), i = Number(this.queryAll("SELECT COUNT(*) AS total\n         FROM document_search_chunks c\n         JOIN documents d ON d.id = c.document_id\n         JOIN document_index_states s ON s.document_id = c.document_id\n         LEFT JOIN research_chunks r\n           ON r.source_type = 'document_chunk'\n          AND r.source_record_id = c.id\n         WHERE d.format IN ('pdf', 'txt', 'md')\n           AND s.status = 'indexed'\n           AND r.id IS NULL")[0]?.total ?? 0), a = this.queryAll("SELECT MAX(updated_at) AS value FROM research_chunks WHERE source_type = 'document_chunk'")[0]?.value;
		return {
			noteChunkCount: t,
			documentChunkCount: n,
			embeddedChunkCount: r,
			pendingDocumentChunkCount: i,
			lastDocumentSyncAt: a ? String(a) : null,
			providerPresetId: e.providerPresetId ?? W.providerPresetId,
			providerMode: e.mode,
			chatConfigured: rn(e),
			embeddingConfigured: q(e),
			canRunSemanticSearch: q(e)
		};
	}
	async syncDocumentCorpus() {
		let e = this.queryAll("SELECT id FROM research_chunks WHERE source_type = 'document_chunk'").map((e) => String(e.id));
		if (e.length > 0) {
			let t = e.map(() => "?").join(", ");
			this.db.run(`DELETE FROM research_embeddings WHERE chunk_id IN (${t})`, e);
		}
		this.db.run("DELETE FROM research_chunks WHERE source_type = 'document_chunk'");
		let t = this.queryAll("SELECT c.id, c.document_id, c.anchor_label, c.anchor_payload_json, c.excerpt, c.searchable_text\n       FROM document_search_chunks c\n       JOIN documents d ON d.id = c.document_id\n       JOIN document_index_states s ON s.document_id = c.document_id\n       WHERE d.format IN ('pdf', 'txt', 'md')\n         AND s.status = 'indexed'\n       ORDER BY c.document_id ASC, c.sort_order ASC"), n = t.map((e) => ({
			chunkId: _(),
			contentText: String(e.searchable_text)
		}));
		t.forEach((e, t) => {
			let r = n[t]?.chunkId ?? _(), i = n[t]?.contentText ?? "";
			this.db.run("INSERT INTO research_chunks\n         (id, source_type, source_record_id, document_id, title, excerpt, content_text, normalized_text, jump_kind, jump_payload_json, updated_at)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
				r,
				"document_chunk",
				String(e.id),
				String(e.document_id),
				String(e.anchor_label),
				String(e.excerpt),
				i,
				K(`${e.anchor_label} ${i}`),
				"position",
				String(e.anchor_payload_json),
				G()
			]);
		});
		let r = await this.getSettings();
		if (q(r) && n.length > 0) {
			let e = await this.generateEmbeddings(r, n.map((e) => e.contentText));
			n.forEach((t, n) => {
				this.upsertResearchEmbedding(t.chunkId, r, e[n] ?? []);
			});
		}
		return await this.persist(), this.getResearchStatus();
	}
	async queryResearch(e) {
		let t = await this.getResearchStatus(), n = K(e.query);
		if (!n) return {
			query: e.query,
			mode: "lexical",
			results: [],
			answer: null,
			snapshotId: null,
			status: t
		};
		let r = await this.getSettings(), i = "lexical", a = [];
		if (q(r) && t.embeddedChunkCount > 0) try {
			a = await this.queryResearchSemantic(n, e, r), a.length > 0 ? i = "semantic" : a = await this.queryResearchLexical(n, e);
		} catch {
			a = await this.queryResearchLexical(n, e);
		}
		else a = await this.queryResearchLexical(n, e);
		let o = e.includeAnswer && rn(r) ? await this.generateResearchAnswer(e.query.trim(), a, r) : null, s = await this.createResearchSnapshot({
			query: e.query.trim(),
			documentId: e.documentId,
			sourceType: e.sourceType,
			mode: i,
			results: a,
			answer: o
		});
		return await this.persist(), {
			query: e.query,
			mode: i,
			results: a,
			answer: o,
			snapshotId: s,
			status: await this.getResearchStatus()
		};
	}
	async listResearchSnapshots(e = {}) {
		return this.queryAll("SELECT * FROM research_snapshots\n       ORDER BY created_at DESC").map(Zt).filter((t) => {
			let n = !e.documentId || t.documentId === e.documentId, r = !e.sourceType || t.sourceType === e.sourceType;
			return n && r;
		});
	}
	async getResearchSnapshot(e) {
		let t = this.queryAll("SELECT * FROM research_snapshots WHERE id = ? LIMIT 1", [e])[0];
		if (!t) throw Error("Research snapshot not found.");
		let n = Zt(t);
		return {
			snapshot: n,
			answer: t.answer_body_markdown ? {
				title: String(t.answer_title ?? n.query),
				bodyMarkdown: String(t.answer_body_markdown),
				evidenceIds: (() => {
					try {
						return JSON.parse(String(t.answer_evidence_ids_json ?? "[]"));
					} catch {
						return [];
					}
				})(),
				generatedAt: String(t.answer_generated_at ?? n.createdAt)
			} : null,
			evidences: this.queryAll("SELECT * FROM research_snapshot_evidences\n       WHERE snapshot_id = ?\n       ORDER BY result_order ASC", [e]).map((e) => this.toResearchSnapshotEvidenceRecord(e))
		};
	}
	async deleteResearchSnapshot(e) {
		this.db.run("DELETE FROM research_snapshot_evidences WHERE snapshot_id = ?", [e]), this.db.run("DELETE FROM research_snapshots WHERE id = ?", [e]), await this.persist();
	}
	async listNotebooks() {
		let e = this.queryAll("SELECT * FROM notebooks ORDER BY last_activity_at DESC");
		return e.map((e) => {
			let t = Number(this.queryAll("SELECT COUNT(*) AS total FROM notebook_documents WHERE notebook_id = ?", [e.id])[0]?.total ?? 0), n = gn2(this.queryAll("SELECT * FROM notebook_artifacts WHERE notebook_id = ?", [e.id]).map(fn2));
			return un2(e, {
				documentCount: t,
				readyCount: n.ready,
				failedCount: n.failed,
				unavailableCount: n.unavailable,
				generatingCount: n.generating
			});
		});
	}
	async createNotebook(e = {}) {
		let t = G(), n = {
			id: _(),
			title: e.title?.trim() || "未命名笔记本",
			description: e.description?.trim() ?? "",
			createdAt: t,
			updatedAt: t,
			lastActivityAt: t
		};
		return this.db.run("INSERT INTO notebooks (id, title, description, created_at, updated_at, last_activity_at)\n       VALUES (?, ?, ?, ?, ?, ?)", [
			n.id,
			n.title,
			n.description,
			n.createdAt,
			n.updatedAt,
			n.lastActivityAt
		]), await this.persist(), this.getNotebook(n.id);
	}
	async updateNotebook(e, t = {}) {
		let n = await this.findNotebookById(e);
		if (!n) throw Error("Notebook not found.");
		let r = G();
		return this.db.run("UPDATE notebooks SET title = ?, description = ?, updated_at = ?, last_activity_at = ? WHERE id = ?", [
			t.title?.trim() || n.title,
			typeof t.description == "string" ? t.description.trim() : n.description,
			r,
			r,
			e
		]), await this.refreshNotebookAggregateArtifacts(e), await this.persist(), this.getNotebook(e);
	}
	async deleteNotebook(e) {
		let t = await this.findNotebookById(e);
		if (!t) throw Error("Notebook not found.");
		this.db.run("DELETE FROM notebook_documents WHERE notebook_id = ?", [e]), this.db.run("DELETE FROM notebook_turns WHERE notebook_id = ?", [e]), this.db.run("DELETE FROM notebook_artifacts WHERE notebook_id = ?", [e]), this.db.run("DELETE FROM notebooks WHERE id = ?", [e]), await this.persist();
	}
	async getNotebook(e) {
		let t = await this.findNotebookById(e);
		if (!t) throw Error("Notebook not found.");
		return {
			notebook: t,
			documents: await this.listNotebookDocuments(e),
			artifacts: await this.listNotebookArtifacts(e),
			turns: await this.listNotebookTurns(e)
		};
	}
	async addDocumentsToNotebook(e, t = []) {
		let n = await this.findNotebookById(e);
		if (!n) throw Error("Notebook not found.");
		let r = G();
		for (let n of t) {
			let t = await this.findDocumentById(n);
			if (!t) continue;
			this.db.run("INSERT OR IGNORE INTO notebook_documents (notebook_id, document_id, added_at) VALUES (?, ?, ?)", [
				e,
				n,
				r
			]);
			for (let r of ["doc_summary", "doc_outline"]) await this.generateNotebookArtifact({
				notebookId: e,
				artifactType: r,
				documentId: n
			});
		}
		return await this.refreshNotebookAggregateArtifacts(e), await this.touchNotebook(e), await this.persist(), this.getNotebook(e);
	}
	async removeDocumentFromNotebook(e, t) {
		let n = await this.findNotebookById(e);
		if (!n) throw Error("Notebook not found.");
		return this.db.run("DELETE FROM notebook_documents WHERE notebook_id = ? AND document_id = ?", [e, t]), this.db.run("DELETE FROM notebook_artifacts WHERE notebook_id = ? AND document_id = ?", [
			e,
			t
		]), await this.refreshNotebookAggregateArtifacts(e), await this.touchNotebook(e), await this.persist(), this.getNotebook(e);
	}
	async askNotebook(e) {
		let t = await this.findNotebookById(e.notebookId);
		if (!t) throw Error("Notebook not found.");
		let n = await this.listNotebookDocuments(e.notebookId), r = e.query.trim();
		if (!r) throw Error("请先输入研究问题。");
		if (n.length === 0) {
			let e = await this.createNotebookTurn({
				notebookId: t.id,
				questionText: r,
				answerMarkdown: "",
				answerStatus: "unavailable",
				mode: "lexical",
				citations: [],
				factChecks: [],
				errorMessage: "先把至少一份资料加入笔记本，再发起多文档研究。"
			});
			return await this.persist(), e;
		}
		await this.syncDocumentCorpus();
		let i = n.map((e) => e.id), a = await this.getSettings(), o = "lexical", s = [];
		if (q(a) && (await this.getResearchStatus()).embeddedChunkCount > 0) try {
			s = await this.queryResearchSemantic(K(r), { documentIds: i }, a), s.length > 0 ? o = "semantic" : s = await this.queryResearchLexical(K(r), { documentIds: i });
		} catch {
			s = await this.queryResearchLexical(K(r), { documentIds: i });
		}
		else s = await this.queryResearchLexical(K(r), { documentIds: i });
		let c = s.slice(0, 8).map(_n2), l = c.map((e) => e.evidenceId), u = "", d = "unavailable", f = "", p = [];
		if (c.length === 0) f = "当前笔记本里还没有可用证据，请先确认文档已完成全文索引或添加更多资料。";
		else if (!rn(a)) p = vn2("", c), f = "当前按基础证据检索返回结果。请先在 AI 设置中填写 API Key，才能生成多文档综合回答。";
		else try {
			let e = c.map((e, t) => `Evidence ${t + 1}\nDocument: ${e.documentTitle}\nTitle: ${e.title}\nExcerpt: ${e.excerpt}`).join("\n\n"), n = await fetch(`${a.baseUrl?.replace(/\/+$/, "")}/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${a.apiKey ?? ""}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: a.model,
					temperature: .2,
					messages: [{
						role: "system",
						content: "You are a notebook research assistant. Answer only from the provided evidence. Return JSON with keys answer_markdown and fact_checks. Each fact check must contain claim, status (supported|mixed|needs-review), and evidenceIds."
					}, {
						role: "user",
						content: `Notebook: ${t.title}\nQuestion: ${r}\n\nEvidence:\n${e}`
					}]
				})
			});
			if (!n.ok) throw Error(`AI provider returned ${n.status}.`);
			let i = Qt(await n.json()), s = yn2(i);
			u = s?.answer_markdown ? String(s.answer_markdown) : i, p = Array.isArray(s?.fact_checks) ? s.fact_checks.map((e) => ({
				claim: String(e.claim ?? ""),
				status: e.status === "mixed" || e.status === "needs-review" ? e.status : "supported",
				evidenceIds: Array.isArray(e.evidenceIds) ? e.evidenceIds.map((e) => String(e)) : l.slice(0, 2)
			})).filter((e) => e.claim.trim()) : vn2(u, c), d = "ready";
		} catch (e) {
			p = vn2("", c), d = "failed", f = ln2(e, "生成多文档综合回答失败。");
		}
		let m = await this.createNotebookTurn({
			notebookId: t.id,
			questionText: r,
			answerMarkdown: u,
			answerStatus: d,
			mode: o,
			citations: c,
			factChecks: p,
			errorMessage: f
		});
		return await this.touchNotebook(t.id), await this.persist(), m;
	}
	async listNotebookTurns(e) {
		return this.queryAll("SELECT * FROM notebook_turns WHERE notebook_id = ? ORDER BY created_at DESC", [e]).map((e) => mn2(e, this));
	}
	async retryNotebookArtifact(e) {
		let t = await this.findNotebookById(e.notebookId);
		if (!t) throw Error("Notebook not found.");
		return await this.generateNotebookArtifact(e), await this.persist(), this.getNotebook(e.notebookId);
	}
	async findNotebookById(e) {
		let t = this.queryAll("SELECT * FROM notebooks WHERE id = ? LIMIT 1", [e])[0];
		if (!t) return null;
		let n = Number(this.queryAll("SELECT COUNT(*) AS total FROM notebook_documents WHERE notebook_id = ?", [e])[0]?.total ?? 0), r = gn2(this.queryAll("SELECT * FROM notebook_artifacts WHERE notebook_id = ?", [e]).map(fn2));
		return un2(t, {
			documentCount: n,
			readyCount: r.ready,
			failedCount: r.failed,
			unavailableCount: r.unavailable,
			generatingCount: r.generating
		});
	}
	async listNotebookDocuments(e) {
		return this.queryAll("SELECT d.*, nd.added_at AS notebook_added_at\n       FROM notebook_documents nd\n       JOIN documents d ON d.id = nd.document_id\n       WHERE nd.notebook_id = ?\n       ORDER BY nd.added_at ASC", [e]).map((e) => ({
			...Ut(e),
			addedAt: String(e.notebook_added_at)
		}));
	}
	async listNotebookArtifacts(e) {
		return this.queryAll("SELECT * FROM notebook_artifacts WHERE notebook_id = ? ORDER BY updated_at DESC, artifact_type ASC", [e]).map(fn2);
	}
	async touchNotebook(e) {
		let t = G();
		this.db.run("UPDATE notebooks SET updated_at = ?, last_activity_at = ? WHERE id = ?", [
			t,
			t,
			e
		]);
	}
	async createNotebookTurn(e) {
		let t = {
			id: _(),
			notebookId: e.notebookId,
			questionText: e.questionText,
			answerMarkdown: e.answerMarkdown ?? "",
			answerStatus: e.answerStatus,
			mode: e.mode,
			citationIdsJson: JSON.stringify(e.citations.map((e) => e.evidenceId)),
			citationsJson: JSON.stringify(e.citations),
			factCheckJson: JSON.stringify(e.factChecks),
			errorMessage: e.errorMessage ?? "",
			createdAt: G()
		};
		return this.db.run("INSERT INTO notebook_turns\n       (id, notebook_id, question_text, answer_markdown, answer_status, mode, citation_ids_json, citations_json, fact_check_json, error_message, created_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			t.id,
			t.notebookId,
			t.questionText,
			t.answerMarkdown,
			t.answerStatus,
			t.mode,
			t.citationIdsJson,
			t.citationsJson,
			t.factCheckJson,
			t.errorMessage,
			t.createdAt
		]), mn2({
			id: t.id,
			notebook_id: t.notebookId,
			question_text: t.questionText,
			answer_markdown: t.answerMarkdown,
			answer_status: t.answerStatus,
			mode: t.mode,
			citation_ids_json: t.citationIdsJson,
			citations_json: t.citationsJson,
			fact_check_json: t.factCheckJson,
			error_message: t.errorMessage,
			created_at: t.createdAt
		}, this);
	}
	async upsertNotebookArtifact(e) {
		let t = this.queryAll("SELECT * FROM notebook_artifacts WHERE notebook_id = ? AND artifact_type = ? AND COALESCE(document_id, '') = ? LIMIT 1", [
			e.notebookId,
			e.artifactType,
			e.documentId ?? ""
		])[0], n = G();
		if (t) return this.db.run("UPDATE notebook_artifacts\n         SET status = ?, title = ?, content_markdown = ?, content_json = ?, error_message = ?, updated_at = ?\n         WHERE id = ?", [
			e.status,
			e.title,
			e.contentMarkdown ?? "",
			e.contentJson ? JSON.stringify(e.contentJson) : null,
			e.errorMessage ?? "",
			n,
			t.id
		]), fn2({
			...t,
			status: e.status,
			title: e.title,
			content_markdown: e.contentMarkdown ?? "",
			content_json: e.contentJson ? JSON.stringify(e.contentJson) : null,
			error_message: e.errorMessage ?? "",
			updated_at: n
		});
		let r = {
			id: _(),
			notebook_id: e.notebookId,
			document_id: e.documentId ?? null,
			artifact_type: e.artifactType,
			status: e.status,
			title: e.title,
			content_markdown: e.contentMarkdown ?? "",
			content_json: e.contentJson ? JSON.stringify(e.contentJson) : null,
			error_message: e.errorMessage ?? "",
			created_at: n,
			updated_at: n
		};
		return this.db.run("INSERT INTO notebook_artifacts\n       (id, notebook_id, document_id, artifact_type, status, title, content_markdown, content_json, error_message, created_at, updated_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			r.id,
			r.notebook_id,
			r.document_id,
			r.artifact_type,
			r.status,
			r.title,
			r.content_markdown,
			r.content_json,
			r.error_message,
			r.created_at,
			r.updated_at
		]), fn2(r);
	}
	async buildNotebookArtifactInput(e) {
		let t = await this.findNotebookById(e.notebookId);
		if (!t) throw Error("Notebook not found.");
		if (e.documentId) {
			let n = await this.findDocumentById(e.documentId);
			if (!n) throw Error("Document not found.");
			if (n.format === "epub") return {
				status: "unavailable",
				title: hn2(e.artifactType, n.title, t.title),
				errorMessage: "EPUB 当前还不能自动生成摘要或关键概念，因为它未纳入全文索引。"
			};
			let r = this.queryAll("SELECT id, anchor_label, searchable_text\n         FROM document_search_chunks\n         WHERE document_id = ?\n         ORDER BY sort_order ASC", [e.documentId]);
			if (r.length === 0) return {
				status: "unavailable",
				title: hn2(e.artifactType, n.title, t.title),
				errorMessage: "当前文档还没有可用的索引内容，请先确认它已经完成全文索引。"
			};
			return {
				status: "ready",
				title: hn2(e.artifactType, n.title, t.title),
				notebookTitle: t.title,
				documentTitle: n.title,
				documentIds: [n.id],
				evidenceIds: r.slice(0, 6).map((e) => String(e.id)),
				sourceText: r.map((e) => `${e.anchor_label}\n${e.searchable_text}`).join("\n\n").slice(0, 12e3)
			};
		}
		let n = await this.listNotebookDocuments(e.notebookId);
		if (n.length === 0) return {
			status: "unavailable",
			title: hn2(e.artifactType, "", t.title),
			errorMessage: "先把至少一份资料加入笔记本，再生成主题总览。"
		};
		let r = [], i = [];
		for (let e of n) {
			if (e.format === "epub") continue;
			let t = this.queryAll("SELECT id, anchor_label, searchable_text\n         FROM document_search_chunks\n         WHERE document_id = ?\n         ORDER BY sort_order ASC", [e.id]);
			t.length > 0 && (r.push(`# ${e.title}\n${t.map((e) => `${e.anchor_label}\n${e.searchable_text}`).join("\n\n")}`), i.push(...t.slice(0, 3).map((e) => String(e.id))));
		}
		return r.length === 0 ? {
			status: "unavailable",
			title: hn2(e.artifactType, "", t.title),
			errorMessage: "当前笔记本里还没有可用于自动生成的全文索引内容。"
		} : {
			status: "ready",
			title: hn2(e.artifactType, "", t.title),
			notebookTitle: t.title,
			documentIds: n.map((e) => e.id),
			evidenceIds: i.slice(0, 8),
			sourceText: r.join("\n\n").slice(0, 16e3)
		};
	}
	async generateNotebookArtifact(e) {
		let t = await this.buildNotebookArtifactInput(e), n = await this.findNotebookById(e.notebookId), r = t.title;
		if (!n) throw Error("Notebook not found.");
		if (t.status !== "ready") return this.upsertNotebookArtifact({
			notebookId: e.notebookId,
			documentId: e.documentId,
			artifactType: e.artifactType,
			status: "unavailable",
			title: r,
			errorMessage: t.errorMessage ?? "当前还不能生成自动摘要或关键概念。"
		});
		let i = await this.getSettings(), a = validateAiChatSettings(i);
		if (a) return this.upsertNotebookArtifact({
			notebookId: e.notebookId,
			documentId: e.documentId,
			artifactType: e.artifactType,
			status: "unavailable",
			title: r,
			errorMessage: a.message
		});
		await this.upsertNotebookArtifact({
			notebookId: e.notebookId,
			documentId: e.documentId,
			artifactType: e.artifactType,
			status: "generating",
			title: r,
			errorMessage: ""
		});
		try {
			let a = e.artifactType === "doc_summary" ? "请用中文生成简洁摘要，包含一段摘要和 3-5 条关键要点。" : e.artifactType === "doc_outline" ? "请用中文整理结构化提纲，按标题和要点输出 Markdown。" : e.artifactType === "notebook_overview" ? "请基于全部资料生成主题总览，总结主题、共识与差异。" : "请输出 JSON，结构为 {\"concepts\":[{\"term\":\"概念\",\"explanation\":\"解释\"}] }。", o = e.artifactType === "key_concepts" ? "json text" : "markdown", s = await fetch(`${i.baseUrl?.replace(/\/+$/, "")}/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${i.apiKey ?? ""}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: i.model,
					temperature: .2,
					messages: [{
						role: "system",
						content: "You are a notebook artifact assistant. Use only the provided source."
					}, {
						role: "user",
						content: xn2(t.notebookTitle ?? n.title, t.documentTitle ?? "", a, o, t.sourceText)
					}]
				})
			});
			if (!s.ok) throw Error(`AI provider returned ${s.status}.`);
			let c = Qt(await s.json());
			if (e.artifactType === "key_concepts") {
				let n = yn2(c), a = bn2(n?.concepts ?? n, t.evidenceIds ?? [], t.documentIds ?? []);
				return this.upsertNotebookArtifact({
					notebookId: e.notebookId,
					documentId: e.documentId,
					artifactType: e.artifactType,
					status: "ready",
					title: r,
					contentMarkdown: a.map((e) => `- **${e.term}**：${e.explanation}`).join("\n"),
					contentJson: a,
					errorMessage: ""
				});
			}
			return this.upsertNotebookArtifact({
				notebookId: e.notebookId,
				documentId: e.documentId,
				artifactType: e.artifactType,
				status: "ready",
				title: r,
				contentMarkdown: c,
				errorMessage: ""
			});
		} catch (t) {
			return this.upsertNotebookArtifact({
				notebookId: e.notebookId,
				documentId: e.documentId,
				artifactType: e.artifactType,
				status: "failed",
				title: r,
				errorMessage: ln2(t, "自动生成失败，请稍后重试。")
			});
		}
	}
	async refreshNotebookAggregateArtifacts(e) {
		for (let t of ["notebook_overview", "key_concepts"]) await this.generateNotebookArtifact({
			notebookId: e,
			artifactType: t
		});
	}
	async getSettings() {
		let e = await this.safeReadFile(this.settingsPath);
		if (!e) return W;
		try {
			return normalizeAiSettings(JSON.parse(e.toString("utf8")));
		} catch {
			return W;
		}
	}
	async saveSettings(e) {
		let t = normalizeAiSettings(e);
		return await f.writeFile(this.settingsPath, JSON.stringify(t, null, 2), "utf8"), t;
	}
	queryAll(e, t = []) {
		let n = this.db.prepare(e);
		n.bind(t);
		let r = [];
		for (; n.step();) r.push(n.getAsObject());
		return n.free(), r;
	}
	async safeReadFile(e) {
		try {
			return await f.readFile(e);
		} catch {
			return null;
		}
	}
	async persist() {
		let e = this.db.export();
		await f.writeFile(this.dbPath, Buffer.from(e));
	}
	async backfillMissingSearchIndexes() {
		let e = await this.listDocuments();
		for (let t of e) await this.findDocumentIndexState(t.id) || await this.indexDocumentForSearch(t);
	}
	async backfillResearchNoteCorpus() {
		let e = this.queryAll("SELECT * FROM annotations ORDER BY updated_at DESC").map(Wt), t = this.queryAll("SELECT * FROM bookmarks ORDER BY updated_at DESC").map(Kt), n = this.queryAll("SELECT * FROM ai_cards ORDER BY created_at DESC").map(qt);
		for (let t of e) await this.upsertResearchChunk(an(t), !1);
		for (let e of t) await this.upsertResearchChunk(on(e), !1);
		for (let e of n) await this.upsertResearchChunk(sn(e), !1);
	}
	async upsertResearchChunk(e, t = !0) {
		let n = this.queryAll("SELECT id FROM research_chunks WHERE source_type = ? AND source_record_id = ? LIMIT 1", [e.sourceType, e.sourceRecordId])[0], r = n ? String(n.id) : _();
		if (n ? this.db.run("UPDATE research_chunks\n         SET document_id = ?, title = ?, excerpt = ?, content_text = ?, normalized_text = ?, jump_kind = ?, jump_payload_json = ?, updated_at = ?\n         WHERE id = ?", [
			e.documentId ?? null,
			e.title,
			e.excerpt,
			e.contentText,
			K(`${e.title} ${e.contentText}`),
			e.jumpKind,
			e.jumpPayloadJson,
			e.updatedAt,
			r
		]) : this.db.run("INSERT INTO research_chunks\n         (id, source_type, source_record_id, document_id, title, excerpt, content_text, normalized_text, jump_kind, jump_payload_json, updated_at)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			r,
			e.sourceType,
			e.sourceRecordId,
			e.documentId ?? null,
			e.title,
			e.excerpt,
			e.contentText,
			K(`${e.title} ${e.contentText}`),
			e.jumpKind,
			e.jumpPayloadJson,
			e.updatedAt
		]), !t) return r;
		let i = await this.getSettings();
		if (q(i)) {
			let [t] = await this.generateEmbeddings(i, [e.contentText]);
			this.upsertResearchEmbedding(r, i, t ?? []);
		} else this.db.run("DELETE FROM research_embeddings WHERE chunk_id = ?", [r]);
		return r;
	}
	async deleteResearchChunkBySource(e, t) {
		let n = this.queryAll("SELECT id FROM research_chunks WHERE source_type = ? AND source_record_id = ? LIMIT 1", [e, t])[0];
		if (!n) return;
		let r = String(n.id);
		this.db.run("DELETE FROM research_embeddings WHERE chunk_id = ?", [r]), this.db.run("DELETE FROM research_chunks WHERE id = ?", [r]);
	}
	async deleteResearchChunksByDocument(e) {
		let t = this.queryAll("SELECT id FROM research_chunks WHERE document_id = ?", [e]).map((e) => String(e.id));
		if (t.length === 0) return;
		let n = t.map(() => "?").join(", ");
		this.db.run(`DELETE FROM research_embeddings WHERE chunk_id IN (${n})`, t), this.db.run(`DELETE FROM research_chunks WHERE id IN (${n})`, t);
	}
	upsertResearchEmbedding(e, t, n) {
		this.db.run("DELETE FROM research_embeddings WHERE chunk_id = ?", [e]), this.db.run("INSERT INTO research_embeddings\n       (chunk_id, provider, model, vector_json, updated_at)\n       VALUES (?, ?, ?, ?, ?)", [
			e,
			t.mode,
			t.embeddingModel ?? "",
			JSON.stringify(n),
			G()
		]);
	}
	async generateEmbeddings(e, t) {
		let n = await fetch(`${e.baseUrl?.replace(/\/+$/, "")}/embeddings`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${e.apiKey ?? ""}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: e.embeddingModel,
				input: t
			})
		});
		if (!n.ok) throw Error(`Embedding provider returned ${n.status}.`);
		let r = await n.json(), i = Array.isArray(r.data) ? r.data.map((e) => e?.embedding) : [];
		if (i.length !== t.length) throw Error("Embedding provider returned an unexpected vector count.");
		return i;
	}
	async queryResearchLexical(e, t) {
		let n = (n) => this.queryAll("SELECT r.id, r.source_type, r.document_id, r.title, r.excerpt, r.content_text, r.jump_kind, r.jump_payload_json, r.updated_at,\n              d.title AS document_title\n       FROM research_chunks r\n       LEFT JOIN documents d ON d.id = r.document_id\n       WHERE r.normalized_text LIKE ?\n       ORDER BY r.updated_at DESC", [`%${n}%`]).filter((e) => {
			let n = !t.documentId || String(e.document_id ?? "") === t.documentId, r = !t.sourceType || String(e.source_type) === t.sourceType, i = !Array.isArray(t.documentIds) || t.documentIds.length === 0 || e.document_id && t.documentIds.includes(String(e.document_id));
			return n && r && i;
		}).map((t) => {
			let r = String(t.content_text), i = String(t.title), a = tn(K(`${i} ${r}`), n) || 1;
			return {
				id: String(t.id),
				documentId: t.document_id ? String(t.document_id) : void 0,
				documentTitle: t.document_title ? String(t.document_title) : "未关联文档",
				sourceType: String(t.source_type),
				title: i,
				excerpt: String(t.excerpt),
				score: a,
				jumpKind: String(t.jump_kind),
				jumpPayloadJson: String(t.jump_payload_json)
			};
		}).sort((e, t) => t.score - e.score || e.title.localeCompare(t.title));
		let r = n(e);
		if (r.length > 0) return r;
		let i = Array.from(new Set(e.split(/[^\p{L}\p{N}]+/u).map((e) => e.trim()).filter((t) => t && t.length >= 2 && t !== e)));
		if (i.length === 0) return r;
		let a = /* @__PURE__ */ new Map();
		return i.forEach((e) => {
			n(e).forEach((t) => {
				let n = a.get(t.id);
				(!n || t.score > n.score) && a.set(t.id, t);
			});
		}), [...a.values()].sort((e, t) => t.score - e.score || e.title.localeCompare(t.title));
	}
	async queryResearchSemantic(e, t, n) {
		let [r] = await this.generateEmbeddings(n, [e]);
		return this.queryAll("SELECT r.id, r.source_type, r.document_id, r.title, r.excerpt, r.jump_kind, r.jump_payload_json, r.updated_at,\n              d.title AS document_title, e.vector_json\n       FROM research_chunks r\n       JOIN research_embeddings e ON e.chunk_id = r.id\n       LEFT JOIN documents d ON d.id = r.document_id\n       WHERE e.provider = ?\n         AND e.model = ?", [n.mode, n.embeddingModel ?? ""]).filter((e) => {
			let n = !t.documentId || String(e.document_id ?? "") === t.documentId, r = !t.sourceType || String(e.source_type) === t.sourceType, i = !Array.isArray(t.documentIds) || t.documentIds.length === 0 || e.document_id && t.documentIds.includes(String(e.document_id));
			return n && r && i;
		}).map((e) => {
			let t = JSON.parse(String(e.vector_json));
			return {
				id: String(e.id),
				documentId: e.document_id ? String(e.document_id) : void 0,
				documentTitle: e.document_title ? String(e.document_title) : "未关联文档",
				sourceType: String(e.source_type),
				title: String(e.title),
				excerpt: String(e.excerpt),
				score: nn(r ?? [], t),
				jumpKind: String(e.jump_kind),
				jumpPayloadJson: String(e.jump_payload_json)
			};
		}).filter((e) => e.score > 0).sort((e, t) => t.score - e.score).slice(0, 20);
	}
	async generateResearchAnswer(e, t, n) {
		if (t.length === 0) return null;
		try {
			let r = t.slice(0, 6).map((e, t) => `Evidence ${t + 1}\nSource: ${e.sourceType}\nDocument: ${e.documentTitle}\nTitle: ${e.title}\nExcerpt: ${e.excerpt}`).join("\n\n"), i = await fetch(`${n.baseUrl?.replace(/\/+$/, "")}/chat/completions`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${n.apiKey ?? ""}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: n.model,
					temperature: .2,
					messages: [{
						role: "system",
						content: "You are a research synthesis assistant. Answer only from the provided evidence and use concise markdown."
					}, {
						role: "user",
						content: `Research question: ${e}\n\nEvidence:\n${r}`
					}]
				})
			});
			if (!i.ok) throw Error(`AI provider returned ${i.status}.`);
			return {
				title: e,
				bodyMarkdown: Qt(await i.json()),
				evidenceIds: t.slice(0, 6).map((e) => e.id),
				generatedAt: G()
			};
		} catch {
			return null;
		}
	}
	async createResearchSnapshot(e) {
		let t = _(), n = G();
		return this.db.run("INSERT INTO research_snapshots\n       (id, query_text, document_id, source_type, mode, result_count, answer_title, answer_body_markdown, answer_evidence_ids_json, answer_generated_at, created_at)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			t,
			e.query,
			e.documentId ?? null,
			e.sourceType ?? null,
			e.mode,
			e.results.length,
			e.answer?.title ?? null,
			e.answer?.bodyMarkdown ?? null,
			e.answer ? JSON.stringify(e.answer.evidenceIds) : null,
			e.answer?.generatedAt ?? null,
			n
		]), e.results.forEach((e, n) => {
			this.db.run("INSERT INTO research_snapshot_evidences\n         (id, snapshot_id, source_type, document_id, document_title, title, excerpt, score, jump_kind, jump_payload_json, result_order)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
				_(),
				t,
				e.sourceType,
				e.documentId ?? null,
				e.documentTitle,
				e.title,
				e.excerpt,
				e.score,
				e.jumpKind,
				e.jumpPayloadJson,
				n
			]);
		}), t;
	}
	toResearchSnapshotEvidenceRecord(e) {
		return {
			id: String(e.id),
			snapshotId: String(e.snapshot_id),
			sourceType: String(e.source_type),
			documentId: e.document_id ? String(e.document_id) : void 0,
			documentTitle: String(e.document_title),
			title: String(e.title),
			excerpt: String(e.excerpt),
			score: Number(e.score ?? 0),
			jumpKind: String(e.jump_kind),
			jumpPayloadJson: String(e.jump_payload_json),
			resultOrder: Number(e.result_order ?? 0),
			jumpAvailable: this.isResearchJumpAvailable(String(e.source_type), e.document_id ? String(e.document_id) : void 0, String(e.jump_kind), String(e.jump_payload_json))
		};
	}
	isResearchJumpAvailable(e, t, n, r) {
		if (n === "position") return t ? !!this.queryAll("SELECT id FROM documents WHERE id = ? LIMIT 1", [t])[0] : !1;
		try {
			let t = JSON.parse(r);
			if (n === "annotation") {
				let e = t.annotationId;
				return e ? !!this.queryAll("SELECT id FROM annotations WHERE id = ? LIMIT 1", [e])[0] : !1;
			}
			if (n === "ai_card" || e === "ai_card") {
				let e = t.aiCardId;
				return e ? !!this.queryAll("SELECT id FROM ai_cards WHERE id = ? LIMIT 1", [e])[0] : !1;
			}
		} catch {
			return !1;
		}
		return !1;
	}
	async indexDocumentForSearch(e) {
		let t = await kt(e, e.format === "txt" || e.format === "md" ? await f.readFile(e.managedPath, "utf8") : void 0, this.searchIndexDependencies);
		this.db.run("DELETE FROM document_search_chunks WHERE document_id = ?", [e.id]), t.status === "indexed" && t.chunks.forEach((t) => this.insertSearchChunk(e, t)), this.db.run("DELETE FROM document_index_states WHERE document_id = ?", [e.id]), this.db.run("INSERT INTO document_index_states\n       (document_id, format, status, error_message, index_version, updated_at)\n       VALUES (?, ?, ?, ?, ?, ?)", [
			e.id,
			e.format,
			t.status,
			t.errorMessage,
			1,
			G()
		]);
	}
	insertTimelineEvent(e) {
		this.db.run("INSERT INTO reading_events (id, document_id, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)", [
			e.id,
			e.documentId ?? null,
			e.eventType,
			e.payloadJson,
			e.createdAt
		]);
	}
	insertSearchChunk(e, t) {
		this.db.run("INSERT INTO document_search_chunks\n       (id, document_id, format, source_type, anchor_label, anchor_payload_json, excerpt, searchable_text, normalized_text, sort_order)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
			_(),
			e.id,
			e.format,
			t.sourceType,
			t.anchorLabel,
			t.positionPayloadJson,
			t.excerpt,
			t.searchableText,
			t.searchableText.toLowerCase(),
			t.sortOrder
		]);
	}
	async findDocumentByChecksum(e) {
		let t = this.queryAll("SELECT * FROM documents WHERE checksum = ? LIMIT 1", [e])[0];
		return t ? Ut(t) : null;
	}
	async findDocumentById(e) {
		let t = this.queryAll("SELECT * FROM documents WHERE id = ? LIMIT 1", [e])[0];
		return t ? Ut(t) : null;
	}
	async findAnnotationById(e) {
		let t = this.queryAll("SELECT * FROM annotations WHERE id = ? LIMIT 1", [e])[0];
		return t ? Wt(t) : null;
	}
	async findBookmarkById(e) {
		let t = this.queryAll("SELECT * FROM bookmarks WHERE id = ? LIMIT 1", [e])[0];
		return t ? Kt(t) : null;
	}
	async findDocumentIndexState(e) {
		let t = this.queryAll("SELECT s.document_id, d.title AS document_title, s.format, s.status, s.error_message, s.index_version, s.updated_at\n       FROM document_index_states s\n       JOIN documents d ON d.id = s.document_id\n       WHERE s.document_id = ?\n       LIMIT 1", [e])[0];
		return t ? Xt(t) : null;
	}
	async listDocumentIndexStates(e) {
		return this.queryAll("SELECT s.document_id, d.title AS document_title, s.format, s.status, s.error_message, s.index_version, s.updated_at\n       FROM document_index_states s\n       JOIN documents d ON d.id = s.document_id\n       ORDER BY d.title ASC").map(Xt).filter((t) => !e || t.format === e);
	}
	async getReadingPosition(e) {
		let t = this.queryAll("SELECT * FROM reading_positions WHERE document_id = ? LIMIT 1", [e])[0];
		return t ? Gt(t) : null;
	}
	async listAiCardsByDocument(e) {
		return this.listAiCards({ documentId: e });
	}
	async getLatestOcrJob(e) {
		let t = this.queryAll("SELECT * FROM ocr_jobs WHERE document_id = ? ORDER BY updated_at DESC LIMIT 1", [e])[0];
		return t ? Yt(t) : null;
	}
};
//#endregion
//#region electron/app-paths.ts
function ln(t) {
	return e.join(t, "preload.mjs");
}
function un(t) {
	return e.resolve(t, "..", "dist", "index.html");
}
//#endregion
//#region electron/startup-log.ts
function dn(e) {
	return e instanceof Error ? {
		name: e.name,
		message: e.message,
		stack: e.stack ?? null
	} : e ?? null;
}
function fn(e) {
	try {
		return JSON.stringify(e);
	} catch {
		return JSON.stringify({
			...e,
			detail: { message: "[unserializable-detail]" }
		});
	}
}
function pn(t) {
	return e.join(t, "logs", "startup.log");
}
function mn(t) {
	let n = t.appendFile ?? c, r = t.now ?? (() => (/* @__PURE__ */ new Date()).toISOString());
	async function i(i, a, o) {
		await l(e.dirname(t.logPath), { recursive: !0 });
		let s = {
			ts: r(),
			level: i,
			event: a,
			detail: dn(o)
		};
		await n(t.logPath, `${fn(s)}\n`, "utf8");
	}
	return {
		info(e, t) {
			return i("info", e, t);
		},
		error(e, t) {
			return i("error", e, t);
		}
	};
}
//#endregion
//#region electron/window-options.ts
function hn(e) {
	return {
		width: 1560,
		height: 960,
		minWidth: 1200,
		minHeight: 760,
		backgroundColor: "#f5ecdf",
		title: "DeepSleepReader",
		webPreferences: {
			preload: ln(e),
			contextIsolation: !0,
			nodeIntegration: !1,
			sandbox: !1
		}
	};
}
//#endregion
//#region electron/main.ts
var J = null, Y = null, X = null, Z = null, Q = e.dirname(t(import.meta.url));
async function gn() {
	await Z?.info("create-window:start", {
		packaged: i.isPackaged,
		preload: ln(Q),
		renderer: un(Q)
	}), J = new r(hn(Q)), J.webContents.on("did-fail-load", (e, t, n, r) => {
		Z?.error("create-window:did-fail-load", {
			errorCode: t,
			errorDescription: n,
			validatedUrl: r
		});
	}), J.webContents.on("render-process-gone", (e, t) => {
		Z?.error("create-window:render-process-gone", t);
	}), J.on("unresponsive", () => {
		Z?.error("create-window:unresponsive");
	}), J.on("closed", () => {
		Z?.info("create-window:closed");
	}), process.env.VITE_DEV_SERVER_URL ? (await J.loadURL(process.env.VITE_DEV_SERVER_URL), J.webContents.openDevTools({ mode: "detach" })) : await J.loadFile(un(Q)), await Z?.info("create-window:ready", { url: J.webContents.getURL() });
	let e = await J.webContents.executeJavaScript("({\n        title: document.title,\n        hasReaderApi: Boolean(window.readerApi),\n        documentKeys: window.readerApi?.documents ? Object.keys(window.readerApi.documents) : [],\n        importType: typeof window.readerApi?.documents?.import\n      })", !0).catch((e) => ({ diagnosticsError: e instanceof Error ? e.message : String(e) }));
	await Z?.info("create-window:renderer-diagnostics", e), process.env.RESEARCH_READER_AUTO_CLICK_IMPORT === "1" && setTimeout(() => {
		J?.webContents.executeJavaScript("(() => {\n            const button = Array.from(document.querySelectorAll('button')).find((candidate) =>\n              candidate.textContent?.includes('导入文档')\n            );\n            if (!button) {\n              return { clicked: false, reason: 'button-not-found' };\n            }\n            button.click();\n            return { clicked: true, label: button.textContent?.trim() ?? '' };\n          })()", !0).then((e) => Z?.info("create-window:auto-click-import", e)).catch((e) => Z?.error("create-window:auto-click-import", e));
	}, 1500);
}
function $() {
	if (!Y) throw Error("Store is not initialized.");
	return Y;
}
function _n() {
	if (!X) throw Error("Native runtime is not initialized.");
	return X;
}
async function vn() {
	await Z?.info("ipc:register:start"), o.handle("documents:import", async () => {
		await Z?.info("documents:import:invoked");
		let t = {
			title: "导入研究资料",
			properties: ["openFile"],
			filters: [
				{
					name: "Supported",
					extensions: [
						"pdf",
						"epub",
						"txt",
						"md"
					]
				},
				{
					name: "PDF",
					extensions: ["pdf"]
				},
				{
					name: "EPUB",
					extensions: ["epub"]
				},
				{
					name: "Text",
					extensions: ["txt", "md"]
				}
			]
		}, n = J ? await a.showOpenDialog(J, t) : await a.showOpenDialog(t);
		if (await Z?.info("documents:import:dialog-result", {
			canceled: n.canceled,
			count: n.filePaths.length,
			names: n.filePaths.map((t) => e.basename(t))
		}), n.canceled || n.filePaths.length === 0) return null;
		let r = await $().importDocumentFromPath(n.filePaths[0]);
		return await Z?.info("documents:import:completed", {
			documentId: r.id,
			title: r.title,
			format: r.format
		}), r;
	}), o.handle("documents:list", () => $().listDocuments()), o.handle("documents:open", (e, t) => $().openDocument(t)), o.handle("documents:rename", (e, t, n) => $().renameDocument(t, n)), o.handle("documents:delete", (e, t) => $().deleteDocument(t)), o.handle("reader:savePosition", (e, t) => $().saveReadingPosition(t)), o.handle("bookmarks:listByDocument", (e, t) => $().listBookmarksByDocument(t)), o.handle("bookmarks:upsert", (e, t) => $().upsertBookmark(t)), o.handle("bookmarks:delete", (e, t) => $().deleteBookmark(t)), o.handle("annotations:listByDocument", (e, t) => $().listAnnotationsByDocument(t)), o.handle("annotations:list", (e, t) => $().listAnnotations(t)), o.handle("annotations:upsert", (e, t) => $().upsertAnnotation(t)), o.handle("annotations:delete", (e, t) => $().deleteAnnotation(t)), o.handle("ai:interpretSelection", (e, t) => $().interpretSelection(t)), o.handle("ai:list", (e, t) => $().listAiCards(t)), o.handle("timeline:list", (e, t) => $().listTimeline(t)), o.handle("review:exportMarkdown", (e, t) => $().exportReviewMarkdown(t)), o.handle("search:query", (e, t) => $().queryLibrarySearch(t)), o.handle("search:listIndexStates", () => $().listSearchIndexStates()), o.handle("search:rebuildDocument", (e, t) => $().rebuildDocumentSearchIndex(t)), o.handle("research:getStatus", () => $().getResearchStatus()), o.handle("research:syncDocumentCorpus", () => $().syncDocumentCorpus()), o.handle("research:query", (e, t) => $().queryResearch(t)), o.handle("research:listSnapshots", (e, t) => $().listResearchSnapshots(t)), o.handle("research:getSnapshot", (e, t) => $().getResearchSnapshot(t)), o.handle("research:deleteSnapshot", (e, t) => $().deleteResearchSnapshot(t)), o.handle("notebooks:list", () => $().listNotebooks()), o.handle("notebooks:create", (e, t) => $().createNotebook(t)), o.handle("notebooks:update", (e, t, n) => $().updateNotebook(t, n)), o.handle("notebooks:delete", (e, t) => $().deleteNotebook(t)), o.handle("notebooks:get", (e, t) => $().getNotebook(t)), o.handle("notebooks:addDocuments", (e, t, n) => $().addDocumentsToNotebook(t, n)), o.handle("notebooks:removeDocument", (e, t, n) => $().removeDocumentFromNotebook(t, n)), o.handle("notebooks:ask", (e, t) => $().askNotebook(t)), o.handle("notebooks:listTurns", (e, t) => $().listNotebookTurns(t)), o.handle("notebooks:retryArtifact", (e, t) => $().retryNotebookArtifact(t)), o.handle("ocr:start", (e, t) => $().startOcr(t)), o.handle("native:getStatus", () => _n().getStatus()), o.handle("settings:get", () => $().getSettings()), o.handle("settings:save", (e, t) => $().saveSettings(t)), await Z?.info("ipc:register:ready");
}
i.whenReady().then(async () => {
	Z = mn({ logPath: pn(i.getPath("userData")) }), await Z.info("app:ready", {
		packaged: i.isPackaged,
		userData: i.getPath("userData"),
		resourcesPath: process.resourcesPath
	}), process.on("uncaughtException", (e) => {
		Z?.error("process:uncaught-exception", e);
	}), process.on("unhandledRejection", (e) => {
		Z?.error("process:unhandled-rejection", e);
	}), X = await he(), await Z.info("native-runtime:ready", await X.getStatus()), Y = new cn(i.getPath("userData"), X), await Y.init(), await Z.info("store:init:ready"), await vn(), await gn(), i.on("activate", async () => {
		await Z?.info("app:activate"), r.getAllWindows().length === 0 && await gn();
	});
}).catch(async (e) => {
	throw Z && await Z.error("app:startup-failed", e), e;
}), i.on("window-all-closed", () => {
	Z?.info("app:window-all-closed"), process.platform !== "darwin" && i.quit();
});
//#endregion
