import getDB from "@/db/database";

// アイテムを挿入する関数
export async function insertItem(
  id: string,
  name: string,
  amount: number,
  sectionId: string,
) {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO item (id, name, amount, section_id)
     VALUES (?, ?, ?, ?);`,
    [id, name, amount, sectionId],
  );
}

// アイテムを更新する関数
export async function updateItem(
  id: string,
  newName: string,
  newAmount: number,
) {
  const db = await getDB();
  await db.runAsync(`UPDATE item SET name = ?, amount = ? WHERE id = ?;`, [
    newName,
    newAmount,
    id,
  ]);
}

// アイテムを削除する関数
export async function deleteItem(id: string) {
  const db = await getDB();
  await db.runAsync(`DELETE FROM item WHERE id = ?;`, [id]);
}
