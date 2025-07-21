import { StyleSheet, Text, View } from 'react-native';

export default function HeaderAdmin({ titulo }: { titulo: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#662d58', // violeta oscuro
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginTop: 40,
    marginBottom: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
  },
  titulo: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
