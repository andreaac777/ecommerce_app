import AddressCard from "@/components/AddressCard";
import AddressHeader from "@/components/AddressHeader";
import AddressFormModal from "@/components/AddressFormModal";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddresses";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

  if (isLoading && !addresses) return <LoadingUI />;
  if (isError && !addresses) return <ErrorUI />;

  return (
    <SafeScreen>
      <AddressHeader />

      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#666" />
          <Text className="text-text-primary font-semibold text-xl mt-4">No tienes direcciones registradas</Text>
          <Text className="text-text-secondary text-center mt-2">
            Agrega tu direccion de entrega
          </Text>
          <TouchableOpacity
            className="bg-brand-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-white font-bold text-base">Agregar Dirección</Text>
          </TouchableOpacity>
        </View>
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

function ErrorUI() {
  return (
    <SafeScreen>
      <AddressHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Error al cargar tus direcciones
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Por favor, verifica tu conexión e intenta nuevamente
        </Text>
      </View>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen>
      <AddressHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#5B3A29" />
        <Text className="text-text-secondary mt-4">Cargando tus direcciones...</Text>
      </View>
    </SafeScreen>
  );
}