import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/ProjectDetailsScreen.styles";
import { AppText, DirectoryPerson } from "@/components/ui";
import { Colors } from "@/theme";
import { ProjectUser } from "@/api/services/explore.service";

type Props = {
  students: ProjectUser[];
  isLoading: boolean;
  isError: boolean;
  isInviting: (studentId: string) => boolean;
  onInvite: (studentId: string) => void;
};

export const CollaboratorInviteSection: React.FC<Props> = ({
  students,
  isLoading,
  isError,
  isInviting,
  onInvite,
}) => {
  return (
    <View style={styles.workflowBlock}>
      <View style={styles.workflowHeader}>
        <View style={styles.workflowHeaderIcon}>
          <Ionicons
            name="person-add-outline"
            size={18}
            color={Colors.primary}
          />
        </View>

        <View style={styles.workflowHeaderContent}>
          <AppText variant="body2" weight="semibold">
            Add a collaborator
          </AppText>

          <AppText variant="caption" color="secondary">
            Invite another student to contribute to this project.
          </AppText>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={Colors.primary} />

          <AppText variant="caption" color="secondary">
            Finding students...
          </AppText>
        </View>
      ) : isError && students.length === 0 ? (
        <View style={styles.inlineMessage}>
          <AppText variant="caption" color="secondary">
            We could not load students right now.
          </AppText>
        </View>
      ) : students.length === 0 ? (
        <View style={styles.inlineMessage}>
          <AppText variant="caption" color="secondary">
            No other students are currently available to invite.
          </AppText>
        </View>
      ) : (
        students.map((student) => {
          const studentName =
            student.fullName ??
            student.profile?.fullName ??
            student.name ??
            student.email ??
            "Student";

          const studentDepartment =
            student.department ?? student.profile?.department;

          const studentLevel = student.level ?? student.profile?.level;

          const inviting = isInviting(student.id);

          return (
            <DirectoryPerson
              key={student.id}
              icon="person-outline"
              name={studentName}
              details={
                [studentDepartment, studentLevel].filter(Boolean) as string[]
              }
              actionLabel={inviting ? "Sending..." : "Invite"}
              loading={inviting}
              onPress={() => onInvite(student.id)}
            />
          );
        })
      )}
    </View>
  );
};
