import SafeScreen from "@/components/SafeScreen";
import { ErrorState } from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import useCart from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, TextInput } from "react-native";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isError, isLoading } = useProduct(id);
  const { addToCart, isAddingToCart } = useCart();

  const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } =
    useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [quantityText, setQuantityText] = useState("1");

  const clampQuantity = (value: number, stock: number) => {
    if (isNaN(value)) return 1;
    if (value < 1) return 1;
    if (value > stock) return stock;
    return value;
  };

  const updateQuantity = (value: number) => {
    if (!product) return;
    const clamped = clampQuantity(value, product.stock);
    setQuantity(clamped);
    setQuantityText(String(clamped));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () => Alert.alert("Éxito", `${product.name} agregado al carrito`),
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Error al agregar el producto al carrito");
        },
      }
    );
  };

  if (isLoading) return <SafeScreen><LoadingState /></SafeScreen>;
  if (isError || !product) return <SafeScreen><ErrorState /></SafeScreen>;

  const inStock = product.stock > 0;

  return (
    <SafeScreen backgroundColor="#FFFFFF">
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-brand-secondary/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center bg-brand-secondary/40 backdrop-blur-xl`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
          activeOpacity={0.7}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#5B3A29" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist(product._id) ? "#C34928" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-ui-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* IMAGE GALLERY */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image: string, index: number) => (
              <View key={index} style={{ width }}>
                <Image source={image} style={{ width, height: 300 }} contentFit="cover" />
              </View>
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === selectedImageIndex ? "bg-brand-accent w-6" : "bg-brand-secondary/50 w-2"
                }`}
              />
            ))}
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View className="p-6">
          {/* Category */}
          <View className="flex-row items-center mb-3">
            <View className="bg-brand-accent px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">{product.category}</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="text-text-primary text-3xl font-bold mb-3">{product.name}</Text>

          {/* Rating & Reviews */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center bg-brand-secondary/30 px-3 py-2 rounded-full">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="text-text-primary font-bold ml-1 mr-2">
                {product.averageRating.toFixed(1)}
              </Text>
              <Text className="text-text-secondary text-sm">({product.totalReviews} reviews)</Text>
            </View>
            {inStock ? (
              <View className="ml-3 flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-500 font-semibold text-sm">
                  Disponible
                </Text>
                <Text className="text-text-secondary text-sm"> ({product.stock})</Text>
              </View>
            ) : (
              <View className="ml-3 flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className="text-red-500 font-semibold text-sm">No Disponible</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Text className="text-brand-accent text-4xl font-bold">${ product.price } COP</Text>
          </View>

          {/* Quantity */}
          <View className="mb-6">
            <Text className="text-text-primary text-lg font-bold mb-3">Cantidad</Text>
            <View className="flex-row items-center">
              {/* DECREMENT */}
              <TouchableOpacity
                className="bg-brand-secondary/40 rounded-full w-12 h-12 items-center justify-center"
                onPress={() => updateQuantity(quantity - 1)}
                activeOpacity={0.7}
                disabled={!inStock || quantity <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={24} 
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {/* INPUT */}
              <TextInput
                value={quantityText}
                onChangeText={(text) => {
                  if (!/^\d*$/.test(text)) return;
                  setQuantityText(text);
                }}
                onBlur={() => updateQuantity(Number(quantityText))}
                keyboardType="number-pad"
                returnKeyType="done"
                editable={inStock}
                selectTextOnFocus
                maxLength={String(product.stock).length}
                className="mx-6 w-16 text-center text-brand-secondary text-xl font-bold bg-ui-surface/40 rounded-2xl"
              />

              {/* INCREMENT */}
              <TouchableOpacity
                className="bg-brand-secondary/40 rounded-full w-12 h-12 items-center justify-center"
                onPress={() => updateQuantity(quantity + 1)}
                activeOpacity={0.7}
                disabled={!inStock || quantity >= product.stock}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {quantity >= product.stock && inStock && (
              <Text className="text-orange-500 text-sm mt-2">Seleccionaste la cantidad máxima disponible</Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-text-primary text-lg font-bold mb-3">Descripción</Text>
            <Text className="text-text-secondary text-base leading-6">{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-brand-secondary/20 backdrop-blur-xl border-t border-brand-secondary/30 px-6 pt-2 pb-10">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-text-primary text-sm font-bold mb-1">Total</Text>
            <Text className="text-brand-accent text-2xl font-bold">
              ${(product.price * quantity).toLocaleString()} COP
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${
              !inStock ? "bg-brand-secondary/20" : "bg-brand-primary"
            }`}
            activeOpacity={0.8}
            onPress={handleAddToCart}
            disabled={!inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#5B3A29" />
            ) : (
              <>
                <Ionicons name="cart" size={24} color={"#FFFFFF"} />
                <Text
                  className={`font-bold text-lg ml-2 text-white`}
                >
                  {!inStock ? "No Disponible" : "Agregar al Carrito"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

export default ProductDetailScreen;
