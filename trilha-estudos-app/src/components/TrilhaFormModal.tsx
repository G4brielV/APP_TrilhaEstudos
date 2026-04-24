import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../theme/colors';
import { Trilha } from '../types/models';

interface TrilhaFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { titulo: string; descricao?: string; icone?: string }) => Promise<void>;
  trilha?: Trilha | null;
}

const ICON_OPTIONS = ['book', 'code', 'video', 'music', 'globe', 'cpu', 'layers', 'zap'];

export function TrilhaFormModal({ visible, onClose, onSubmit, trilha }: TrilhaFormModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [icone, setIcone] = useState('book');
  const [loading, setLoading] = useState(false);

  const isEditing = !!trilha;

  useEffect(() => {
    if (trilha) {
      setTitulo(trilha.titulo);
      setDescricao(trilha.descricao || '');
      setIcone(trilha.icone || 'book');
    } else {
      setTitulo('');
      setDescricao('');
      setIcone('book');
    }
  }, [trilha, visible]);

  async function handleSubmit() {
    if (!titulo.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        icone,
      });
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Editar Trilha' : 'Nova Trilha'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={22} color={THEME.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/*Título*/}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Estudos de React Native"
              placeholderTextColor={THEME.textSecondary + '80'}
              autoFocus
            />
          </View>

          {/*Descrição*/}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descreva sua trilha de estudos..."
              placeholderTextColor={THEME.textSecondary + '80'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/*Ícone*/}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ícone</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconOption,
                    icone === iconName && styles.iconOptionSelected,
                  ]}
                  onPress={() => setIcone(iconName)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={iconName as any}
                    size={20}
                    color={icone === iconName ? THEME.primary : THEME.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/*Botão de ação*/}
          <TouchableOpacity
            style={[styles.submitButton, !titulo.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || !titulo.trim()}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Feather
                  name={isEditing ? 'check' : 'plus'}
                  size={18}
                  color="#FFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Salvar Alterações' : 'Criar Trilha'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: THEME.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: THEME.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: THEME.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  iconOptionSelected: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 210, 135, 0.1)',
  },
  submitButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
