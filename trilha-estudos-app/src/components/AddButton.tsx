import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../theme/colors';

interface AddButtonProps {
  onPress: () => void;
}

export function AddButton({ onPress }: AddButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.addButton}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Feather name="plus" size={24} color={THEME.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 210, 135, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});