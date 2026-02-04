import getDB from "@/db/database";

// セクションを挿入する関数
export async function insertSection(id: string, title: string) {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO section (id, title, show_total)
     VALUES (?, ?, 0);`,
    [id, title],
  );
}

// セクションタイトルを更新する関数
export async function updateSectionTitle(id: string, newTitle: string) {
  const db = await getDB();
  await db.runAsync(`UPDATE section SET title = ? WHERE id = ?;`, [
    newTitle,
    id,
  ]);
}

// セクションを削除する関数
export async function deleteSection(id: string) {
  const db = await getDB();
  await db.runAsync(`DELETE FROM section WHERE id = ?;`, [id]);
}

export async function updateShowTotal(sectionId: string, value: number) {
  const db = await getDB();
  await db.runAsync(`UPDATE section SET show_total = ? WHERE id = ?`, [
    value,
    sectionId,
  ]);
}
