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
import { Conteudo } from '../types/models';

interface ConteudoFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { titulo: string; url?: string; tipo?: string }) => Promise<void>;
  conteudo?: Conteudo | null; // Se informado, modo de edição
}

const TIPO_OPTIONS = [
  { value: 'artigo', label: 'Artigo', icon: 'file-text' },
  { value: 'video', label: 'Vídeo', icon: 'youtube' },
  { value: 'curso', label: 'Curso', icon: 'book-open' },
  { value: 'podcast', label: 'Podcast', icon: 'headphones' },
  { value: 'documentacao', label: 'Docs', icon: 'code' },
];

export function ConteudoFormModal({ visible, onClose, onSubmit, conteudo }: ConteudoFormModalProps) {
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [tipo, setTipo] = useState('artigo');
  const [loading, setLoading] = useState(false);

  const isEditing = !!conteudo;

  useEffect(() => {
    if (conteudo) {
      setTitulo(conteudo.titulo);
      setUrl(conteudo.url || '');
      setTipo(conteudo.tipo || 'artigo');
    } else {
      setTitulo('');
      setUrl('');
      setTipo('artigo');
    }
  }, [conteudo, visible]);

  async function handleSubmit() {
    if (!titulo.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        url: url.trim() || undefined,
        tipo,
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Editar Conteúdo' : 'Novo Conteúdo'}
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
              placeholder="Ex: Introdução ao TypeScript"
              placeholderTextColor={THEME.textSecondary + '80'}
              autoFocus
            />
          </View>

          {/*URL*/}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://..."
              placeholderTextColor={THEME.textSecondary + '80'}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/*Tipo*/}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.tipoGrid}>
              {TIPO_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.tipoOption,
                    tipo === option.value && styles.tipoOptionSelected,
                  ]}
                  onPress={() => setTipo(option.value)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={option.icon as any}
                    size={16}
                    color={tipo === option.value ? THEME.primary : THEME.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tipoLabel,
                      tipo === option.value && styles.tipoLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botão de ação */}
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
                  {isEditing ? 'Salvar Alterações' : 'Adicionar Conteúdo'}
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
  tipoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  tipoOptionSelected: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 210, 135, 0.1)',
  },
  tipoLabel: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  tipoLabelSelected: {
    color: THEME.primary,
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