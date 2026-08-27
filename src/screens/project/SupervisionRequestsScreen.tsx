import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import { MainStackParamList } from "../../navigation/types";
import {
  useRespondToSupervision,
  useSupervisionRequests,
} from "../../hooks/useProjectWorkflow";
import { useAuthStore } from "../../store/auth.store";
import { Colors, Spacing, BorderRadius } from "../../theme";

type Props = NativeStackScreenProps<MainStackParamList, "SupervisionRequests">;

export const SupervisionRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useSupervisionRequests();
  const respond = useRespondToSupervision();
  const role = useAuthStore((state) => state.user?.role);
  const canRespond = role === "lecturer" || role === "admin";

  if (isLoading) return <ScreenSkeleton />;
  if (isError)
    return (
      <EmptyState
        icon="cloud-offline-outline"
        title="Requests unavailable"
        description="We could not load supervision requests."
        action={{ label: "Try again", onPress: () => refetch() }}
      />
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
      </TouchableOpacity>
      <AppText variant="h3" weight="bold">
        Supervision
      </AppText>
      <AppText variant="body2" color="secondary" style={styles.subtitle}>
        Requests and responses for your project supervision.
      </AppText>
      {requests.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No supervision requests"
          description="New requests will appear here."
        />
      ) : (
        requests.map((request) => (
          <Card key={request.id} style={styles.card}>
            <AppText variant="body2" weight="semibold">
              {request.requester?.fullName ??
                request.supervisor?.fullName ??
                "Supervision request"}
            </AppText>
            <AppText variant="caption" color="secondary">
              {request.project?.title ? `${request.project.title} · ` : ""}
              {request.message ?? "Supervision requested"}
            </AppText>
            <AppText
              variant="caption"
              color={request.status === "ACCEPTED" ? "success" : "secondary"}
              style={styles.status}
            >
              {request.status}
            </AppText>
            {request.status === "PENDING" && canRespond && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.accept}
                  onPress={() =>
                    respond.mutate({ id: request.id, status: "ACCEPTED" })
                  }
                >
                  <AppText variant="caption" color="inverse" weight="semibold">
                    Accept
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reject}
                  onPress={() =>
                    Alert.alert(
                      "Decline request",
                      "Decline this supervision request?",
                      [
                        { text: "Cancel", style: "cancel" },
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
                >
                  <AppText variant="caption" color="error" weight="semibold">
                    Decline
                  </AppText>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[12],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },
  subtitle: { marginTop: Spacing[2], marginBottom: Spacing[6] },
  card: { padding: Spacing[5], marginBottom: Spacing[3], gap: Spacing[2] },
  status: { textTransform: "capitalize" },
  actions: { flexDirection: "row", gap: Spacing[2], marginTop: Spacing[3] },
  accept: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  reject: {
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
});
