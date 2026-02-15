import SafeScreen from "@/components/SafeScreen";
import { Header } from "@/components/Header";
import { ErrorState } from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function WishlistScreen() {
    const { wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist } = useWishlist();

    const { addToCart, isAddingToCart } = useCart();

    const handleRemoveFromWishlist = (productId: string, productName: string) => {
        Alert.alert("Eliminar de la lista de deseos", `${productName}`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",

                onPress: () => removeFromWishlist(productId),
            },
        ]);
    };

    const handleAddToCart = (productId: string, productName: string) => {
        addToCart(
            { productId, quantity: 1 },
            {
                onSuccess: () => Alert.alert("Producto agregado al carrito", `${productName}`),
                onError: (error: any) => {
                    Alert.alert("Error", error?.response?.data?.error || "No se pudo agregar el producto al carrito");
                },
            }
        );
    };

    if (isLoading) return <SafeScreen><LoadingState /></SafeScreen>;
    if (isError) return <SafeScreen><ErrorState /></SafeScreen>;

    return (
        <SafeScreen>
            <Header header="Lista de Deseos" />
            {wishlist.length === 0 ? (
                <EmptyState
                    icon="heart-outline"
                    title="Tu lista de deseos está vacía"
                    description="Te invitamos a descubrir nuestros productos"
                />
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View className="px-6 py-4">
                        {wishlist.map((item) => (
                            <TouchableOpacity
                                key={item._id}
                                className="bg-ui-surface/55 rounded-3xl overflow-hidden mb-3"
                                activeOpacity={0.8}
                            // onPress={() => router.push(`/product/${item._id}`)}
                            >
                                <View className="flex-row p-4">
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
                                            source={item.images[0]}
                                            style={{ width: '100%', height: '100%' }}
                                            contentFit="contain"
                                        />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="text-text-primary font-bold text-base mb-2" numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <Text className="text-brand-accent font-bold text-xl mb-2">
                                            ${item.price} COP
                                        </Text>

                                        {item.stock > 0 ? (
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                                <Text className="text-green-500 text-sm font-semibold">
                                                    Disponible
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                <Text className="text-red-500 text-sm font-semibold">Agotado</Text>
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        className="self-start bg-red-500/20 p-2 rounded-full"
                                        activeOpacity={0.7}
                                        onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                                        disabled={isRemovingFromWishlist}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                                {item.stock > 0 && (
                                    <View className="px-4 pb-4">
                                        <TouchableOpacity
                                            className="bg-brand-primary rounded-xl py-3 items-center"
                                            activeOpacity={0.8}
                                            onPress={() => handleAddToCart(item._id, item.name)}
                                            disabled={isAddingToCart}
                                        >
                                            <Text className="text-white font-bold">Agregar al Carrito</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeScreen>
    );
}

export default WishlistScreen;

