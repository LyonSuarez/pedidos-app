import { StyleSheet, View } from "react-native";
import HeaderAdmin from '../../components/HeaderAdmin';


export default function Pantalla() {
  return (
  <View style={styles.container}>
    <HeaderAdmin titulo="PEDIDOS" />
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
});
