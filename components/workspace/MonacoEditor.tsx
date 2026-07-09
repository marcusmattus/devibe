import { useRef, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { colors } from "../../constants/theme";

interface MonacoEditorProps {
  content: string;
  language: string;
  path: string;
  onChange: (content: string) => void;
}

function getMonacoHtml(content: string, language: string, path: string): string {
  const escaped = JSON.stringify(content);
  const lang = language === "typescript" ? "typescript" : language;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; background: #0A0A0F; overflow: hidden; }
    #container { height: 100vh; width: 100vw; }
    .monaco-editor .margin { background: #0A0A0F !important; }
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
        }
      });

      const initialContent = ${escaped};
      window.editor = monaco.editor.create(document.getElementById('container'), {
        value: initialContent,
        language: '${lang}',
        theme: 'devibe-dark',
        fontSize: 14,
        fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        padding: { top: 12, bottom: 12 },
        wordWrap: 'on',
        tabSize: 2,
      });

      window.editor.onDidChangeModelContent(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'change',
          content: window.editor.getValue()
        }));
      });

      window.addEventListener('message', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'setContent') {
            const pos = window.editor.getPosition();
            window.editor.setValue(data.content);
            if (pos) window.editor.setPosition(pos);
          }
          if (data.type === 'setLanguage') {
            monaco.editor.setModelLanguage(window.editor.getModel(), data.language);
          }
        } catch(err) {}
      });
    });
  </script>
</body>
</html>`;
}

export function MonacoEditor({ content, language, path, onChange }: MonacoEditorProps) {
  const webViewRef = useRef<WebView>(null);
  const isReady = useRef(false);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "change" && data.content !== content) {
          onChange(data.content);
        }
        if (data.type === "ready") {
          isReady.current = true;
        }
      } catch {
        // ignore parse errors
      }
    },
    [content, onChange]
  );

  useEffect(() => {
    if (isReady.current && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: "setContent", content })
      );
    }
  }, [path]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getMonacoHtml(content, language, path) }}
        onMessage={handleMessage}
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        mixedContentMode="always"
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
