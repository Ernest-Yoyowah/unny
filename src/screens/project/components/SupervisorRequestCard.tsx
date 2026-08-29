import { getStatusConfig, RequestStatus } from "@/utils/status";
import { styles } from "../styles/SupervisionRequestsScreen.styles";
import { AppText, Card } from "@/components/ui";
import { Alert, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme";

export const SupervisorRequestCard = ({
  request,
  respond,
}: {
  request: any;
  respond: any;
}) => {
  const isPending = request.status === "PENDING";
  const isAccepted = request.status === "ACCEPTED";
  const isResponding =
    respond.isPending && respond.variables?.id === request.id;

  const status = getStatusConfig(request.status as RequestStatus);

  const studentName =
    request.requester?.fullName ?? request.supervisor?.fullName ?? "Student";

  return (
    <Card style={styles.supervisorCard}>
      <View style={styles.supervisorCardTop}>
        <View style={styles.personAvatar}>
          <Ionicons name="person-outline" size={19} color={Colors.primary} />
        </View>

        <View style={styles.personInfo}>
          <AppText variant="body2" weight="semibold" numberOfLines={2}>
            {studentName}
          </AppText>

          <AppText variant="caption" color="secondary">
            Student
          </AppText>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: status.background,
              borderColor: status.border,
            },
          ]}
        >
          <Ionicons name={status.icon} size={13} color={status.color} />

          <AppText
            variant="caption"
            weight="semibold"
            style={{ color: status.color }}
          >
            {status.label}
          </AppText>
        </View>
      </View>

      <View style={styles.projectBox}>
        <View style={styles.projectIcon}>
          <Ionicons
            name="document-text-outline"
            size={17}
            color={Colors.text.secondary}
          />
        </View>

        <View style={styles.projectInfo}>
          <AppText variant="caption" color="secondary">
            PROJECT
          </AppText>

          <AppText
            variant="body2"
            weight="semibold"
            numberOfLines={2}
            style={styles.projectTitle}
          >
            {request.project?.title ?? "Project supervision"}
          </AppText>
        </View>
      </View>

      {request.message && (
        <View style={styles.requestMessage}>
          <AppText variant="caption" color="secondary">
            Student's message
          </AppText>

          <AppText variant="body2" color="secondary" style={styles.messageText}>
            {request.message}
          </AppText>
        </View>
      )}

      {isPending ? (
        <View style={styles.supervisorActions}>
          <TouchableOpacity
            disabled={isResponding}
            style={[styles.acceptButton, isResponding && styles.buttonDisabled]}
            onPress={() =>
              respond.mutate({
                id: request.id,
                status: "ACCEPTED",
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Accept supervision request from ${studentName}`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-outline"
              size={18}
              color={Colors.text.inverse}
            />

            <AppText variant="caption" color="inverse" weight="semibold">
              {isResponding ? "Updating..." : "Accept request"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isResponding}
            style={[
              styles.declineButton,
              isResponding && styles.buttonDisabled,
            ]}
            onPress={() =>
              Alert.alert(
                "Decline request",
                `Are you sure you want to decline ${studentName}'s supervision request?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Decline",
                    style: "destructive",
                    onPress: () =>
                      respond.mutate({
                        id: request.id,
                        status: "REJECTED",
                      }),
                  },
                ],
              )
            }
            accessibilityRole="button"
            accessibilityLabel={`Decline supervision request from ${studentName}`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close-outline"
              size={18}
              color={Colors.status.error}
            />

            <AppText variant="caption" color="error" weight="semibold">
              Decline
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            styles.statusExplanation,
            { backgroundColor: status.background },
          ]}
        >
          <Ionicons name={status.icon} size={16} color={status.color} />

          <AppText
            variant="caption"
            style={[styles.statusExplanationText, { color: status.color }]}
          >
            {isAccepted
              ? "You accepted this supervision request."
              : "You declined this supervision request."}
          </AppText>
        </View>
      )}
    </Card>
  );
};
