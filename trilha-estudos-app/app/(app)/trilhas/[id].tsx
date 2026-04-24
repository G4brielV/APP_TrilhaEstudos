import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { TrilhasService } from '../../../src/services/trilhas';
import { ConteudosService } from '../../../src/services/conteudos';
import { Trilha, Conteudo } from '../../../src/types/models';
import { THEME } from '../../../src/theme/colors';
import { ConteudoCard } from '../../../src/components/ConteudoCard';
import { AddButton } from '../../../src/components/AddButton';
import { ConteudoFormModal } from '../../../src/components/ConteudoFormModal';
import { TrilhaFormModal } from '../../../src/components/TrilhaFormModal';

export default function TrilhaDetalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal de conteúdo
  const [conteudoModalVisible, setConteudoModalVisible] = useState(false);
  const [editingConteudo, setEditingConteudo] = useState<Conteudo | null>(null);

  // Modal de editar trilha (título, descrição, ícone)
  const [trilhaModalVisible, setTrilhaModalVisible] = useState(false);

  useEffect(() => {
    if (id) carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      const trilhaData = await TrilhasService.getById(id!);
      setTrilha(trilhaData);
      setConteudos(trilhaData.conteudos || []);
    } catch (error) {
      console.log("Falha ao carregar dados da trilha");
      Alert.alert("Erro", "Não foi possível carregar os dados da trilha.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    carregarDados();
  }

  // ── EDITAR TRILHA ──
  async function handleEditTrilha(data: { titulo: string; descricao?: string; icone?: string }) {
    if (!trilha) return;
    try {
      const updated = await TrilhasService.update(trilha.id, data);
      setTrilha(prev => prev ? { ...prev, ...updated } : prev);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a trilha.");
      throw error;
    }
  }

  // ── CREATE CONTEÚDO ──
  function handleOpenCreateConteudo() {
    setEditingConteudo(null);
    setConteudoModalVisible(true);
  }

  // ── EDIT CONTEÚDO ──
  function handleOpenEditConteudo(conteudo: Conteudo) {
    setEditingConteudo(conteudo);
    setConteudoModalVisible(true);
  }

  async function handleSubmitConteudo(data: { titulo: string; url?: string; tipo?: string }) {
    try {
      if (editingConteudo) {
        const updated = await ConteudosService.update(editingConteudo.id, data);
        setConteudos(prev => prev.map(c => c.id === editingConteudo.id ? updated : c));
      } else {
        const created = await ConteudosService.create({
          ...data,
          trilhaId: Number(id),
        });
        setConteudos(prev => [...prev, created]);
      }
    } catch (error) {
      Alert.alert("Erro", editingConteudo
        ? "Não foi possível atualizar o conteúdo."
        : "Não foi possível criar o conteúdo."
      );
      throw error;
    }
  }

  // ── TOGGLE (Completo) ──
  async function handleToggleStatus(conteudo: Conteudo) {
    try {
      const updated = await ConteudosService.toggleStatus(conteudo.id, !conteudo.isCompleted);
      setConteudos(prev =>
        prev.map(c => c.id === conteudo.id ? { ...c, isCompleted: updated.isCompleted } : c)
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status do conteúdo.");
    }
  }

  // ── DELETE CONTEÚDO ──
  async function handleExcluirConteudo(conteudoId: number, titulo: string) {
    Alert.alert(
      "Excluir Conteúdo",
      `Tem certeza que deseja apagar "${titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await ConteudosService.delete(conteudoId);
              setConteudos(prev => prev.filter(c => c.id !== conteudoId));
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o conteúdo.");
            }
          },
        },
      ]
    );
  }

  // ── Contadores ──
  const totalConteudos = conteudos.length;
  const completedConteudos = conteudos.filter(c => c.isCompleted).length;
  const progressPercent = totalConteudos > 0 ? Math.round((completedConteudos / totalConteudos) * 100) : 0;

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: THEME.background }]}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={{ color: THEME.textSecondary, marginTop: 10 }}>Carregando conteúdos...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          title: trilha?.titulo || 'Detalhes da Trilha',
          headerStyle: { backgroundColor: THEME.background },
          headerTintColor: THEME.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setTrilhaModalVisible(true)}
              style={styles.headerEditButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="edit-2" size={18} color={THEME.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Trilha Info Header */}
      {trilha?.descricao && (
        <View style={styles.trilhaInfoSection}>
          <Text style={styles.trilhaDescription} numberOfLines={3}>
            {trilha.descricao}
          </Text>
        </View>
      )}

      {/* Progress Header */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <View style={styles.progressTexts}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressValue}>{progressPercent}%</Text>
          </View>
          <Text style={styles.progressCount}>
            {completedConteudos} de {totalConteudos} concluído{totalConteudos !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Subheader */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Conteúdos</Text>
        <AddButton onPress={handleOpenCreateConteudo} />
      </View>

      <FlatList
        data={conteudos}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ConteudoCard
            data={item}
            onPress={() => handleOpenEditConteudo(item)}
            onDelete={() => handleExcluirConteudo(item.id, item.titulo)}
            onToggleStatus={() => handleToggleStatus(item)}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>Nenhum conteúdo</Text>
            <Text style={styles.emptySubtitle}>
              Adicione artigos, vídeos e cursos à sua trilha
            </Text>
          </View>
        }
      />

      {/* Modal de Conteúdo */}
      <ConteudoFormModal
        visible={conteudoModalVisible}
        onClose={() => setConteudoModalVisible(false)}
        onSubmit={handleSubmitConteudo}
        conteudo={editingConteudo}
      />

      {/* Modal de Editar Trilha (título, descrição, ícone) */}
      <TrilhaFormModal
        visible={trilhaModalVisible}
        onClose={() => setTrilhaModalVisible(false)}
        onSubmit={handleEditTrilha}
        trilha={trilha}
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
    alignItems: 'center',
  },
  headerEditButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 210, 135, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  trilhaInfoSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  trilhaDescription: {
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  progressInfo: {
    marginBottom: 12,
  },
  progressTexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.primary,
  },
  progressCount: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: THEME.primary,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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
