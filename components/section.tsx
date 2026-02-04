// ReactおよびReactNativeコンポーネント
import { useEffect, useState, useMemo } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";

// 外部コンポーネント
import { Feather } from "@expo/vector-icons";
import { styles } from "@/components/styles";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ItemTab from "@/components/item";
import OptionModal from "@/components/optionModal";
import * as sectionService from "@/components/sectionService";
import { Section } from "@/types/types";

// コンポーネントのpropsの型定義
type Props = {
  section: Section;
  onUpdateSection: (id: string, title: string) => void;
  onDeleteSection: (id: string) => void;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
};

export default function SectionTab({
  section,
  onUpdateSection,
  onDeleteSection,
  setSections,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingAmountItemId, setEditingAmountItemId] = useState<string | null>(
    null,
  );
  const [headerClicked, setHeaderClicked] = useState(false);
  const [temp, setTemp] = useState("");
  const [title, setTitle] = useState(section.title);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [sortEnabled, setSortEnabled] = useState(false);

  // 合計金額を計算するメモ化された値
  const totalAmount = useMemo(() => {
    return section.data.reduce((sum, item) => sum + item.amount, 0);
  }, [section.data]);

  // props と state の同期
  useEffect(() => {
    setTitle(section.title);
  }, [section.title]);

  useEffect(() => {
    setSortEnabled(section.showTotal);
  }, [section.showTotal]);

  // セクションタイトル保存処理
  const saveTitle = () => {
    const trimmed = title.trim();
    if (trimmed.length > 0) {
      onUpdateSection(section.id, trimmed);
    } else {
      setTitle(section.title);
    }
    setEditing(false);
  };

  // セクション削除確認アラート
  const confirmDelete = () => {
    Alert.alert(`タブ "${section.title}"`, "このタブを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        style: "destructive",
        onPress: () => onDeleteSection(section.id),
      },
    ]);
  };

  // アイテム作成処理
  const handleCreateItem = async (sectionId: string) => {
    // DBのアイテム作成サービス関数を呼び出し
    const item = await sectionService.createItem(sectionId, "タイトル名");

    // 画面表示用のstateに引数sectionIdのセクションにアイテムを追加した後、更新する処理
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, data: [...section.data, item] }
          : section,
      ),
    );
  };

  // アイテム更新処理
  const handleUpdateItem = async (
    sectionId: string,
    itemId: string,
    newName: string,
    newAmount: number,
  ) => {
    // DBのアイテム更新サービス関数を呼び出し
    await sectionService.updateItem(itemId, newName, newAmount);

    // 画面表示用のstateの引数sectionIdのセクションに引数のitemIdと一致するアイテムを更新する処理
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          // アイテム配列内で引数itemIdと一致するアイテムを更新
          const updatedData = section.data.map((item) =>
            item.id === itemId
              ? { ...item, name: newName, amount: newAmount }
              : item,
          );
          return { ...section, data: updatedData };
        }
        return section;
      }),
    );
  };

  // アイテム削除処理
  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    // DBのアイテム削除サービス関数を呼び出し
    await sectionService.deleteItem(itemId);

    // 画面表示用のstateの引数sectionIdのセクションから引数のitemIdと一致しないアイテムをフィルタリングして更新する処理
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          // アイテム配列内で引数itemIdと一致しないアイテムをフィルタリング
          const updatedData = section.data.filter((item) => item.id !== itemId);
          return { ...section, data: updatedData };
        }
        return section;
      }),
    );
  };

  return (
    <>
      {/* セクション全体 */}
      <ThemedView style={styles.section}>
        {/* セクションのヘッダー部分 */}
        <Pressable
          onPress={() => setHeaderClicked(!headerClicked)}
          onLongPress={() => setOptionsVisible(true)}
        >
          <View style={styles.header}>
            {editing ? (
              <TextInput
                value={title}
                onChangeText={setTitle}
                autoFocus
                onBlur={saveTitle}
                style={styles.titleInput}
              />
            ) : (
              <ThemedText
                type="subtitle"
                onPress={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
              >
                {section.title}
              </ThemedText>
            )}

            {
              /* sortEnabledがtrueの場合、合計金額を表示 */
              sortEnabled && (
                <ThemedText style={styles.amount}>
                  {"  "}¥{totalAmount.toLocaleString()}
                </ThemedText>
              )
            }

            {headerClicked && (
              <Feather
                name="trash-2"
                size={24}
                color="#ef4444"
                onPress={(e) => {
                  e.stopPropagation();
                  confirmDelete();
                }}
              />
            )}
          </View>
        </Pressable>

        {
          /*  セクション内のアイテム一覧 */
          section.data.map((item) => (
            <ItemTab
              key={item.id}
              item={item}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
              editingAmountItemId={editingAmountItemId}
              setEditingAmountItemId={setEditingAmountItemId}
              temp={temp}
              setTemp={setTemp}
              section_id={section.id}
              headerClicked={headerClicked}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          ))
        }
        {headerClicked && (
          <ThemedText
            onPress={() => handleCreateItem(section.id)}
            style={styles.itemCreateButton}
          >
            +
          </ThemedText>
        )}
      </ThemedView>

      {/* 合計金額表示オプション変更用のModal */}
      <OptionModal
        visible={optionsVisible}
        sortEnabled={sortEnabled}
        onClose={() => setOptionsVisible(false)}
        onToggleSort={async (value) => {
          setSortEnabled(value);
          await sectionService.updateShowTotal(section.id, value);
        }}
      />
    </>
  );
}
