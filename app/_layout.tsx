import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync(); // 🟡 Bloquea splash hasta que se cargue todo

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync(); // 🟢 Oculta splash al terminar carga
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="admin/index" options={{ headerShown: false }} />
          <Stack.Screen name="admin/menu" options={{ headerShown: false }} />
          <Stack.Screen name="admin/cargar-producto" options={{ headerShown: false }} />
          <Stack.Screen name="admin/productos" options={{ headerShown: false }} />
          <Stack.Screen name="admin/categorias" options={{ headerShown: false }} />
          <Stack.Screen name="admin/pedidos" options={{ headerShown: false }} />
          <Stack.Screen name="admin/proveedores" options={{ headerShown: false }} />
          <Stack.Screen name="admin/usuarios" options={{ headerShown: false }} />
          <Stack.Screen name="admin/ver-clientes" options={{ headerShown: false }} />
          <Stack.Screen name="admin/configuracion" options={{ headerShown: false }} />
          <Stack.Screen name="admin/modificar-precios" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/menu-cliente" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/productos" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/pedidos" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/perfil" options={{ headerShown: false }} />
          <Stack.Screen name="cliente/carrito" options={{ headerShown: false }} />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}



