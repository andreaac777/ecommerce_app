import { View, Text } from "react-native";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
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

          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">Costo de Envío</Text>
            <Text className="text-text-primary font-semibold text-base">
              ${shipping}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-base">IVA (19%)</Text>
            <Text className="text-text-primary font-semibold text-base">${tax}</Text>
          </View>

          {/* Divider */}
          <View className="border-t border-brand-secondary/30 pt-3 mt-1" />

          {/* Total */}
          <View className="flex-row justify-between items-center">
            <Text className="text-brand-secondary font-bold text-lg">Total</Text>
            <Text className="text-brand-accent font-bold text-2xl">${total} COP</Text>
          </View>
        </View>
      </View>
    </View>
  );
}