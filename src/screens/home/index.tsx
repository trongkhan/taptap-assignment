import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { TodoModel } from "../../models/todoModel";
import CSafeContainer from "../../components/CSafeContainer";
import { useEffect, useState } from "react";
import { priorityNames } from "../../const/enum/priorityNames";
import { addTodo, deleteTodo, editTodo, toggleTodo } from "../../redux/slices/todoSlice";
import { useSharedValue } from "react-native-reanimated";
import CTodoItem from "../../components/CTodoItem";
import CAddModal from "../../components/CAddModal";

const HomeScreen = () => {
    const todoList = useSelector((state: RootState) => state.todoReducer.todos);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [dateOpen, setDateOpen] = useState(false);
    const [priority, setPriority] = useState<priorityNames>(priorityNames.Low);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const titleOffset = useSharedValue(0);
    const infoOpacity = useSharedValue(1);
    const deleteOpacity = useSharedValue(0);
    const deleteTranslate = useSharedValue(-10);

    const handleAddTodo = () => {
        // Dispatch an action to add a new todo
        if (title.trim() === '') return;
        dispatch(addTodo({
            id: Math.random().toString(),
            title,
            deadline,
            priority,
            completed: false,
        }));
        setTitle('');
        setDeadline(new Date());
        setPriority(priorityNames.Low);
        setModalVisible(false);
    };

    const setEditingValue = (index: number) => {
        const item = todoList[index];
        setTitle(item.title);
        setDeadline(new Date(item.deadline));
        setPriority(item.priority);
    }

    // When entering edit mode, trigger animation
    const handleEditPress = (index: number) => {
        setExpandedId(todoList[index].id);
        setExpanded(true);
        setEditingValue(index);
        setSelectedIndex(index);
    };

    const handleEditDone = (id: string, title: string, date: Date, priority: string) => {
        handleEditTodo(id, title, date, priority as priorityNames);
    }

    const handleEditTodo = (id: string, title: string, date: Date, priority: priorityNames) => {
        // Dispatch an action to edit the todo with the given id
        dispatch(editTodo({
            id,
            title,
            deadline: date,
            priority,
            completed: false,
        }));
        setModalVisible(false);
    }

    useEffect(() => {
        titleOffset.value = expanded ? 40 : 0;
    }, [expanded]);

    useEffect(() => {
        infoOpacity.value = expanded ? 0 : 1;
    }, [expanded]);

    useEffect(() => {
        deleteOpacity.value = expanded ? 1 : 0;
        deleteTranslate.value = expanded ? 0 : -10;
    }, [expanded]);


    const handleCompleteItem = (id: string) => {
        // Dispatch an action to mark the todo with the given id as completed
        dispatch(toggleTodo(id));
    }

    const handleDeleteItem = (id: string) => {
        // Dispatch an action to delete the todo with the given id
        dispatch(deleteTodo(id));
    }

    const renderAddTodoModal = () => (
        <CAddModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={title}
            setTitle={setTitle}
            deadline={deadline}
            setDeadline={setDeadline}
            dateOpen={dateOpen}
            setDateOpen={setDateOpen}
            priority={priority}
            setPriority={setPriority}
            handleAddTodo={() => {
                handleAddTodo();
            }}
            priorityNames={{
                [priorityNames.Low]: "Thấp",
                [priorityNames.Medium]: "Trung bình",
                [priorityNames.High]: "Cao"
            }}
        />
    )

    const renderTodoItem = (item: TodoModel, index: number) => {
        return (
            <CTodoItem 
                item={item}
                expandedId={expandedId}
                handleExpand={(id: string) => {
                    if (expandedId === id) {
                        setExpandedId(null);
                        setExpanded(false);
                    } else {
                        setExpandedId(id);
                        setExpanded(true);
                    }
                }}
                handleComplete={(id: string) => handleCompleteItem(id)}
                handleDone={(id: string, title: string, date: Date, priority: string) => handleEditDone(id, title, date, priority)}
                handleDelete={(id: string) => handleDeleteItem(id)}
            />
        );
    }

    return (
        <CSafeContainer>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.whiteText}>To-do list</Text>
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={todoList}
                        renderItem={({ item, index }) => renderTodoItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <TouchableOpacity style={styles.footer} onPress={() => setModalVisible(true)}>
                    <Text style={styles.whiteText}>Tạo task mới +</Text>
                </TouchableOpacity>
            </View>
            {renderAddTodoModal()}
        </CSafeContainer>
    )
}

export default HomeScreen;