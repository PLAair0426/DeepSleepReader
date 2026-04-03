import { contextBridge as e, ipcRenderer as t } from "electron";
//#region electron/preload.ts
e.exposeInMainWorld("readerApi", {
	documents: {
		import: () => t.invoke("documents:import"),
		list: () => t.invoke("documents:list"),
		open: (e) => t.invoke("documents:open", e),
		rename: (e, n) => t.invoke("documents:rename", e, n),
		delete: (e) => t.invoke("documents:delete", e)
	},
	reader: { savePosition: (e) => t.invoke("reader:savePosition", e) },
	bookmarks: {
		listByDocument: (e) => t.invoke("bookmarks:listByDocument", e),
		upsert: (e) => t.invoke("bookmarks:upsert", e),
		delete: (e) => t.invoke("bookmarks:delete", e)
	},
	annotations: {
		listByDocument: (e) => t.invoke("annotations:listByDocument", e),
		list: (e) => t.invoke("annotations:list", e),
		upsert: (e) => t.invoke("annotations:upsert", e),
		delete: (e) => t.invoke("annotations:delete", e)
	},
	ai: {
		interpretSelection: (e) => t.invoke("ai:interpretSelection", e),
		list: (e) => t.invoke("ai:list", e)
	},
	timeline: { list: (e) => t.invoke("timeline:list", e) },
	review: { exportMarkdown: (e) => t.invoke("review:exportMarkdown", e) },
	search: {
		query: (e) => t.invoke("search:query", e),
		listIndexStates: () => t.invoke("search:listIndexStates"),
		rebuildDocument: (e) => t.invoke("search:rebuildDocument", e)
	},
	research: {
		getStatus: () => t.invoke("research:getStatus"),
		syncDocumentCorpus: () => t.invoke("research:syncDocumentCorpus"),
		query: (e) => t.invoke("research:query", e),
		listSnapshots: (e) => t.invoke("research:listSnapshots", e),
		getSnapshot: (e) => t.invoke("research:getSnapshot", e),
		deleteSnapshot: (e) => t.invoke("research:deleteSnapshot", e)
	},
	notebooks: {
		list: () => t.invoke("notebooks:list"),
		create: (e) => t.invoke("notebooks:create", e),
		update: (e, n) => t.invoke("notebooks:update", e, n),
		delete: (e) => t.invoke("notebooks:delete", e),
		get: (e) => t.invoke("notebooks:get", e),
		addDocuments: (e, n) => t.invoke("notebooks:addDocuments", e, n),
		removeDocument: (e, n) => t.invoke("notebooks:removeDocument", e, n),
		ask: (e) => t.invoke("notebooks:ask", e),
		listTurns: (e) => t.invoke("notebooks:listTurns", e),
		retryArtifact: (e) => t.invoke("notebooks:retryArtifact", e)
	},
	ocr: { start: (e) => t.invoke("ocr:start", e) },
	native: { getStatus: () => t.invoke("native:getStatus") },
	settings: {
		get: () => t.invoke("settings:get"),
		save: (e) => t.invoke("settings:save", e)
	}
});
//#endregion
