import { StyleSheet } from "react-native";
import { Colors } from "../../const/enum/color";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    borderRadius: 16,
  },
  footer: {
    height: 50,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  todoItem: {
    padding: 24,
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 8,
  },
  todoDivider: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  todoRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButtonContainer: {
    justifyContent: "flex-end",
    alignItems: 'center',
    flexDirection: 'row'
  },
  todoText: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.black,
  },
  todoTextLight: {
    fontSize: 18,
    color: Colors.black,
  },
  whiteText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 600,
  },
});

export default styles;