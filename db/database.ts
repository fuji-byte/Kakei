import * as SQLite from "expo-sqlite";
import { Section, SectionRow, SectionItemRow } from "@/types/types";

let db: SQLite.SQLiteDatabase | null = null;

// データベース接続取得関数
export default async function getDB() {
  if (!db) {
    // データベースオープン
    db = await SQLite.openDatabaseAsync("KakeiApp.db");
    // 外部キーの有効化
    await db.execAsync(`PRAGMA foreign_keys = ON;`);
  }
  return db;
}

// データベース初期化関数
export async function initDB() {
  const db = await getDB();

  // セクションテーブル作成
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS section (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      show_total INTEGER NOT NULL DEFAULT 0
    );
  `);

  // アイテムテーブル作成
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS item (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      amount REAL,
      section_id TEXT,
      FOREIGN KEY (section_id) REFERENCES section(id) ON DELETE CASCADE
    );
  `);
}

// データベースからセクションとアイテムを取得する関数
export async function selectDB() {
  const db = await getDB();

  // セクションを取得する処理
  const sectionResult = await db.getAllAsync<SectionRow>(
    `SELECT * FROM section;`,
  );
  const sections: Section[] = sectionResult.map((row) => ({
    id: row.id,
    title: row.title,
    data: [],
    showTotal: row.show_total === 1,
  }));

  // セクションとアイテムを結合して取得
  const itemResult = await db.getAllAsync<SectionItemRow>(`SELECT
    s.id   AS section_id,
    s.title,
    i.id   AS item_id,
    i.name,
    i.amount
    FROM section s
    LEFT JOIN item i ON i.section_id = s.id;
  `);
  // Mapにセクションを格納しておき、高速にアクセスできるようにする
  const sectionMap = new Map(sections.map((s) => [s.id, s]));

  for (const item of itemResult) {
    // item_idがnullの場合はスキップ（セクションのみの行の場合があるため）
    if (!item.item_id) continue;
    // セクションにアイテムを追加
    sectionMap.get(item.section_id)?.data.push({
      id: item.item_id,
      name: item.name || "",
      amount: item.amount || 0,
    });
  }

  return sections;
}

// データベースにデータが存在しないときにサンプルデータを挿入する関数（初回起動時のみ）
export async function seedDBIfEmpty() {
  const db = await getDB();

  // セクションテーブルのデータ件数を取得
  const count = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM section;`,
  );

  // データ件数が0件の場合、サンプルデータを挿入
  if (count?.count === 0) {
    // サンプルデータ用セクションオブジェクト作成
    const sampleSection: Section = {
      id: `section-${Date.now()}`,
      title: "食費",
      data: [
        { id: `item-${Date.now()}`, name: "米", amount: 1000 },
        { id: `item-${Date.now() + 1}`, name: "野菜", amount: 500 },
      ],
      showTotal: true,
    };
    // サンプルデータ用セクション挿入
    await db.runAsync(
      `INSERT INTO section (id, title, show_total) VALUES (?, ?, ?);`,
      [sampleSection.id, sampleSection.title, sampleSection.showTotal ? 1 : 0],
    );
    // サンプルデータ用アイテム挿入
    for (const item of sampleSection.data) {
      await db.runAsync(
        `INSERT INTO item (id, name, amount, section_id) VALUES (?, ?, ?, ?);`,
        [item.id, item.name, item.amount, sampleSection.id],
      );
    }
    return [sampleSection];
  }
}
