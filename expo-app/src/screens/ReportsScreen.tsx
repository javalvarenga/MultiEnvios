import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ReportShipment {
  id: string;
  trackingNumber: string;
  courier: string;
  destination: string;
  status: string;
  amount: number;
  date: string;
}

const STATUS_LABELS: Record<string, string> = {
  delivered: "Entregado",
  in_transit: "En Tránsito",
  pending: "Pendiente",
  returned: "Devuelto",
};

const DUMMY_SHIPMENTS: ReportShipment[] = [
  { id: "1", trackingNumber: "CE-2026-00128", courier: "Cargo Expreso", destination: "Guatemala City", status: "in_transit", amount: 125.0, date: "2026-07-09" },
  { id: "2", trackingNumber: "CE-2026-00127", courier: "Cargo Expreso", destination: "Mixco", status: "delivered", amount: 89.5, date: "2026-07-09" },
  { id: "3", trackingNumber: "CE-2026-00126", courier: "Forza", destination: "Villa Nueva", status: "pending", amount: 210.0, date: "2026-07-08" },
  { id: "4", trackingNumber: "CE-2026-00125", courier: "Guatex", destination: "Antigua Guatemala", status: "returned", amount: 45.0, date: "2026-07-07" },
  { id: "5", trackingNumber: "CE-2026-00124", courier: "Cargo Expreso", destination: "Quetzaltenango", status: "delivered", amount: 175.0, date: "2026-07-06" },
];

interface CourierSummary {
  id: string;
  courier: string;
  totalShipments: number;
  delivered: number;
  revenue: number;
}

const DUMMY_COURIERS: CourierSummary[] = [
  { id: "1", courier: "Cargo Expreso", totalShipments: 65, delivered: 48, revenue: 4820.5 },
  { id: "2", courier: "Forza", totalShipments: 38, delivered: 27, revenue: 2650.0 },
  { id: "3", courier: "Guatex", totalShipments: 25, delivered: 14, revenue: 1875.25 },
];

function formatMoney(value: number): string {
  return `Q ${value.toFixed(2)}`;
}

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.flex}>
        <Text style={styles.title}>Reportes</Text>
        <Text style={styles.subtitle}>
          Análisis de envíos y desempeño por courier (Modo Simulación)
        </Text>

        {/* Resumen por courier */}
        <Text style={styles.sectionTitle}>Resumen por Courier</Text>
        {DUMMY_COURIERS.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardTitle}>{c.courier}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Total envíos</Text>
              <Text style={styles.cardValue}>{c.totalShipments}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Entregados</Text>
              <Text style={styles.cardValue}>{c.delivered}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Ingresos</Text>
              <Text style={styles.cardValue}>{formatMoney(c.revenue)}</Text>
            </View>
          </View>
        ))}

        {/* Envíos recientes */}
        <Text style={styles.sectionTitle}>Envíos Recientes</Text>
        {DUMMY_SHIPMENTS.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.tracking}>{s.trackingNumber}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Courier</Text>
              <Text style={styles.cardValue}>{s.courier}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Destino</Text>
              <Text style={styles.cardValue}>{s.destination}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Estado</Text>
              <Text style={styles.cardValue}>
                {STATUS_LABELS[s.status] ?? s.status}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Monto</Text>
              <Text style={styles.cardValue}>{formatMoney(s.amount)}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Fecha</Text>
              <Text style={styles.cardValue}>{s.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  flex: { flex: 1 },
  title: { fontSize: 24, fontWeight: "800", color: "#1976d2", padding: 16 },
  subtitle: { fontSize: 14, color: "#666", paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    padding: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1976d2", marginBottom: 8 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  cardLabel: { fontSize: 14, color: "#888" },
  cardValue: { fontSize: 14, color: "#333", fontWeight: "600" },
  tracking: { fontSize: 15, fontWeight: "700", fontFamily: "monospace", marginBottom: 8 },
});