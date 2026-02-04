// セクション内のアイテムの型定義
export type Item = {
  id: string;
  name: string;
  amount: number;
};

// セクションの型定義
export type Section = {
  id: string;
  title: string;
  data: Item[];
  showTotal: boolean;
};

// データベースから取得する一時的なセクションデータの型定義
export type SectionRow = {
  id: string;
  title: string;
  show_total: number;
};

// アイテムをセクションに振り分けるときの結合データの型定義
export type SectionItemRow = {
  section_id: string;
  title: string;
  item_id: string | null;
  name: string | null;
  amount: number | null;
};
