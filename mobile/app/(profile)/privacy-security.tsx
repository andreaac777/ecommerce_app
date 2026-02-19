import SafeScreen from "@/components/SafeScreen";
import { Header } from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

type SecurityOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "navigation" | "toggle";
  value?: boolean;
};

function PrivacyAndSecurityScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: "two-factor",
      icon: "shield-checkmark-outline",
      title: "Autenticación de Dos Factores",
      description: "Reforzar la seguridad de la cuenta",
      type: "toggle",
      value: twoFactorEnabled,
    }
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: "email",
      icon: "mail-outline",
      title: "Notificaciones por Correo Electrónico",
      description: "Recibir actualizaciones de pedidos por correo electrónico",
      type: "toggle",
      value: emailNotifications,
    },
    {
      id: "marketing",
      icon: "megaphone-outline",
      title: "Suscripción a Boletín",
      description: "Recibir novedades y promociones por correo electrónico",
      type: "toggle",
      value: marketingEmails,
    }
  ];

  const accountSettings = [
    {
      id: "activity",
      icon: "time-outline",
      title: "Actividad de la Cuenta",
      description: "Revisar actividad reciente",
    },
    {
      id: "devices",
      icon: "phone-portrait-outline",
      title: "Dispositivos Conectados",
      description: "Gestionar dispositivos con acceso",
    }
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
    }
  };

  return (
    <SafeScreen>
      <Header header="Privacidad & Seguridad" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* SECURITY SETTING */}
        <View className="px-6 pt-6">
          <Text className="text-text-primary text-lg font-bold mb-4">Seguridad</Text>

          {securitySettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-ui-surface/55 rounded-2xl p-4 mb-3"
              activeOpacity={setting.type === "toggle" ? 1 : 0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-brand-secondary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name={setting.icon as any} size={24} color="#5B3A29" />
                </View>

                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">{setting.description}</Text>
                </View>

                {setting.type === "toggle" ? (
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: "#5B3A29", true: "#C34928" }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#5B3A29" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Section */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Privacidad</Text>

          {privacySettings.map((setting) => (
            <View key={setting.id}>
              <View className="bg-ui-surface/55 rounded-2xl p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="bg-brand-secondary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Ionicons name={setting.icon as any} size={24} color="#5B3A29" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base mb-1">
                      {setting.title}
                    </Text>
                    <Text className="text-text-secondary text-sm">{setting.description}</Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{ false: "#5B3A29", true: "#C34928" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SECTION */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">Cuenta</Text>

          {accountSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-ui-surface/55 rounded-2xl p-4 mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-brand-secondary/10 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name={setting.icon as any} size={24} color="#5B3A29" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">{setting.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#5B3A29" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACC BTN */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            className="bg-ui-surface/55 rounded-2xl p-5 flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="bg-red-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View>
                <Text className="text-red-500 font-bold text-base mb-1">Eliminar Cuenta</Text>
                <Text className="text-text-secondary text-sm">Eliminar permanentemente la cuenta</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* INFO ALERT */}
        <View className="px-6 pt-6 pb-4">
          <View className="bg-ui-surface/55 rounded-2xl p-4 flex-row">
            <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
            <Text className="text-text-secondary text-sm ml-3 flex-1">
              Tu privacidad es importante para nosotros. Tus datos están cifrados y protegidos. Puedes cambiar tus ajustes de privacidad cuando desees.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default PrivacyAndSecurityScreen;