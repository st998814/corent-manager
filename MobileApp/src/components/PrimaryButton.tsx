
import { TouchableOpacity, Text } from 'react-native';

// need props for button title, onPress function, and optional disabled state 
type PrimaryButtonProps = {
  style?: object; // optional style prop for custom styling
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({ style,title, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}
