import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createShipment, type PackageInput, type PackageType } from "../api/shipments";

interface PackageRow extends PackageInput {
  tempId: string;
}

const PACKAGE_TYPES: { value: PackageType; label: string }[] = [
  { value: "package", label: "Paquete" },
  { value: "envelope", label: "Sobre" },
  { value: "other", label: "Otros" },
];

export default function ShipmentFormScreen() {
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [reference1, setReference1] = useState("");

  const [pkgType, setPkgType] = useState<PackageType>("package");
  const [pkgContent, setPkgContent] = useState("");
  const [pkgWeight, setPkgWeight] = useState("");
  const [pkgQuantity, setPkgQuantity] = useState("");
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addPackage = () => {
    const weight = parseFloat(pkgWeight);
    const quantity = parseInt(pkgQuantity, 10);

    if (!pkgContent.trim()) {
      Alert.alert("Validación", "Ingrese el contenido del paquete");
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Validación", "Ingrese un peso válido");
      return;
    }
    if (isNaN(quantity) || quantity < 1) {
      Alert.alert("Validación", "Ingrese una cantidad válida");
      return;
    }

    setPackages((prev) => [
      ...prev,
      {
        tempId: `pkg-${Date.now()}`,
        type: pkgType,
        content: pkgContent.trim(),
        weight,
        quantity,
      },
    ]);
    setPkgContent("");
    setPkgWeight("");
    setPkgQuantity("");
  };

  const removePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.tempId !== id));
  };

  const handleSubmit = async () => {
    if (!recipientName.trim()) {
      Alert.alert("Validación", "Ingrese el nombre del destinatario");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Validación", "Ingrese la dirección");
      return;
    }
    if (packages.length === 0) {
      Alert.alert("Validación", "Agregue al menos un paquete");
      return;
    }

    setSubmitting(true);
    try {
      const shipment = await createShipment({
        recipientName: recipientName.trim(),
        address: address.trim(),
        packages: packages.map(({ type, content, weight, quantity }) => ({
          type,
          content,
          weight,
          quantity,
        })),
      });
      Alert.alert("Éxito", `Guía generada: ${shipment.id}`);
      setRecipientName("");
      setAddress("");
      setPhone("");
      setReference1("");
      setPackages([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo crear el envío";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Nuevo Envío</Text>
          <Text style={styles.subtitle}>
            Complete los datos del destinatario para generar la guía
          </Text>

          <Text style={styles.label}>Destinatario</Text>
          <TextInput
            style={styles.input}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Nombre completo"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+502 xxxx xxxx"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Dirección Exacta</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle, Zona, Ciudad"
          />

          <Text style={styles.label}>Referencia</Text>
          <TextInput
            style={styles.input}
            value={reference1}
            onChangeText={setReference1}
            placeholder="Ej: Casa color verde"
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Paquetes</Text>

          {/* Tipo selector */}
          <View style={styles.typeRow}>
            {PACKAGE_TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.typeBtn,
                  pkgType === t.value && styles.typeBtnActive,
                ]}
                onPress={() => setPkgType(t.value)}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    pkgType === t.value && styles.typeBtnTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Contenido</Text>
          <TextInput
            style={styles.input}
            value={pkgContent}
            onChangeText={setPkgContent}
            placeholder="Ej: Ropa"
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Peso (lb)</Text>
              <TextInput
                style={styles.input}
                value={pkgWeight}
                onChangeText={setPkgWeight}
                placeholder="0.00"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Cantidad</Text>
              <TextInput
                style={styles.input}
                value={pkgQuantity}
                onChangeText={setPkgQuantity}
                placeholder="1"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={addPackage}>
            <Text style={styles.addBtnText}>+ Agregar paquete</Text>
          </TouchableOpacity>

          {/* Lista de paquetes */}
          {packages.length === 0 ? (
            <Text style={styles.emptyText}>No hay paquetes agregados</Text>
          ) : (
            packages.map((p) => (
              <View key={p.tempId} style={styles.pkgItem}>
                <View style={styles.pkgInfo}>
                  <Text style={styles.pkgType}>
                    {PACKAGE_TYPES.find((t) => t.value === p.type)?.label}
                  </Text>
                  <Text style={styles.pkgContent}>{p.content}</Text>
                  <Text style={styles.pkgMeta}>
                    {p.weight.toFixed(2)} lb · {p.quantity} unidad(es)
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removePackage(p.tempId)}>
                  <Text style={styles.removeBtn}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={[styles.submitBtn, packages.length === 0 && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitting || packages.length === 0}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Generar Guía</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800", color: "#1976d2" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 16, marginTop: 4 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  row: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  divider: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  typeBtnActive: { backgroundColor: "#1976d2", borderColor: "#1976d2" },
  typeBtnText: { fontSize: 14, color: "#555" },
  typeBtnTextActive: { color: "#fff", fontWeight: "700" },
  addBtn: {
    borderWidth: 1,
    borderColor: "#1976d2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  addBtnText: { color: "#1976d2", fontSize: 15, fontWeight: "700" },
  pkgItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    elevation: 1,
  },
  pkgInfo: { flex: 1 },
  pkgType: { fontSize: 14, fontWeight: "700", color: "#333" },
  pkgContent: { fontSize: 14, color: "#555", marginTop: 2 },
  pkgMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  removeBtn: { color: "#f44336", fontSize: 14, fontWeight: "600" },
  emptyText: { color: "#999", fontSize: 14, marginTop: 12, textAlign: "center" },
  submitBtn: {
    backgroundColor: "#1976d2",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitDisabled: { backgroundColor: "#aaa" },
  submitBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});