import { styles } from "@/screens/project/styles/ProjectDetailsScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { AppText } from "../ui";
import { Colors } from "@/theme";

export const DocumentRow = ({
  title,
  type,
  onPress,
}: {
  title: string;
  type: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.documentRow} onPress={onPress}>
    <View style={styles.documentIcon}>
      <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
    </View>

    <View style={styles.documentContent}>
      <AppText variant="body2" weight="medium" numberOfLines={2}>
        {title}
      </AppText>

      <AppText variant="caption" color="secondary">
        {type}
      </AppText>
    </View>

    <Ionicons
      name="chevron-forward-outline"
      size={19}
      color={Colors.text.tertiary}
    />
  </TouchableOpacity>
);
