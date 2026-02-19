import { View, Text } from "react-native";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  discount?: number;
  couponLabel?: string | null;
}

export default function OrderSummary({ subtotal, shipping, total, discount = 0, couponLabel = null }: OrderSummaryProps) {
  return (
    <View className="px-6 mt-6">
      <View className="bg-ui-surface/55 rounded-3xl p-5">

        <Text className="text-brand-primary text-xl font-bold mb-4">Resumen</Text>

        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Subtotal</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${subtotal}
            </Text>
          </View>

          {discount > 0 && couponLabel && (
            <View className="flex-row justify-between items-center">
              <Text className="text-brand-primary text-base">{couponLabel}</Text>
              <Text className="text-brand-primary font-semibold text-base">
                -${discount}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Costo de Envío</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${shipping}
            </Text>
          </View>

          <View className="border-t border-brand-secondary/30 pt-3 mt-1" />

          <View className="flex-row justify-between items-center">
            <Text className="text-brand-secondary font-bold text-lg">Total</Text>
            <Text className="text-brand-accent font-bold text-2xl">${total} COP</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
