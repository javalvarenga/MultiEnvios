import { TouchableOpacity, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../api/auth";

/**
 * Botón de cerrar sesión que se muestra en la cabecera
 * de las pantallas principales. Al pulsarlo elimina el
 * JWT almacenado y redirige al Login del stack raíz.
 */
export function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Desea cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 12 }}>
      <Text style={{ color: "#1976d2", fontWeight: "700" }}>Salir</Text>
    </TouchableOpacity>
  );
}