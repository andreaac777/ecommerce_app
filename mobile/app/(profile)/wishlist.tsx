import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

    if (isLoading) return <LoadingUI />;
    if (isError) return <ErrorUI />;

    return (
        <SafeScreen>
            {/* HEADER */}
            <View className="px-6 pt-5 pb-5 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={28} color="#5B3A29" />
                </TouchableOpacity>
                <Text className="text-brand-secondary text-2xl font-bold">Lista de Deseos</Text>
                <Text className="text-text-secondary text-sm ml-auto">
                    {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </Text>
            </View>

            {wishlist.length === 0 ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="heart-outline" size={80} color="#666666" />
                    <Text className="text-text-primary font-semibold text-xl mt-4">
                        Tu lista de deseos está vacía
                    </Text>
                    <Text className="text-text-secondary text-center mt-2">
                        Te invitamos a descubrir nuestros productos
                    </Text>
                    <TouchableOpacity
                        className="bg-brand-primary rounded-2xl px-8 py-4 mt-6"
                        activeOpacity={0.8}
                        onPress={() => router.push("/(tabs)")}
                    >
                        <Text className="text-white font-bold">Ver Productos</Text>
                    </TouchableOpacity>
                </View>
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
                                <View className="flex-1"
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
                                    {isAddingToCart ? (
                                        <ActivityIndicator size="small" color="#5B3A29" />
                                    ) : (
                                        <Text className="text-white font-bold">Agregar al Carrito</Text>
                                    )}
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

function LoadingUI() {
    return (
        <SafeScreen>
            <View className="px-6 pt-5 pb-5 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={28} color="#5B3A29" />
                </TouchableOpacity>
                <Text className="text-brand-secondary text-2xl font-bold">Lista de Deseos</Text>
            </View>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#5B3A29" />
                <Text className="text-text-secondary mt-4">Cargando la lista de deseos...</Text>
            </View>
        </SafeScreen>
    );
}

function ErrorUI() {
    return (
        <SafeScreen>
            <View className="px-6 pt-5 pb-5 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={28} color="#5B3A29" />
                </TouchableOpacity>
                <Text className="text-brand-secondary text-2xl font-bold">Lista de Deseos</Text>
            </View>
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                <Text className="text-text-primary font-semibold text-xl mt-4">
                    Error al cargar la lista de deseos
                </Text>
                <Text className="text-text-secondary text-center mt-2">
                    Verifica tu conexión a internet e intenta nuevamente
                </Text>
            </View>
        </SafeScreen>
    );
}