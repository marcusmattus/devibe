const MONACO_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #container { width: 100%; height: 100%; overflow: hidden; background: #0A0A0F; }
</style>
</head>
<body>
<div id="container"></div>
<script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js"></script>
<script>
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' }});

  require(['vs/editor/editor.main'], function() {
    monaco.editor.defineTheme('devibe-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'A855F7' },
        { token: 'string', foreground: '22C55E' },
        { token: 'number', foreground: '60A5FA' },
        { token: 'type', foreground: '3B82F6' },
        { token: 'function', foreground: '00F0FF' },
      ],
      colors: {
        'editor.background': '#0A0A0F',
        'editor.foreground': '#F9FAFB',
        'editor.lineHighlightBackground': '#12121A',
        'editor.selectionBackground': '#A855F744',
        'editorCursor.foreground': '#A855F7',
        'editorLineNumber.foreground': '#4B5563',
        'editorLineNumber.activeForeground': '#A855F7',
        'editorIndentGuide.background': '#1A1A28',
        'editorWidget.background': '#12121A',
        'editorSuggestWidget.background': '#1A1A28',
        'editorSuggestWidget.border': '#374151',
      }
    });

    let editor = null;
    let currentLanguage = 'typescript';
    let suppressChange = false;

    function initEditor(value, language) {
      if (editor) editor.dispose();
      currentLanguage = language || 'typescript';
      editor = monaco.editor.create(document.getElementById('container'), {
        value: value || '',
        language: currentLanguage,
        theme: 'devibe-dark',
        fontSize: 14,
        fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        tabSize: 2,
        padding: { top: 12, bottom: 12 },
        suggest: { preview: true, showIcons: true },
        quickSuggestions: true,
        bracketPairColorization: { enabled: true },
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
      });

      editor.onDidChangeModelContent(function() {
        if (!suppressChange) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'change',
            value: editor.getValue()
          }));
        }
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, function() {
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'commandPalette' }));
      });
    }

    window.addEventListener('message', function(e) {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.type === 'setContent') {
          if (!editor) { initEditor(data.value, data.language); return; }
          suppressChange = true;
          editor.setValue(data.value || '');
          if (data.language && data.language !== currentLanguage) {
            monaco.editor.setModelLanguage(editor.getModel(), data.language);
            currentLanguage = data.language;
          }
          suppressChange = false;
        }
      } catch(err) {}
    });

    document.addEventListener('message', function(e) {
      window.dispatchEvent(new MessageEvent('message', { data: e.data }));
    });

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'ready' }));
  });
</script>
</body>
</html>`;

export function getMonacoHtml(): string {
  return MONACO_HTML;
}

export const languageMap: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  json: "json",
  hcl: "hcl",
  terraform: "hcl",
  css: "css",
  html: "html",
  markdown: "markdown",
};
