import { styles } from "@/screens/project/styles/ProjectDetailsScreen.styles";
import { Colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { AppText } from "./Typography";

export const DirectoryPerson = ({
  icon,
  name,
  details,
  actionLabel,
  loading,
  accent = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  details: string[];
  actionLabel: string;
  loading: boolean;
  accent?: boolean;
  onPress: () => void;
}) => (
  <View style={styles.directoryCard}>
    <View style={styles.directoryPerson}>
      <View
        style={[styles.directoryAvatar, accent && styles.directoryAvatarAccent]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={accent ? Colors.accent : Colors.primary}
        />
      </View>

      <View style={styles.personDetails}>
        <AppText variant="body2" weight="medium">
          {name}
        </AppText>

        {details.map((detail, index) => (
          <AppText
            key={`${detail}-${index}`}
            variant="caption"
            color="secondary"
          >
            {detail}
          </AppText>
        ))}
      </View>
    </View>

    <TouchableOpacity
      disabled={loading}
      style={[
        styles.directoryActionButton,
        accent && styles.directoryActionButtonAccent,
        loading && styles.directoryActionButtonDisabled,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.text.inverse} />
      ) : (
        <Ionicons
          name={accent ? "send-outline" : "person-add-outline"}
          size={15}
          color={Colors.text.inverse}
        />
      )}

      <AppText variant="caption" color="inverse" weight="semibold">
        {actionLabel}
      </AppText>
    </TouchableOpacity>
  </View>
);
