import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../api/auth";

interface CourierConfig {
  id: string;
  name: string;
  service: string;
  description: string;
  status: "Activa" | "Inactiva";
  integration: string;
}

const DUMMY_COURIERS: CourierConfig[] = [
  {
    id: "1",
    name: "Cargo",
    service: "Cargo Expreso (CAEX)",
    description: "Generación y anulación de guías de envío.",
    status: "Activa",
    integration: "Integración activa",
  },
  {
    id: "2",
    name: "Forza",
    service: "Forza Express",
    description: "Generación de guías y seguimiento de envíos.",
    status: "Activa",
    integration: "Integración activa",
  },
  {
    id: "3",
    name: "Guatex",
    service: "Guatex",
    description: "Generación de guías de envío nacionales.",
    status: "Inactiva",
    integration: "Integración pendiente",
  },
];

export default function ConfigScreen() {
  const [couriers] = useState<CourierConfig[]>(DUMMY_COURIERS);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Está seguro que desea salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.getParent()?.replace("Login");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.flex}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>
          Administra couriers, credenciales y variables de configuración
        </Text>

        <Text style={styles.sectionTitle}>Couriers</Text>
        {couriers.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.courierName}>{c.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  c.status === "Activa" ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    c.status === "Activa"
                      ? styles.statusTextActive
                      : styles.statusTextInactive,
                  ]}
                >
                  {c.status}
                </Text>
              </View>
            </View>
            <Text style={styles.courierService}>{c.service}</Text>
            <Text style={styles.courierDesc}>{c.description}</Text>
            <Text style={styles.integration}>{c.integration}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courierName: { fontSize: 18, fontWeight: "700", color: "#333" },
  courierService: { fontSize: 14, color: "#1976d2", marginTop: 4 },
  courierDesc: { fontSize: 14, color: "#666", marginTop: 8 },
  integration: { fontSize: 13, color: "#888", marginTop: 8 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: { backgroundColor: "#e8f5e9" },
  statusInactive: { backgroundColor: "#f0f0f0" },
  statusText: { fontSize: 12, fontWeight: "600" },
  statusTextActive: { color: "#2e7d32" },
  statusTextInactive: { color: "#999" },
  logoutBtn: {
    backgroundColor: "#f44336",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 24,
  },
  logoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});