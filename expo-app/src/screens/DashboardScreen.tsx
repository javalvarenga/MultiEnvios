import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchDashboard, type DashboardData } from "../api/dashboard";

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const result = await fetchDashboard();
      setData(result);
    } catch {
      // En modo demostración, datos de respaldo
      setData({
        stats: {
          totalShipments: 128,
          balance: 450.5,
          delivered: 89,
          inTransit: 24,
          returned: 3,
          pending: 12,
        },
        activity: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          shipments: [12, 19, 8, 15, 22, 10, 14],
        },
        recent: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  const stats = data?.stats;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.flex}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
      >
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Panel de control de envíos (Modo Simulación)
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Envíos</Text>
            <Text style={styles.cardValue}>{stats?.totalShipments ?? 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>En Tránsito</Text>
            <Text style={styles.cardValue}>{stats?.inTransit ?? 0}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Entregados</Text>
            <Text style={styles.cardValue}>{stats?.delivered ?? 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pendientes</Text>
            <Text style={styles.cardValue}>{stats?.pending ?? 0}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Devueltos</Text>
            <Text style={styles.cardValue}>{stats?.returned ?? 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Saldo</Text>
            <Text style={styles.cardValue}>
              Q {stats?.balance?.toFixed(2) ?? "0.00"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Envíos recientes</Text>
        {(data?.recent ?? []).length === 0 ? (
          <Text style={styles.emptyText}>No hay envíos recientes</Text>
        ) : (
          (data?.recent ?? []).map((item) => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.tracking}>{item.trackingNumber}</Text>
              <Text style={styles.recipient}>{item.recipientName}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: "#1976d2", padding: 16 },
  subtitle: { fontSize: 14, color: "#666", paddingHorizontal: 16, marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },
  cardLabel: { fontSize: 13, color: "#888", marginBottom: 6 },
  cardValue: { fontSize: 22, fontWeight: "700", color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    padding: 16,
    marginTop: 8,
  },
  emptyText: { paddingHorizontal: 16, color: "#999", fontSize: 14 },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
  },
  tracking: { fontSize: 14, fontWeight: "700", fontFamily: "monospace" },
  recipient: { fontSize: 14, color: "#555", marginTop: 4 },
  status: { fontSize: 12, color: "#1976d2", marginTop: 4, textTransform: "capitalize" },
});