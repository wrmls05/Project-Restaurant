import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  textHeader: {
    fontSize: 26,
    fontWeight: "400",
  },

  zoneTab: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 10,
  },

  zoneButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 2,
  },

  zoneButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#555",
  },

  zoneText: {
    fontSize: 22,
    color: "#999",
  },

  zoneTextActive: {
    color: "#555",
  },

  list: {
    padding: 10,
    paddingBottom: 90,
  },

  row: {
    justifyContent: "space-between",
  },

  tableContainer: {
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
  },

  tableImage: {
    width: "100%",
    height: 130,
    borderRadius: 6,
  },

  tableNameContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingVertical: 3,
  },

  tableName: {
    fontSize: 20,
    color: "#555",
  },

  statusContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 4,
  },

  statusAvailable: {
    backgroundColor: "#50df63",
  },

  statusOccupied: {
    backgroundColor: "#e24545",
  },

  statusText: {
    fontSize: 20,
    color: "#555",
  },

  kitchenButton: {
    height: 55,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  kitchenText: {
    color: "#fff",
    fontSize: 16,
  },
});