import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { TodoModel } from "../models/todoModel";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { formatDate, getRemainingDays } from "../helpers/formatHelpers";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../const/enum/color";
import DatePicker from "react-native-date-picker";
import { priorityNames } from "../const/enum/priorityNames";


interface CTodoItemProps {
    item: TodoModel;
    expandedId: string | null;
    handleExpand: (id: string) => void;
    handleDone: (id: string, title: string, date: Date, priority: string) => void;
    handleComplete: (id: string) => void;
    handleDelete: (id: string) => void;
}

const CTodoItem = ({ item, expandedId, handleExpand, handleComplete, handleDone, handleDelete }: CTodoItemProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(item.deadline ? new Date(item.deadline) : new Date());
    const [title, setTitle] = useState(item.title);
    const [priority, setPriority] = useState(item.priority);
    const titleOffset = useSharedValue(0);
    const infoOpacity = useSharedValue(1);
    const deleteOpacity = useSharedValue(0);
    const deleteTranslate = useSharedValue(-10);

    const expanded = item.id === expandedId;

    const handleChange = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setShowPicker(false);
            setDate(selectedDate);
        }
    };

    useEffect(() => {
        titleOffset.value = expanded ? 30 : 0;
        infoOpacity.value = withTiming(1, { duration: 220 });
        deleteOpacity.value = expanded ? 1 : 0;
        deleteTranslate.value = expanded ? 0 : -20;
    }, [expanded]);

    const titleStyle = useAnimatedStyle(() => ({
        marginTop: withSpring(titleOffset.value, {
            damping: 15,
            stiffness: 80,
            mass: 1,
        }),
    }));

    const infoStyle = useAnimatedStyle(() => ({
        opacity: withTiming(infoOpacity.value, { duration: 400 }),
    }));

    const deleteStyle = useAnimatedStyle(() => ({
        opacity: withTiming(deleteOpacity.value, { duration: 260 }),
        transform: [{ translateY: withTiming(deleteTranslate.value, { duration: 260 }) }],
    }));

    return (
        <Animated.View style={[styles.card]}>
            {expanded && (
                <Animated.View style={[styles.deleteContainer, deleteStyle]}>
                    <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        activeOpacity={0.7}
                        style={styles.deleteTouch}
                    >
                        <Icon name="trash-outline" size={22} color={Colors.black} />
                        <Text style={styles.deleteText}>Xóa</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            <View
                style={{ paddingTop: 6, flexDirection: 'row' }}
            >
                {!expanded && (
                    <TouchableOpacity onPress={() => handleComplete(item.id)} style={{ marginRight: 12 }}>
                        {item.completed ? (
                            <Animated.View style={infoStyle}>
                                <Icon name="checkbox" size={28} color={Colors.primary} />
                            </Animated.View>
                        ) : (
                            <Animated.View style={infoStyle}>
                                <Icon name="square-outline" size={28} color={Colors.lightGray} />

                            </Animated.View>
                        )}
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleExpand(expanded ? null as any : item.id)}
                    style={{ flex: 1 }}
                >
                    {expanded ? (
                        <Animated.View style={[styles.titleContainer, titleStyle]}>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Tên task"
                                style={styles.titleInput}
                                underlineColorAndroid="transparent"
                            />
                            <View style={styles.underline} />
                        </Animated.View>
                    ) : (
                        <View style={[styles.row, { alignItems: "center", marginBottom: 8 }]}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <View style={{ flex: 1 }} />
                            <Icon name="pencil-outline" size={20} color={Colors.black} />
                        </View>
                    )}

                    {/* Expanded content */}
                    {expanded ? (
                        <View>
                            <TouchableOpacity style={styles.fieldRow} onPress={() => setShowPicker(true)}>
                                <Text style={styles.fieldLabel}>Thời hạn</Text>
                                <Text style={styles.fieldValue}>{formatDate(date.toString())}</Text>
                            </TouchableOpacity>
                            {showPicker && (
                                <DatePicker
                                    modal
                                    open={showPicker}
                                    date={date}
                                    mode="date"
                                    minimumDate={new Date()}
                                    onConfirm={handleChange}
                                    onCancel={() => setShowPicker(false)}
                                />
                            )}

                            <View style={styles.fieldDivider} />

                            <View style={styles.fieldRow}>
                                <Text style={styles.fieldLabel}>Mức độ ưu tiên</Text>
                                <View style={{ flex: 2 }}>
                                    <View style={{ flexDirection: "row" }}>
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
                                                    justifyContent: 'center',
                                                    marginHorizontal: 4
                                                }}
                                            >
                                                <Text numberOfLines={1} style={{ color: priority === level ? Colors.white : Colors.black, fontSize: 14 }}>{level}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fieldDivider} />

                            {/* Done button */}
                            <View style={{ marginTop: 18, marginBottom: 6, alignItems: "center" }}>
                                <TouchableOpacity
                                    style={styles.doneButton}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                        handleDone(item.id, title, date, priority);
                                        setShowPicker(false);
                                        handleExpand(null as any);
                                    }}
                                >
                                    <Text style={styles.doneText}>Xong</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Animated.View style={[styles.row, infoStyle, { marginTop: 2 }]}>
                            <Text style={styles.infoLight}>{item.priority}</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={styles.infoLight}>{`Còn ${getRemainingDays(item.deadline)} ngày`}</Text>
                        </Animated.View>
                    )}
                </TouchableOpacity>
            </View >
        </Animated.View >
    );
};

export default CTodoItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 10,
        padding: 18,
        // shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        // elevation for Android
        elevation: 3,
        // minHeight: 80, // compact
    },
    deleteContainer: {
        position: "absolute",
        right: 14,
        top: 12,
        zIndex: 50,
        elevation: 10,
    },
    deleteTouch: {
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
    },
    deleteText: {
        marginLeft: 6,
        fontSize: 16,
        color: Colors.black,
    },

    // Title / header
    row: { flexDirection: "row", alignItems: "center" },
    titleText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111",
    },

    // expanded title input look
    titleContainer: {
        paddingBottom: 6,
    },
    titleInput: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111",
        paddingVertical: 2,
    },
    underline: {
        height: 1,
        backgroundColor: "#1a1a1a",
        marginTop: 6,
        opacity: 0.9,
    },

    // field rows
    fieldRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    fieldLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    fieldValue: {
        fontSize: 18,
        color: "#111",
    },
    fieldDivider: {
        height: 1,
        backgroundColor: "#e8e8e8",
        marginBottom: 2,
    },

    // Done button
    doneButton: {
        backgroundColor: Colors.caribbeanGreen ?? "#3DA85A",
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 22,
    },
    doneText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    // compact info
    infoLight: {
        color: "#9b9b9b",
        fontSize: 14,
    },
});