// ReactおよびReactNativeコンポーネント
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";

// 外部コンポーネント
import SectionTab from "@/components/section";
import { styles } from "@/components/styles";
import { ThemedText } from "@/components/themed-text";
import { Section } from "@/types/types";

// 自作データベース関数
import * as DB from "@/db/database";
import * as ItemDB from "@/db/itemRepo";
import * as SectionDB from "../db/sectionRepo";

export default function KakeiScreen() {
  // 画面表示のためのセクションのstate
  const [sections, setSections] = useState<Section[]>([]);
  // 初回レンダリング時にDB初期化とデータ取得
  useEffect(() => {
    (async () => {
      await DB.initDB();
      await DB.seedDBIfEmpty();
      const sections = await DB.selectDB();
      setSections(sections);
    })().catch(console.error);
  }, []);

  // セクション作成処理
  async function createSection(title: string) {
    // 新規セクションオブジェクト作成
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title,
      data: [{ id: `item-${Date.now()}`, name: "アイテム名", amount: 0 }],
      showTotal: false,
    };

    // DB接続取得
    const db = await DB.default();

    // トランザクション処理でセクションとアイテムの挿入をまとめて実行(順番が重要なため)
    await db.withTransactionAsync(async () => {
      // // DB(スマホデバイス)へのセクション挿入処理
      await SectionDB.insertSection(newSection.id, newSection.title);

      // // DBへのアイテム挿入処理
      await ItemDB.insertItem(
        newSection.data[0].id,
        newSection.data[0].name,
        newSection.data[0].amount,
        newSection.id,
      );
    });

    // 画面表示用のstateにセクションを追加した後、更新する処理
    setSections((prev) => [...prev, newSection]);
  }

  // 引数idのセクションタイトル更新処理
  async function updateSection(id: string, newTitle: string) {
    // DBの引数のidと一致するセクションを更新する処理
    await SectionDB.updateSectionTitle(id, newTitle);
    // 画面表示用のstateの引数のidと一致するセクションを更新する処理
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  }

  // 引数idのセクション削除処理
  async function deleteSection(id: string) {
    // DBの引数idと一致するセクションを削除する処理
    await SectionDB.deleteSection(id);
    // 画面表示用のstateから引数idと一致しないセクションをフィルタリングして更新する処理
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  // セクション一覧の表示（Section以下の描画処理は"@/components/section.tsx"で行う）
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* すべてのセクションをSectionにいれて一つずつ表示 */}
      {sections.map((section) => (
        <SectionTab
          key={section.id}
          section={section}
          onUpdateSection={updateSection}
          onDeleteSection={deleteSection}
          setSections={setSections}
        />
      ))}

      {/* 新規作成用のボタン */}
      <ThemedText
        onPress={() => createSection("セクション名")}
        style={styles.itemCreateButton}
      >
        +
      </ThemedText>
    </ScrollView>
  );
}
