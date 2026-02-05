import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform } from "react-native";
import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress,
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 py-5 pt-5 flex-row items-center justify-between">
            <Text className="text-brand-secondary text-2xl font-bold">
              {isEditing ? "Editar Dirección" : "Agregar Dirección"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#5B3A29" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Nombre de la Dirección</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary p-4 rounded-2xl text-base"
                  placeholder="ej. Casa, Trabajo, Oficina"
                  placeholderTextColor="#666"
                  value={addressForm.label}
                  onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
                />
              </View>

              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Nombre del Destinatario</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="Ingrese el nombre del destinatario"
                  placeholderTextColor="#666"
                  value={addressForm.fullName}
                  onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Dirección</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="ej. Calle, Edificio, Apartamento"
                  placeholderTextColor="#666"
                  value={addressForm.streetAddress}
                  onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                  multiline
                />
              </View>

              {/* City Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Ciudad</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="ej. Sabaneta"
                  placeholderTextColor="#666"
                  value={addressForm.city}
                  onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                />
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Número Celular</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="+57 312 123 4567"
                  placeholderTextColor="#666"
                  value={addressForm.phoneNumber}
                  onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Default Address Toggle */}
              <View className="bg-ui-surface/55 rounded-2xl p-4 flex-row items-center justify-between mb-6">
                <Text className="text-text-primary font-semibold">Elegir como dirección predeterminada</Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                  trackColor={{ false: "#5B3A29", true: "#C34928" }}
                  thumbColor="white"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-brand-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                <Text className="text-white font-bold text-lg">
                  {isEditing ? "Guardar Cambios" : "Agregar Dirección"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;