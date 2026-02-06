import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

const FOOTER_HEIGHT = 96;

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  productRatings: { [key: string]: number };
  onRatingChange: (productId: string, rating: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

const RatingModal = ({
  visible,
  onClose,
  order,
  productRatings,
  onRatingChange,
  onSubmit,
  isSubmitting,
}: RatingModalProps) => {
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
            <View className="flex-1">
              <Text className="text-brand-secondary text-2xl font-bold">
                Calificar Productos
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Evalúa cada producto de tu pedido
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-brand-secondary/20 rounded-full p-2">
              <Ionicons name="close" size={24} color="#5B3A29" />
            </TouchableOpacity>
          </View>

          {/* PRODUCTS LIST */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingVertical: 16,
              paddingBottom: FOOTER_HEIGHT + 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-3">
              {order?.orderItems.map((item, index) => {
                const productId = item.product._id;
                const currentRating = productRatings[productId] || 0;

                return (
                  <View
                    key={item._id}
                    className={`bg-ui-surface/40 rounded-3xl p-4 ${
                      index < order.orderItems.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    {/* Product Info */}
                    <View className="flex-row items-start mb-4">
                      <View
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 16,
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <Image
                          source={{ uri: item.product.images?.[0] }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="contain"
                        />
                      </View>
                      <View className="flex-1 ml-4">
                        <Text className="text-brand-secondary font-bold text-lg mb-1">
                          {item.name}
                        </Text>
                        <Text className="text-text-secondary text-base">
                          Cantidad: {item.quantity}
                        </Text>
                        <Text className="text-brand-accent font-semibold text-lg mt-1">
                          ${item.price} COP
                        </Text>
                      </View>
                    </View>

                    {/* Rating Stars */}
                    <View className="flex-row justify-center items-center py-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => onRatingChange(productId, star)}
                          activeOpacity={0.7}
                          className="mx-1.5"
                        >
                          <Ionicons
                            name={star <= currentRating ? "star" : "star-outline"}
                            size={36}
                            color={star <= currentRating ? "#F6B26B" : "#5B3A29"}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Rating Label */}
                    {currentRating > 0 && (
                      <Text className="text-center text-text-secondary font-semibold text-sm mt-2">
                        {RATING_LABELS[currentRating]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View 
            style={{ height: FOOTER_HEIGHT }}
            className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-secondary/30 bg-ui-surface/50 items-center justify-center"
          >
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 h-14 bg-brand-primary rounded-2xl items-center justify-center"
                activeOpacity={0.9}
                onPress={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#5B3A29" />
                ) : (             
                  <Text className="text-white font-bold text-base text-center px-2">
                    Enviar Calificaciones
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 h-14 bg-brand-secondary/20 rounded-2xl items-center justify-center"
                activeOpacity={0.7}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text className="text-brand-secondary font-bold text-base text-center">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;