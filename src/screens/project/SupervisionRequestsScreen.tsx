import React from "react";
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import { MainStackParamList } from "../../navigation/types";
import {
  useRespondToSupervision,
  useSupervisionRequests,
} from "../../hooks/useProjectWorkflow";
import { useAuthStore } from "../../store/auth.store";
import { Colors } from "../../theme";
import { styles } from "./styles/SupervisionRequestsScreen.styles";
import { getStatusConfig, RequestStatus } from "@/utils/status";
import { SupervisorRequestCard } from "./components/SupervisorRequestCard";

type Props = NativeStackScreenProps<MainStackParamList, "SupervisionRequests">;

export const SupervisionRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSupervisionRequests();

  const respond = useRespondToSupervision();

  const role = useAuthStore((state) => state.user?.role);

  const isSupervisor = role === "lecturer" || role === "admin";

  if (isLoading) {
    return <ScreenSkeleton />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={Colors.text.inverse}
              />
            </TouchableOpacity>

            <AppText style={styles.headerEyebrow}>
              {isSupervisor ? "SUPERVISION" : "SUPERVISOR"}
            </AppText>

            <AppText style={styles.headerTitle}>
              {isSupervisor ? "Supervision requests" : "My supervisor"}
            </AppText>

            <AppText style={styles.headerSubtitle}>
              {isSupervisor
                ? "Review students asking for your supervision."
                : "Track your supervisor requests and their progress."}
            </AppText>
          </View>

          <View style={styles.body}>
            <View style={styles.errorContainer}>
              <EmptyState
                icon="cloud-offline-outline"
                title="Could not load requests"
                description="Something went wrong while loading your supervision activity."
                action={{
                  label: "Try again",
                  onPress: () => refetch(),
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text.inverse} />
          </TouchableOpacity>

          <AppText style={styles.headerEyebrow}>
            {isSupervisor ? "SUPERVISION" : "SUPERVISOR"}
          </AppText>

          <View style={styles.headerRow}>
            <View style={styles.headerTitleContainer}>
              <AppText style={styles.headerTitle}>
                {isSupervisor ? "Supervision requests" : "My supervisor"}
              </AppText>

              <AppText style={styles.headerSubtitle}>
                {isSupervisor
                  ? "Review students asking for your supervision."
                  : "Track your supervisor requests and their progress."}
              </AppText>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => refetch()}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Refresh supervision requests"
              >
                <Ionicons
                  name={isFetching ? "sync-outline" : "refresh-outline"}
                  size={18}
                  color={Colors.text.inverse}
                />
              </TouchableOpacity>

              <View style={styles.headerCount}>
                <AppText style={styles.headerCountNumber}>
                  {requests.length}
                </AppText>

                <AppText style={styles.headerCountLabel}>
                  {requests.length === 1 ? "request" : "requests"}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={() => refetch()}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          >
            {isSupervisor ? (
              <SupervisorView requests={requests} respond={respond} />
            ) : (
              <StudentView requests={requests} />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const StudentView = ({ requests }: { requests: any[] }) => {
  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "ACCEPTED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  const latestRequest = requests[0];

  return (
    <View>
      <View style={styles.studentIntro}>
        <AppText variant="h5" weight="semibold">
          Your supervision
        </AppText>

        <AppText
          variant="body2"
          color="secondary"
          style={styles.studentIntroText}
        >
          Keep track of who you have requested and whether they have responded.
        </AppText>
      </View>

      {requests.length === 0 ? (
        <View style={styles.studentEmptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="person-add-outline"
              size={26}
              color={Colors.primary}
            />
          </View>

          <AppText variant="h5" weight="semibold" style={styles.emptyTitle}>
            No supervisor requests yet
          </AppText>

          <AppText
            variant="body2"
            color="secondary"
            style={styles.emptyDescription}
          >
            When you request a lecturer to supervise your project, you will be
            able to track the request here.
          </AppText>
        </View>
      ) : (
        <>
          <View style={styles.overviewCard}>
            <View style={styles.overviewTop}>
              <View>
                <AppText variant="caption" color="secondary">
                  CURRENT STATUS
                </AppText>

                <AppText
                  variant="h5"
                  weight="semibold"
                  style={styles.overviewTitle}
                >
                  {pendingCount > 0
                    ? "Waiting for a response"
                    : acceptedCount > 0
                      ? "Supervisor confirmed"
                      : "No active request"}
                </AppText>
              </View>

              <View
                style={[
                  styles.overviewIcon,
                  pendingCount === 0 &&
                    acceptedCount > 0 &&
                    styles.overviewIconSuccess,
                ]}
              >
                <Ionicons
                  name={
                    pendingCount > 0
                      ? "time-outline"
                      : acceptedCount > 0
                        ? "checkmark-circle-outline"
                        : "information-circle-outline"
                  }
                  size={24}
                  color={
                    pendingCount > 0
                      ? Colors.accent
                      : acceptedCount > 0
                        ? Colors.status.success
                        : Colors.text.secondary
                  }
                />
              </View>
            </View>

            <View style={styles.overviewDivider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText style={styles.statNumber}>{requests.length}</AppText>

                <AppText variant="caption" color="secondary">
                  Total
                </AppText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <AppText
                  style={[
                    styles.statNumber,
                    pendingCount > 0 && styles.statPending,
                  ]}
                >
                  {pendingCount}
                </AppText>

                <AppText variant="caption" color="secondary">
                  Pending
                </AppText>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <AppText
                  style={[
                    styles.statNumber,
                    acceptedCount > 0 && styles.statSuccess,
                  ]}
                >
                  {acceptedCount}
                </AppText>

                <AppText variant="caption" color="secondary">
                  Accepted
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <AppText variant="h5" weight="semibold">
                Your requests
              </AppText>

              <AppText variant="caption" color="secondary">
                {latestRequest
                  ? "Most recent activity appears first."
                  : "Your supervision requests will appear here."}
              </AppText>
            </View>
          </View>

          {requests.map((request) => (
            <StudentRequestCard key={request.id} request={request} />
          ))}

          {rejectedCount > 0 && pendingCount === 0 && (
            <View style={styles.helpCard}>
              <View style={styles.helpIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.helpContent}>
                <AppText variant="body2" weight="semibold">
                  Need a supervisor?
                </AppText>

                <AppText variant="caption" color="secondary">
                  You can submit another request to a different supervisor from
                  your project.
                </AppText>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const StudentRequestCard = ({ request }: { request: any }) => {
  const status = getStatusConfig(request.status as RequestStatus);

  const supervisorName =
    request.supervisor?.fullName ?? request.requester?.fullName ?? "Supervisor";

  return (
    <Card style={styles.studentRequestCard}>
      <View style={styles.studentRequestTop}>
        <View style={styles.personAvatar}>
          <Ionicons name="person-outline" size={19} color={Colors.primary} />
        </View>

        <View style={styles.personInfo}>
          <AppText variant="body2" weight="semibold" numberOfLines={2}>
            {supervisorName}
          </AppText>

          <AppText variant="caption" color="secondary">
            Supervisor
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
            Your message
          </AppText>

          <AppText variant="body2" color="secondary" style={styles.messageText}>
            {request.message}
          </AppText>
        </View>
      )}

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
          {request.status === "PENDING"
            ? "Your request has been sent. You will see an update here when the supervisor responds."
            : request.status === "ACCEPTED"
              ? "This supervisor has accepted your request."
              : "This supervisor declined your request."}
        </AppText>
      </View>
    </Card>
  );
};

const SupervisorView = ({
  requests,
  respond,
}: {
  requests: any[];
  respond: any;
}) => {
  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  const resolvedRequests = requests.filter(
    (request) => request.status !== "PENDING",
  );

  return (
    <View>
      <View style={styles.studentIntro}>
        <AppText variant="h5" weight="semibold">
          Requests needing your attention
        </AppText>

        <AppText
          variant="body2"
          color="secondary"
          style={styles.studentIntroText}
        >
          Review student requests and decide who you would like to supervise.
        </AppText>
      </View>

      <View style={styles.supervisorSummary}>
        <View style={styles.supervisorSummaryIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.accent}
          />
        </View>

        <View style={styles.supervisorSummaryContent}>
          <AppText variant="body2" weight="semibold">
            {pendingRequests.length === 0
              ? "You're all caught up"
              : `${pendingRequests.length} ${
                  pendingRequests.length === 1 ? "request" : "requests"
                } waiting`}
          </AppText>

          <AppText variant="caption" color="secondary">
            {pendingRequests.length === 0
              ? "There are no pending supervision requests."
              : "Review the requests below and respond when ready."}
          </AppText>
        </View>
      </View>

      {requests.length === 0 ? (
        <View style={styles.studentEmptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="people-outline" size={26} color={Colors.primary} />
          </View>

          <AppText variant="h5" weight="semibold" style={styles.emptyTitle}>
            No supervision requests
          </AppText>

          <AppText
            variant="body2"
            color="secondary"
            style={styles.emptyDescription}
          >
            Student supervision requests will appear here.
          </AppText>
        </View>
      ) : (
        <>
          {pendingRequests.length > 0 && (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <AppText variant="h5" weight="semibold">
                  Needs your response
                </AppText>

                <AppText variant="caption" color="secondary">
                  These students are waiting for your decision.
                </AppText>
              </View>
            </View>
          )}

          {pendingRequests.map((request) => (
            <SupervisorRequestCard
              key={request.id}
              request={request}
              respond={respond}
            />
          ))}

          {resolvedRequests.length > 0 && (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <AppText variant="h5" weight="semibold">
                  Previous requests
                </AppText>

                <AppText variant="caption" color="secondary">
                  Requests you have already responded to.
                </AppText>
              </View>
            </View>
          )}

          {resolvedRequests.map((request) => (
            <SupervisorRequestCard
              key={request.id}
              request={request}
              respond={respond}
            />
          ))}
        </>
      )}
    </View>
  );
};
