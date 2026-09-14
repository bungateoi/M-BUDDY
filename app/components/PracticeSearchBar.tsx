import { StyleSheet, TextInput, View } from 'react-native';
import { SearchIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

export function PracticeSearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm khách hàng theo tên',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.wrap}>
      <SearchIcon size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors2.whiteMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    height: 44,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    paddingHorizontal: spacing2.md,
  },
  input: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 14, color: colors2.white, padding: 0 },
});
