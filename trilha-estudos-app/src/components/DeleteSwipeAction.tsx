import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue } from 'react-native-reanimated';

interface DeleteSwipeActionProps {
  onDelete: () => void;
  drag: SharedValue<number>;
}

export function DeleteSwipeAction({ onDelete, drag }: DeleteSwipeActionProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      drag.value,
      [-80, 0], 
      [1, 0.5], 
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onDelete} activeOpacity={0.8}>
      <Animated.View style={animatedStyle}>
        <Feather name="trash-2" size={24} color="#FFF" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    marginBottom: 16,
    borderRadius: 12,
    flex: 1,
  }
});