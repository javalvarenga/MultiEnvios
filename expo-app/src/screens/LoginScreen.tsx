import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { login } from "../api/auth";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("demo@multienvios.gt");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Ingrese email y contraseña");
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigation.replace("Main");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Credenciales inválidas";
      Alert.alert("Error de acceso", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>MULTIENVÍOS GT</Text>
            <Text style={styles.subtitle}>Inicie sesión para continuar</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="demo@multienvios.gt"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Ingresar</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.hint}>
              Usuario demo: demo@multienvios.gt / demo123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1976d2",
    letterSpacing: 1,
  },
  subtitle: { fontSize: 15, color: "#666", marginTop: 8 },
  form: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1976d2",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 16,
  },
});