// ReactおよびReactNativeコンポーネント
import { TextInput, View } from "react-native";

// 外部コンポーネント
import { Feather } from "@expo/vector-icons";
import { styles } from "@/components/styles";
import { ThemedText } from "@/components/themed-text";
import { Item } from "@/types/types";

// コンポーネントのpropsの型定義
type Props = {
  item: Item;
  onUpdateItem: (
    sectionId: string,
    itemId: string,
    newName: string,
    newAmount: number,
  ) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  editingAmountItemId: string | null;
  setEditingAmountItemId: (id: string | null) => void;
  temp: string;
  setTemp: (value: string) => void;
  section_id: string;
  headerClicked: boolean;
};

export default function ItemTab({
  item,
  onUpdateItem,
  onDeleteItem,
  editingItemId,
  setEditingItemId,
  editingAmountItemId,
  setEditingAmountItemId,
  temp,
  setTemp,
  section_id,
  headerClicked,
}: Props) {
  return (
    <View key={item.id} style={styles.item}>
      {/* アイテム名 */}
      {editingItemId === item.id ? (
        <TextInput
          onPress={() => setTemp(item.name)}
          value={temp}
          onChangeText={setTemp}
          autoFocus
          onBlur={() => {
            onUpdateItem(section_id, item.id, temp, item.amount);
            setEditingItemId(null);
          }}
          style={styles.titleInput}
        />
      ) : (
        <ThemedText
          style={styles.itemName}
          onPress={(e) => {
            e.stopPropagation();
            setTemp(item.name);
            setEditingItemId(item.id);
          }}
        >
          {item.name}
        </ThemedText>
      )}
      {/* アイテム金額 */}
      {editingAmountItemId === item.id ? (
        <TextInput
          value={temp}
          keyboardType="numeric"
          onChangeText={setTemp}
          autoFocus
          onBlur={() => {
            onUpdateItem(section_id, item.id, item.name, Number(temp) || 0);
            setEditingAmountItemId(null);
          }}
          style={styles.titleInput}
        />
      ) : (
        <ThemedText
          style={styles.amount}
          onPress={(e) => {
            e.stopPropagation();
            setTemp(item.amount.toString());
            setEditingAmountItemId(item.id);
          }}
        >
          ¥{item.amount.toString()}
        </ThemedText>
      )}
      {/* アイテム削除ボタン */}
      {headerClicked && (
        <Feather
          name="trash-2"
          size={16}
          color="#ef4444"
          onPress={(e) => {
            e.stopPropagation();
            onDeleteItem(section_id, item.id);
          }}
        />
      )}
    </View>
  );
}
