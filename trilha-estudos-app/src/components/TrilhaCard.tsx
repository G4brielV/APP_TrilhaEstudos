import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';

import { Trilha } from '../types/models';
import { THEME } from '../theme/colors';
import { DeleteSwipeAction } from './DeleteSwipeAction';

interface TrilhaCardProps {
  data: Trilha;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TrilhaCard({ data, onPress, onDelete }: TrilhaCardProps) {
  // Referência para controlar o estado do swipe
  const swipeableRef = useRef<any>(null);

  const triggerDelete = () => {
    swipeableRef.current?.close(); 
    if (onDelete) onDelete();      
  };

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
      <TouchableOpacity style={styles.card} activeOpacity={1} onPress={onPress}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{data.titulo}</Text>
          <Feather name="chevron-right" size={20} color={THEME.textSecondary} />
        </View>
        
        {data.descricao && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {data.descricao}
          </Text>
        )}
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: THEME.surface, 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: THEME.textPrimary,
    flex: 1, 
  },
  cardDescription: {
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
  }
});