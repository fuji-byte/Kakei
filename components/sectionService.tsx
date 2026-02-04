// 外部コンポーネント
import { Item } from "@/types/types";
import * as ItemDB from "../db/itemRepo";
import * as SectionDB from "@/db/sectionRepo";

// 新規アイテム作成処理
export async function createItem(sectionId: string, itemName: string) {
  // 新規アイテムオブジェクト作成
  const newItem: Item = {
    id: `item-${Date.now()}`,
    name: itemName,
    amount: 0,
  };
  // DBへのアイテム挿入処理
  await ItemDB.insertItem(newItem.id, newItem.name, newItem.amount, sectionId);
  return newItem;
}

// 引数idのアイテム更新処理
export async function updateItem(
  itemId: string,
  newName: string,
  newAmount: number,
) {
  // DBの引数のitemIdと一致するアイテムを更新する処理
  await ItemDB.updateItem(itemId, newName, newAmount);
}

// 引数sectionIdのセクション内の引数itemIdのアイテム削除処理
export async function deleteItem(itemId: string) {
  // DBの引数のitemIdと一致するアイテムを削除する処理
  await ItemDB.deleteItem(itemId);
}

// 引数sectionIdのセクションの合計表示設定更新処理
export async function updateShowTotal(sectionId: string, showTotal: boolean) {
  await SectionDB.updateShowTotal(sectionId, showTotal ? 1 : 0);
}
