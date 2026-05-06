import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme/colors';

interface Props {
  progress: number;
  height?: number;
  color?: string;
}

export const StatBar = ({ progress, height = 8, color = colors.primary }: Props) => {
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, sv]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${sv.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fill, animStyle, { backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fill: { height: '100%' },
});
