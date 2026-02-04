import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 24,
  },
  section: {
    marginHorizontal: 14,
    marginVertical: 7,
    padding: 16,
    borderRadius: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 0, // 金額部分が縮まないようにする
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemCreateButton: {
    fontSize: 24,
    lineHeight: 18,
    fontWeight: "600",
    marginHorizontal: 8,
    textAlign: "center",
  },
});
