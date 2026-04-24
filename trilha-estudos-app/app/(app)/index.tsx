import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { TrilhasService } from '../../src/services/trilhas';
import { AuthService } from '../../src/services/auth';
import { Trilha } from '../../src/types/models';
import { THEME } from '../../src/theme/colors';
import { TrilhaCard } from '../../src/components/TrilhaCard';
import { AddButton } from '../../src/components/AddButton';
import { TrilhaFormModal } from '../../src/components/TrilhaFormModal';

export default function Home() {
  const router = useRouter();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTrilha, setEditingTrilha] = useState<Trilha | null>(null);

  useEffect(() => {
    carregarTrilhas();
    loadUserInfo();
  }, []);

  async function loadUserInfo() {
    const user = await AuthService.getUser();
    if (user) setUserName(user.nome);
  }

  async function carregarTrilhas() {
    try {
      const response = await TrilhasService.getAll(1, 10);
      setTrilhas(response.data);
      setPage(1);
      setLastPage(response.meta.lastPage);
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token inválido — voltar para login
        router.replace('/(auth)/login' as any);
        return;
      }
      console.log("Falha na comunicação com a API");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function carregarMais() {
    if (loadingMore || page >= lastPage) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await TrilhasService.getAll(nextPage, 10);
      setTrilhas(prev => [...prev, ...response.data]);
      setPage(nextPage);
      setLastPage(response.meta.lastPage);
    } catch (error) {
      console.log("Erro ao carregar mais trilhas");
    } finally {
      setLoadingMore(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    carregarTrilhas();
  }

  async function handleLogout() {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AuthService.logout();
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
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

  function handleOpenCreate() {
    setEditingTrilha(null);
    setModalVisible(true);
  }

  function handleOpenEdit(trilha: Trilha) {
    setEditingTrilha(trilha);
    setModalVisible(true);
  }

  async function handleSubmitTrilha(data: { titulo: string; descricao?: string; icone?: string }) {
    try {
      if (editingTrilha) {
        const updated = await TrilhasService.update(editingTrilha.id, data);
        setTrilhas(prev => prev.map(t => t.id === editingTrilha.id ? updated : t));
      } else {
        const created = await TrilhasService.create(data);
        setTrilhas(prev => [created, ...prev]);
      }
    } catch (error) {
      Alert.alert("Erro", editingTrilha
        ? "Não foi possível atualizar a trilha."
        : "Não foi possível criar a trilha."
      );
      throw error;
    }
  }

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={THEME.primary} />
        <Text style={styles.footerText}>Carregando mais...</Text>
      </View>
    );
  };

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
      
      {/* Header com saudação e logout */}
      <View style={styles.header}>
        <View>
          {userName ? (
            <Text style={styles.greeting}>Olá, {userName.split(' ')[0]}! 👋</Text>
          ) : null}
          <Text style={styles.title}>Minhas Trilhas</Text>
        </View>
        <View style={styles.headerActions}>
          <AddButton onPress={handleOpenCreate} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Feather name="log-out" size={20} color={THEME.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={trilhas}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TrilhaCard 
            data={item} 
            onPress={() => router.push(`/(app)/trilhas/${item.id}` as any)}
            onDelete={() => handleExcluirTrilha(item.id, item.titulo)}
            onLongPress={() => handleOpenEdit(item)}
          />
        )}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Nenhuma trilha ainda</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão + para criar sua primeira trilha de estudos
            </Text>
          </View>
        }
      />

      <TrilhaFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitTrilha}
        trilha={editingTrilha}
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
  greeting: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: 4,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: THEME.textPrimary 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
