import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../const/enum/color";

const CLoadingIndicator = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
}

export default CLoadingIndicator;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});