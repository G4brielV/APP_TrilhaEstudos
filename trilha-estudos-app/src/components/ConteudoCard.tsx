import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';

import { Conteudo } from '../types/models';
import { THEME } from '../theme/colors';
import { DeleteSwipeAction } from './DeleteSwipeAction';

interface ConteudoCardProps {
  data: Conteudo;
  onPress?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

const TIPO_ICONS: Record<string, string> = {
  artigo: 'file-text',
  video: 'youtube',
  curso: 'book-open',
  podcast: 'headphones',
  documentacao: 'code',
};

const TIPO_COLORS: Record<string, string> = {
  artigo: '#6C8EEF',
  video: '#FF6B6B',
  curso: '#FFB84D',
  podcast: '#A78BFA',
  documentacao: '#34D399',
};

export function ConteudoCard({ data, onPress, onDelete, onToggleStatus }: ConteudoCardProps) {
  const swipeableRef = useRef<any>(null);

  const triggerDelete = () => {
    swipeableRef.current?.close();
    if (onDelete) onDelete();
  };

  const tipoIcon = TIPO_ICONS[data.tipo] || 'file';
  const tipoColor = TIPO_COLORS[data.tipo] || THEME.textSecondary;

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      overshootRight={true}
      rightThreshold={40}
      onSwipeableWillOpen={() => {
        triggerDelete();
      }}
      renderRightActions={(prog: SharedValue<number>, drag: SharedValue<number>) => (
        <DeleteSwipeAction onDelete={triggerDelete} drag={drag} />
      )}
    >
      <View style={[styles.card, data.isCompleted && styles.cardCompleted]}>
        <View style={styles.cardContent}>
          {/* Checkbox de status */}
          <TouchableOpacity
            style={[styles.checkbox, data.isCompleted && styles.checkboxCompleted]}
            onPress={onToggleStatus}
            activeOpacity={0.7}
          >
            {data.isCompleted && (
              <Feather name="check" size={14} color="#FFF" />
            )}
          </TouchableOpacity>

          {/* Principal */}
          <TouchableOpacity style={styles.info} onPress={onPress} activeOpacity={0.7}>
            <Text
              style={[styles.title, data.isCompleted && styles.titleCompleted]}
              numberOfLines={1}
            >
              {data.titulo}
            </Text>
            <View style={styles.meta}>
              <View style={[styles.tipoBadge, { backgroundColor: tipoColor + '20' }]}>
                <Feather name={tipoIcon as any} size={12} color={tipoColor} />
                <Text style={[styles.tipoText, { color: tipoColor }]}>
                  {data.tipo}
                </Text>
              </View>
              {data.url && (
                <View style={styles.urlIndicator}>
                  <Feather name="link" size={12} color={THEME.textSecondary} />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Feather name="chevron-right" size={18} color={THEME.textSecondary + '60'} />
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardCompleted: {
    opacity: 0.65,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME.textSecondary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  tipoText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  urlIndicator: {
    opacity: 0.6,
  },
});
