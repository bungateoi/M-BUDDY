import { StyleSheet, View, ViewProps } from 'react-native';
import { cardShadow, colors, radii, spacing } from './theme';

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...cardShadow,
  },
});
