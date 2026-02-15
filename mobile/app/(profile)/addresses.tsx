import AddressCard from "@/components/AddressCard";
import { Header } from "@/components/Header";
import AddressFormModal from "@/components/AddressFormModal";
import SafeScreen from "@/components/SafeScreen";
import { ErrorState } from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { useAddresses } from "@/hooks/useAddresses";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";

function AddressesScreen() {
  const {
    addAddress,
    addresses,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isError,
    isLoading,
    isUpdatingAddress,
    updateAddress,
  } = useAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    phoneNumber: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert("Eliminar Dirección", `¿Estás seguro de eliminar la dirección: ${label}?`, [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: () => deleteAddress(addressId , {
          onSuccess: () => Alert.alert("Éxito", "Dirección eliminada exitosamente"),
          onError: (error: any) =>
            Alert.alert("Error", error?.response?.data?.error || "Error al eliminar la dirección"),
          }
        ),
      },
    ]);
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.phoneNumber
    ) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    if (editingAddressId) {
      // update an existing address
      updateAddress(
        {
          addressId: editingAddressId,
          addressData: addressForm,
        },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddressId(null);
            Alert.alert("Éxito", "Dirección actualizada exitosamente");
          },
          onError: (error: any) => {
            Alert.alert("Error", error?.response?.data?.error || "Error al actualizar la dirección");
          },
        }
      );
    } else {
      // create new address
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);
          Alert.alert("Éxito", "Dirección creada exitosamente");
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Error al crear la dirección");
        },
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  if (isLoading && addresses.length === 0) return <SafeScreen><LoadingState /></SafeScreen>;
  if (isError && addresses.length === 0) return <SafeScreen><ErrorState /></SafeScreen>;

  return (
    <SafeScreen>
      <Header header="Direcciones" />

      {!isLoading && addresses.length === 0 ? (
        <EmptyState
          icon="location-outline"
          title="No tienes direcciones registradas"
          description="Agrega tu dirección de entrega"
        >
          <TouchableOpacity
            className="bg-brand-primary rounded-2xl py-4 px-6 items-center"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-white font-bold text-base">
              Agregar Dirección
            </Text>
          </TouchableOpacity>
        </EmptyState>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isUpdatingAddress}
                isDeletingAddress={isDeletingAddress}
              />
            ))}

            <TouchableOpacity
              className="bg-brand-primary rounded-2xl py-4 items-center mt-2"
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text className="text-white font-bold text-base ml-2">Agregar Dirección</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  );
}
export default AddressesScreen;
