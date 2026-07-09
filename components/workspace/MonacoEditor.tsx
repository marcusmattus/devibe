import { useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { colors } from "../../constants/theme";
import { getMonacoHtml, languageMap } from "./monacoHtml";

interface MonacoEditorProps {
  content: string;
  language: string;
  path: string;
  onChange: (content: string) => void;
  onCommandPalette?: () => void;
}

let MonacoEditorWeb: React.ComponentType<{
  value: string;
  language: string;
  onChange: (value: string) => void;
  onCommandPalette?: () => void;
}> | null = null;

if (Platform.OS === "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Monaco = require("@monaco-editor/react").default;
    MonacoEditorWeb = function MonacoWeb({
      value,
      language,
      onChange,
      onCommandPalette,
    }: {
      value: string;
      language: string;
      onChange: (value: string) => void;
      onCommandPalette?: () => void;
    }) {
      useEffect(() => {
        if (typeof window === "undefined" || !onCommandPalette) return;
        const handler = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            onCommandPalette();
          }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
      }, [onCommandPalette]);

      return (
        <Monaco
          height="100%"
          language={language}
          value={value}
          theme="vs-dark"
          onChange={(v: string | undefined) => onChange(v ?? "")}
          beforeMount={(monaco: typeof import("monaco-editor")) => {
            monaco.editor.defineTheme("devibe-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                { token: "comment", foreground: "6B7280", fontStyle: "italic" },
                { token: "keyword", foreground: "A855F7" },
                { token: "string", foreground: "22C55E" },
                { token: "number", foreground: "60A5FA" },
                { token: "type", foreground: "3B82F6" },
                { token: "function", foreground: "00F0FF" },
              ],
              colors: {
                "editor.background": "#0A0A0F",
                "editor.foreground": "#F9FAFB",
                "editor.lineHighlightBackground": "#12121A",
                "editor.selectionBackground": "#A855F744",
                "editorCursor.foreground": "#A855F7",
                "editorLineNumber.foreground": "#4B5563",
                "editorLineNumber.activeForeground": "#A855F7",
              },
            });
          }}
          onMount={(
            editor: import("monaco-editor").editor.IStandaloneCodeEditor,
            monaco: typeof import("monaco-editor")
          ) => {
            monaco.editor.setTheme("devibe-dark");
            if (onCommandPalette) {
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
                onCommandPalette();
              });
            }
          }}
          options={{
            fontSize: 14,
            fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            padding: { top: 12, bottom: 12 },
            suggest: { preview: true },
            quickSuggestions: true,
            bracketPairColorization: { enabled: true },
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            automaticLayout: true,
          }}
        />
      );
    };
  } catch {
    MonacoEditorWeb = null;
  }
}

export function MonacoEditor({
  content,
  language,
  path,
  onChange,
  onCommandPalette,
}: MonacoEditorProps) {
  const webViewRef = useRef<WebView>(null);
  const mappedLanguage = languageMap[language] ?? language ?? "plaintext";

  const sendContent = useCallback(() => {
    if (!webViewRef.current) return;
    webViewRef.current.postMessage(
      JSON.stringify({
        type: "setContent",
        value: content,
        language: mappedLanguage,
      })
    );
  }, [content, mappedLanguage]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      sendContent();
    }
  }, [path, content, mappedLanguage, sendContent]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "change" && data.value !== content) {
          onChange(data.value);
        } else if (data.type === "commandPalette") {
          onCommandPalette?.();
        } else if (data.type === "ready") {
          sendContent();
        }
      } catch {
        // ignore parse errors
      }
    },
    [content, onChange, onCommandPalette, sendContent]
  );

  if (Platform.OS === "web" && MonacoEditorWeb) {
    return (
      <View style={styles.container}>
        <MonacoEditorWeb
          value={content}
          language={mappedLanguage}
          onChange={onChange}
          onCommandPalette={onCommandPalette}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getMonacoHtml() }}
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
        allowsInlineMediaPlayback
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
    minHeight: 300,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
