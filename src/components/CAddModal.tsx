import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { formatDate } from "../helpers/formatHelpers";
import { Colors } from "../const/enum/color";
import { priorityNames } from "../const/enum/priorityNames";

interface CAddModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    title: string;
    setTitle: (title: string) => void;
    deadline: Date;
    setDeadline: (date: Date) => void;
    dateOpen: boolean;
    setDateOpen: (open: boolean) => void;
    priority: priorityNames;
    setPriority: (level: priorityNames) => void;
    handleAddTodo: () => void;
    priorityNames: { [value in priorityNames]: string };
}

const CAddModal = (props: CAddModalProps) => {
    const {
        modalVisible,
        setModalVisible,
        title,
        setTitle,
        deadline,
        setDeadline,
        dateOpen,
        setDateOpen,
        priority,
        setPriority,
        handleAddTodo,
        priorityNames
    } = props;

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.textForm}>Tạo Task Mới</Text>
                    <TextInput
                        placeholder="Tên task"
                        placeholderTextColor={Colors.lightGray}
                        value={title}
                        onChangeText={setTitle}
                        style={styles.inputView}
                    />
                    <TouchableOpacity
                        onPress={() => setDateOpen(true)}
                        style={styles.inputView}
                    >
                        <Text>Hạn hoàn thành: {formatDate(deadline.toString())}</Text>
                    </TouchableOpacity>
                    <View style={[styles.inputView, {borderBottomWidth: 0}]}>
                        <Text>Ưu tiên:</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                            {Object.values(priorityNames).map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setPriority(level as priorityNames)}
                                    style={{
                                        padding: 8,
                                        backgroundColor: priority === level ? Colors.cadmiumOrange : Colors.lightGray,
                                        borderRadius: 8,
                                        flex: 1,
                                        alignItems: "center",
                                        marginHorizontal: 4
                                    }}
                                >
                                    <Text style={{ color: priority === level ? Colors.white : Colors.black }}>{level}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <DatePicker
                        modal
                        open={dateOpen}
                        date={deadline ? new Date(deadline) : new Date()}
                        mode="date"
                        minimumDate={new Date()}
                        onConfirm={(date) => {
                            setDateOpen(false)
                            setDeadline(date)
                        }}
                        onCancel={() => {
                            setDateOpen(false)
                        }}
                    />
                    <View style={styles.buttonView}>
                        <Button title="Hủy" onPress={() => setModalVisible(false)} />
                        <Button title="Thêm" onPress={handleAddTodo} />
                    </View>
                </View>
            </View>
        </Modal>
    )
};
export default CAddModal;

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        // top: '30%',
        paddingVertical: 24,
        paddingHorizontal: 16
    },
    content: {
        width: "100%",
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        alignItems: "center"
    },
    inputView: {
        width: "100%",
        borderBottomWidth: 1,
        marginBottom: 16,
        paddingVertical: 8,
    },
    textForm: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16
    },
    buttonView: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    }
});