// ReactおよびReactNativeコンポーネント
import { Modal, Pressable, View, Switch } from "react-native";

// 外部コンポーネント
import { ThemedText } from "@/components/themed-text";
import { styles } from "@/components/styles";

type Props = {
  visible: boolean;
  sortEnabled: boolean;
  onClose: () => void;
  onToggleSort: (value: boolean) => void;
};

// オプションモーダルコンポーネント
export default function OptionModal({
  visible,
  sortEnabled,
  onClose,
  onToggleSort,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <ThemedText type="subtitle">オプション</ThemedText>

          <ThemedText>合計金額を表示</ThemedText>
          <Switch value={sortEnabled} onValueChange={onToggleSort} />
        </View>
      </Pressable>
    </Modal>
  );
}
