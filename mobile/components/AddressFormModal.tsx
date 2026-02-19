import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, Alert } from "react-native";
import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { AddressFormData, MUNICIPALITIES, validateAddressForm, isValidName, sanitizePhone } from "../lib/addressValidationHelper";

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

  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleNameChange = (text: string) => {
    if (isValidName(text)) {
      onFormChange({ ...addressForm, fullName: text });
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = sanitizePhone(text);
    onFormChange({ ...addressForm, phoneNumber: cleaned });
  };

  const handleSave = () => {
    const validation = validateAddressForm(addressForm);
    
    if (!validation.isValid) {
      Alert.alert("Error", validation.errors.join("\n"));
      return;
    }
    
    onSave();
  };

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
                  onChangeText={handleNameChange}
                />               
                <Text className="text-text-secondary text-xs mt-1 ml-1">
                  * Solo puede contener caracteres alfabéticos
                </Text>
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
                <TouchableOpacity
                  className="bg-ui-surface/55 px-4 py-4 rounded-2xl flex-row items-center justify-between"
                  onPress={() => setShowCityDropdown(!showCityDropdown)}
                  activeOpacity={0.7}
                >
                  <Text className={addressForm.city ? "text-text-primary text-base" : "text-[#666] text-base"}>
                    {addressForm.city || "Seleccione un municipio"}
                  </Text>
                  <Ionicons 
                    name={showCityDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#5B3A29" 
                  />
                </TouchableOpacity>

                {showCityDropdown && (
                  <View className="bg-ui-surface/95 rounded-2xl mt-2 overflow-hidden border border-brand-secondary/20">
                    {MUNICIPALITIES.map((city, index) => (
                      <TouchableOpacity
                        key={city}
                        className={`px-4 py-4 ${
                          index < MUNICIPALITIES.length - 1
                        } ${addressForm.city === city ? "bg-brand-primary/10" : ""}`}
                        onPress={() => {
                          onFormChange({ ...addressForm, city });
                          setShowCityDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-text-primary text-base">{city}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">Número Celular</Text>
                <TextInput
                  className="bg-ui-surface/55 text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="3121234567"
                  placeholderTextColor="#666"
                  value={addressForm.phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                <Text className="text-text-secondary text-xs mt-1 ml-1">
                  {addressForm.phoneNumber.length}/10 dígitos
                </Text>
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
                onPress={handleSave}
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