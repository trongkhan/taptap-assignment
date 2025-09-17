import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../const/enum/color";

const CSafeContainer = ({ children }) => {
    return <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary, paddingHorizontal: 16 }}>
        {/* Your app content goes here */}
        {children}
    </SafeAreaView>;
}

export default CSafeContainer;