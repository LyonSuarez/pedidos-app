import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { users } from "../../lib/users";

export default function MenuCliente() {
  const { username } = useLocalSearchParams();
  const user = users.find((u) => u.username === username);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al menú, {user?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" }
});
