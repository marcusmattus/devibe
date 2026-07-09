import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { RefreshCw, ExternalLink } from "lucide-react-native";
import { useState } from "react";
import { colors, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";

type PreviewTab = "preview" | "code" | "deploy";

export function LivePreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");
  const [refreshKey, setRefreshKey] = useState(0);
  const activeProject = useProjectStore((s) => s.activeProject);

  const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0F0F1A, #1A0A2E);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #F9FAFB;
      padding: 24px;
    }
    .card {
      background: rgba(26, 26, 40, 0.9);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 32px;
      text-align: center;
      max-width: 320px;
      box-shadow: 0 0 40px rgba(168, 85, 247, 0.2);
    }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p { color: #9CA3AF; font-size: 14px; line-height: 1.5; }
    .orb {
      width: 60px; height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #A855F7, #3B82F6);
      margin: 0 auto 20px;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
    }
    .badge {
      display: inline-block;
      margin-top: 16px;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(168, 85, 247, 0.2);
      color: #A855F7;
      font-size: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="orb"></div>
    <h1>${activeProject?.name ?? "DeVibe Cloud Mobile"}</h1>
    <p>Live preview of your Expo app. Changes sync in real-time as AI agents edit your code.</p>
    <span class="badge">Expo Preview</span>
  </div>
</body>
</html>`;

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: "preview", label: "Preview" },
    { id: "code", label: "Code" },
    { id: "deploy", label: "Deploy" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingHorizontal: 8,
        }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderBottomWidth: 2,
              borderBottomColor: activeTab === tab.id ? colors.purple : "transparent",
            }}
          >
            <Text
              style={{
                color: activeTab === tab.id ? colors.purple : colors.textMuted,
                fontSize: 13,
                fontWeight: activeTab === tab.id ? "600" : "400",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setRefreshKey((k) => k + 1)} style={{ padding: 8 }}>
          <RefreshCw size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 8 }}>
          <ExternalLink size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", gap: 4 }}>
          {["#EF4444", "#F97316", "#22C55E"].map((c) => (
            <View key={c} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c }} />
          ))}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>
            https://preview.devibe.app/{activeProject?.name.toLowerCase().replace(/\s/g, "-")}
          </Text>
        </View>
      </View>

      {activeTab === "preview" && (
        <WebView
          key={refreshKey}
          source={{ html: previewHtml }}
          style={{ flex: 1, backgroundColor: colors.bg }}
          scrollEnabled
          originWhitelist={["*"]}
        />
      )}
      {activeTab === "code" && (
        <View style={{ flex: 1, padding: 16, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
            Switch to the Editor tab to view and edit code with Monaco
          </Text>
        </View>
      )}
      {activeTab === "deploy" && (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 12 }}>
            One-Click Deploy
          </Text>
          {["EAS (App Store)", "Vercel", "AWS Amplify", "Google Cloud Run"].map((target) => (
            <TouchableOpacity
              key={target}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                backgroundColor: colors.card,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 14 }}>{target}</Text>
              <Text style={{ color: colors.purple, fontSize: 13, fontWeight: "600" }}>Deploy</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
