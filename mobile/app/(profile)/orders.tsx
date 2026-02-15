import RatingModal from "@/components/RatingModal";
import SafeScreen from "@/components/SafeScreen";
import { Header } from "@/components/Header";
import { ErrorState } from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { formatDate, getOrderStatus } from "@/lib/utils";
import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function OrdersScreen() {
  const { data: orders, isLoading, isError } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{ [key: string]: number }>({});

  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);

    // init ratings for all product to 0 
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    // check if all products have been rated
    const allRated = Object.values(productRatings).every((rating) => rating > 0);
    if (!allRated) {
      Alert.alert("Error", "Por favor, califica todos los productos");
      return;
    }

    try {
      const results = await Promise.allSettled(
        selectedOrder.orderItems.map((item) =>
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRatings[item.product._id],
          })
        )
      );

      const failures = results.filter((r) => r.status === "rejected");
      if (failures.length > 0) {
        Alert.alert("Error", `${failures.length} calificación(es) no se enviaron. Intenta nuevamente.`);
        return;
      }

      Alert.alert("Éxito", "Gracias por calificar todos los productos!");
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRatings({});
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.error || "Error al enviar la calificación");
    }
  };

  return (
    <SafeScreen>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : !orders || orders.length === 0 ? (
        <EmptyState title="No has realizado pedidos" description="Tu historial de pedidos aparecerá aquí" icon="receipt-outline" header="Pedidos" />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Header header="Pedidos" />
          <View className="px-6 py-4">
            {orders.map((order) => {
              const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
              const { label: statusLabel, color: statusColor } = getOrderStatus(order.status);
              return (
                <View key={order._id} className="bg-ui-surface/40 rounded-3xl p-5 mb-4">
                  <View className="flex-row mb-4">
                    <View className="flex-1">
                      <Text className="text-brand-secondary font-bold text-base mb-1">
                        Pedido #{order._id.slice(-8).toUpperCase()}
                      </Text>
                      <Text className="text-text-secondary text-sm mb-2">
                        {formatDate(order.createdAt)}
                      </Text>
                      <View
                        className="self-start px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: statusColor + "20" }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: statusColor }}
                        >
                          {statusLabel}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ORDER ITEMS SUMMARY */}
                  {order.orderItems.map((item, index) => (
                    <Text
                      key={item._id}
                      className="text-text-secondary text-sm flex-1"
                      numberOfLines={1}
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                  <View className="border-t border-brand-secondary/30 pt-3 flex-row justify-between items-center">
                    <View>
                      <Text className="text-text-secondary text-xs mb-1">{totalItems} productos</Text>
                      <Text className="text-brand-accent font-bold text-xl">
                        ${order.totalPrice} COP
                      </Text>
                    </View>

                    {order.status === "delivered" &&
                      (order.hasReviewed ? (
                        <View className="bg-brand-secondary/15 px-5 py-3 rounded-full flex-row items-center">
                          <Ionicons name="checkmark-circle" size={18} color="#C34928" />
                          <Text className="text-brand-secondary font-bold text-sm ml-2">Calificado</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="bg-brand-primary px-5 py-3 rounded-full flex-row items-center"
                          activeOpacity={0.7}
                          onPress={() => handleOpenRating(order)}
                        >
                          <Ionicons name="star" size={18} color="#FFFFFF" />
                          <Text className="text-white font-bold text-sm ml-2">
                            Calificar
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
      />
    </SafeScreen>
  );
}
export default OrdersScreen;