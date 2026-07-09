import { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEditorStore } from '../../stores/editorStore';
import { getMonacoHtml, languageMap } from './monacoHtml';
import { devibeTheme } from '../../theme/devibe';

let MonacoEditorWeb: React.ComponentType<{
  value: string;
  language: string;
  onChange: (value: string) => void;
  onCommandPalette: () => void;
}> | null = null;

if (Platform.OS === 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Monaco = require('@monaco-editor/react').default;
    MonacoEditorWeb = function MonacoWeb({
      value,
      language,
      onChange,
      onCommandPalette,
    }: {
      value: string;
      language: string;
      onChange: (value: string) => void;
      onCommandPalette: () => void;
    }) {
      const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

      useEffect(() => {
        if (typeof window !== 'undefined') {
          window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              onCommandPalette();
            }
          });
        }
      }, [onCommandPalette]);

      return (
        <Monaco
          height="100%"
          language={language}
          value={value}
          theme="vs-dark"
          onChange={(v: string | undefined) => onChange(v ?? '')}
          beforeMount={(monaco: typeof import('monaco-editor')) => {
            monacoRef.current = monaco;
            monaco.editor.defineTheme('vibecursor-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'A855F7' },
                { token: 'string', foreground: '10B981' },
                { token: 'number', foreground: 'F59E0B' },
                { token: 'type', foreground: '3B82F6' },
                { token: 'function', foreground: '00F0FF' },
              ],
              colors: {
                'editor.background': '#030712',
                'editor.foreground': '#F9FAFB',
                'editor.lineHighlightBackground': '#111827',
                'editor.selectionBackground': '#A855F733',
                'editorCursor.foreground': '#A855F7',
                'editorLineNumber.foreground': '#4B5563',
                'editorLineNumber.activeForeground': '#A855F7',
              },
            });
          }}
          onMount={(editor: import('monaco-editor').editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
            monaco.editor.setTheme('vibecursor-dark');
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
              onCommandPalette();
            });
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            padding: { top: 12 },
            suggest: { preview: true },
            quickSuggestions: true,
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      );
    };
  } catch {
    MonacoEditorWeb = null;
  }
}

export function MonacoEditorPanel() {
  const { getActiveFile, updateFileContent, toggleCommandPalette } = useEditorStore();
  const webViewRef = useRef<WebView>(null);
  const activeFile = getActiveFile();

  const sendContent = useCallback(() => {
    if (!activeFile || !webViewRef.current) return;
    webViewRef.current.postMessage(
      JSON.stringify({
        type: 'setContent',
        value: activeFile.content,
        language: languageMap[activeFile.language] ?? 'plaintext',
      })
    );
  }, [activeFile]);

  useEffect(() => {
    if (Platform.OS !== 'web') sendContent();
  }, [activeFile?.id, activeFile?.content, sendContent]);

  if (!activeFile) {
    return <View style={styles.container} />;
  }

  if (Platform.OS === 'web' && MonacoEditorWeb) {
    return (
      <View style={styles.container}>
        <MonacoEditorWeb
          value={activeFile.content}
          language={languageMap[activeFile.language] ?? 'plaintext'}
          onChange={(value) => updateFileContent(activeFile.id, value)}
          onCommandPalette={toggleCommandPalette}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: getMonacoHtml() }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'change') {
              updateFileContent(activeFile.id, data.value);
            } else if (data.type === 'commandPalette') {
              toggleCommandPalette();
            } else if (data.type === 'ready') {
              sendContent();
            }
          } catch {
            /* ignore parse errors */
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: devibeTheme.colors.void,
  },
  webview: {
    flex: 1,
    backgroundColor: devibeTheme.colors.void,
  },
});
