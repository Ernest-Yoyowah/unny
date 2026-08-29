import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/ProjectDetailsScreen.styles";
import { AppText } from "@/components/ui";
import { Colors } from "@/theme";

type Collaborator = {
  id: string;
  userId: string;
  status: string;
  user?: {
    fullName?: string;
    name?: string;
    email?: string;
  };
};

type Props = {
  collaborators: Collaborator[];
  currentUserId?: string;
  isStudent: boolean;
  isResponding: boolean;
  isRemoving: boolean;
  onAcceptInvite: (id: string) => void;
  onRemoveCollaborator: (userId: string) => void;
};

export const CollaboratorList: React.FC<Props> = ({
  collaborators,
  currentUserId,
  isStudent,
  isResponding,
  isRemoving,
  onAcceptInvite,
  onRemoveCollaborator,
}) => {
  if (collaborators.length === 0) {
    return (
      <View style={styles.inlineEmpty}>
        <AppText variant="caption" color="secondary">
          No collaborators yet.
        </AppText>
      </View>
    );
  }

  return (
    <>
      {collaborators.map((collaborator) => (
        <View key={collaborator.id} style={styles.personRow}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={17} color={Colors.primary} />
          </View>

          <View style={styles.personDetails}>
            <AppText variant="body2" weight="medium">
              {collaborator.user?.fullName ??
                collaborator.user?.name ??
                collaborator.user?.email ??
                collaborator.userId}
            </AppText>

            <AppText variant="caption" color="secondary">
              {collaborator.status === "PENDING"
                ? "Invitation pending"
                : "Collaborator"}
            </AppText>
          </View>

          {collaborator.status === "PENDING" &&
          collaborator.userId === currentUserId ? (
            <TouchableOpacity
              disabled={isResponding}
              style={styles.smallPrimaryButton}
              onPress={() => onAcceptInvite(collaborator.id)}
            >
              <AppText variant="caption" color="inverse" weight="semibold">
                Accept
              </AppText>
            </TouchableOpacity>
          ) : collaborator.userId !== currentUserId && isStudent ? (
            <TouchableOpacity
              disabled={isRemoving}
              onPress={() => onRemoveCollaborator(collaborator.userId)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={21}
                color={Colors.status.error}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
    </>
  );
};
