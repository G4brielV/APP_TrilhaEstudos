import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Trilha } from '@/src/types/models';
import { TrilhasService } from '@/src/services/trilhas';
import { THEME } from '@/src/theme/colors';
import { TrilhaCard } from '@/src/components/TrilhaCard';
import { AddButton } from '@/src/components/AddButton';


export default function Home() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTrilhas();
  }, []);

  async function carregarTrilhas() {
    try {
      const data = await TrilhasService.getAll();
      setTrilhas(data);
    } catch (error) {
      console.log("Falha na comunicação com a API");
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluirTrilha(id: number, titulo: string) {
    Alert.alert(
      "Excluir Trilha",
      `Tem certeza que deseja apagar a trilha "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: async () => {
            try {
              console.log('Swipe para remoção')
              await TrilhasService.delete(id);
              setTrilhas(trilhasAtuais => trilhasAtuais.filter(t => t.id !== id));
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a trilha no momento.");
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: THEME.background }]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={{ color: THEME.textSecondary, marginTop: 10 }}>Carregando trilhas...</Text>
      </View>
    );
  }

  return (
     <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Trilhas Disponíveis</Text>
        <AddButton onPress={() => console.log('Clicou em Adicionar')} />
      </View>
      <FlatList
        data={trilhas}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TrilhaCard 
            data={item} 
            onPress={() => console.log(`Navegar para trilha ID: ${item.id}`)} 
            onDelete={() => handleExcluirTrilha(item.id, item.titulo)}
          />
        )}
      />
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, 
    paddingBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: THEME.textPrimary 
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  }
});