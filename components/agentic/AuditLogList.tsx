import { View, Text } from "react-native";
import { colors, radius } from "../../constants/theme";
import { useAgenticAuthStore } from "../../stores/agenticAuthStore";
import { GlassCard } from "../ui/GlassCard";
import type { AuditEntry } from "../../lib/agentic/types";

const SEVERITY_COLORS = {
  info: colors.blue,
  warning: colors.orange,
  critical: colors.red,
};

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function actionLabel(action: AuditEntry["action"]): string {
  const labels: Record<AuditEntry["action"], string> = {
    session_created: "Session Created",
    session_revoked: "Session Revoked",
    session_expired: "Session Expired",
    repo_imported: "Repo Imported",
    file_read: "File Read",
    file_write: "File Edited",
    anomaly_detected: "Anomaly Detected",
    login: "Login",
    logout: "Logout",
  };
  return labels[action];
}

export function AuditLogList({ limit = 20 }: { limit?: number }) {
  const auditLog = useAgenticAuthStore((s) => s.auditLog);
  const entries = auditLog.slice(0, limit);

  if (entries.length === 0) {
    return (
      <GlassCard>
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>No audit events yet</Text>
        </View>
      </GlassCard>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {entries.map((entry) => (
        <GlassCard key={entry.id}>
          <View style={{ padding: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>
                {actionLabel(entry.action)}
              </Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: SEVERITY_COLORS[entry.severity],
                }}
              />
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
              {entry.details}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
              {formatTime(entry.timestamp)} · {entry.actor}
              {entry.repoFullName ? ` · ${entry.repoFullName}` : ""}
            </Text>
          </View>
        </GlassCard>
      ))}
    </View>
  );
}
