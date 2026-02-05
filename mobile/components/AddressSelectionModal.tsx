import { useAddresses } from "@/hooks/useAddresses";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const FOOTER_HEIGHT = 96;

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses, isLoading: addressesLoading } = useAddresses();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-brand-secondary/50">
        <View 
          style={{
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0,
            bottom: 0,
          }}
          className="bg-ui-surface/55"
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-brand-secondary/30">
            <Text className="text-brand-secondary text-2xl font-bold">Elegir Dirección de Envío</Text>
            <TouchableOpacity onPress={onClose} className="bg-brand-secondary/20 rounded-full p-2">
              <Ionicons name="close" size={24} color="#5B3A29" />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 16,
              paddingBottom: FOOTER_HEIGHT + 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {addressesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#5B3A29" />
              </View>
            ) : (
              <View className="gap-3">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-ui-surface/40 rounded-3xl p-4 border-2 ${
                      selectedAddress?._id === address._id
                        ? "border-brand-primary"
                        : "border-brand-secondary/30"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-brand-secondary font-bold text-lg mr-2">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-brand-accent rounded-full px-3 py-1">
                              <Text className="text-white text-sm font-semibold">Predeterminada</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                          {address.fullName}
                        </Text>
                        <Text className="text-text-secondary text-base leading-6 mb-1">
                          {address.streetAddress}
                        </Text>
                        <Text className="text-text-secondary text-base mb-2">
                          {address.city}
                        </Text>
                        <Text className="text-text-secondary text-base">{address.phoneNumber}</Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-brand-primary/40 rounded-full p-2 ml-3">
                          <Ionicons name="checkmark" size={24} color="#5B3A29" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View 
            style={{ height: FOOTER_HEIGHT }}
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-secondary/30 bg-ui-surface/50"
          >
            <TouchableOpacity
              className="bg-brand-primary rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#5B3A29" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      Continuar
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;