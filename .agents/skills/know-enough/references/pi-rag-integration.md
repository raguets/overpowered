# Pi / pi-rag Integration Pattern

`know-enough` is a **decision policy**. `pi-rag` is a **retrieval capability**.

Do not hard-code tool names in the portable skill. Use the tool schema exposed by the installed Pi extension.

Recommended flow:

```text
1. Determine the information objective.
2. Resolve the best knowledge source from the registry or source-discovery tool.
3. Use the pi-rag retrieval/search tool exposed by the harness.
4. Inspect returned evidence and metadata.
5. Refine only when the result is insufficient.
6. Preserve source identity/provenance in the final reasoning.
```

If pi-rag exposes source discovery, prefer discovery over assuming corpus names.
If the extension exposes multiple retrieval modes, choose the narrowest mode that satisfies the information objective.
If exact snippets or source documents are available, prefer them over a generated retrieval summary for material claims.

A business skill such as contract review should request a semantic need — e.g. “current approved liability position” — rather than embedding a backend corpus identifier. `know-enough` performs the routing.
