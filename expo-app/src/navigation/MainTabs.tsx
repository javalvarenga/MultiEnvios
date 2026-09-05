import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabsParamList } from "../types";
import DashboardScreen from "../screens/DashboardScreen";
import ShipmentFormScreen from "../screens/ShipmentFormScreen";
import ReportsScreen from "../screens/ReportsScreen";
import ConfigScreen from "../screens/ConfigScreen";
import { LogoutButton } from "../components/LogoutButton";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1976d2",
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: "#1976d2",
        headerTitleStyle: { fontWeight: "800" },
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="ShipmentForm"
        component={ShipmentFormScreen}
        options={{ title: "Nuevo Envío" }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: "Reportes" }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{ title: "Configuración" }}
      />
    </Tab.Navigator>
  );
}