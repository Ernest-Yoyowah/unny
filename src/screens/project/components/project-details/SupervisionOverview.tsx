import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/ProjectDetailsScreen.styles";
import { Colors } from "@/theme";
import { AppText } from "@/components/ui";

type Props = {
  myRequests: any[];
  myLatestRequest?: any;
  onViewRequests: () => void;
};

export const SupervisionOverview: React.FC<Props> = ({
  myRequests,
  myLatestRequest,
  onViewRequests,
}) => (
  <View style={styles.supervisionOverviewCard}>
    <View style={styles.supervisionOverviewHeader}>
      <View style={styles.supervisionOverviewTitle}>
        <View style={styles.supervisionStatusIcon}>
          <Ionicons name="school-outline" size={22} color={Colors.accent} />
        </View>

        <View style={styles.supervisionStatusContent}>
          <AppText variant="body2" weight="semibold">
            Supervision requests
          </AppText>

          <AppText variant="caption" color="secondary">
            {myRequests.length === 0
              ? "You have not made a supervision request for this project yet."
              : `${myRequests.length} request${
                  myRequests.length === 1 ? "" : "s"
                } made for this project.`}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.viewRequestsButton}
        onPress={onViewRequests}
        accessibilityRole="button"
        accessibilityLabel="View all supervision requests"
      >
        <AppText variant="caption" weight="semibold">
          View all
        </AppText>

        <Ionicons
          name="chevron-forward-outline"
          size={16}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>

    {myRequests.length === 0 ? (
      <View style={styles.supervisionEmpty}>
        <AppText variant="caption" color="secondary">
          Request a supervisor below and your request status will appear here.
        </AppText>
      </View>
    ) : (
      <View style={styles.supervisionRequestList}>
        {myRequests.map((request) => {
          const supervisorName =
            request.supervisor?.fullName ??
            request.supervisor?.name ??
            "Supervisor";

          return (
            <View
              key={request.id}
              style={[
                styles.studentSupervisionRequest,
                request.status === "ACCEPTED" &&
                  styles.studentSupervisionRequestAccepted,
                request.status === "REJECTED" &&
                  styles.studentSupervisionRequestRejected,
              ]}
            >
              <View
                style={[
                  styles.requestStatusIcon,
                  request.status === "ACCEPTED" &&
                    styles.requestStatusIconAccepted,
                  request.status === "REJECTED" &&
                    styles.requestStatusIconRejected,
                ]}
              >
                <Ionicons
                  name={
                    request.status === "ACCEPTED"
                      ? "checkmark-circle-outline"
                      : request.status === "REJECTED"
                        ? "close-circle-outline"
                        : "time-outline"
                  }
                  size={19}
                  color={
                    request.status === "ACCEPTED"
                      ? Colors.status.success
                      : request.status === "REJECTED"
                        ? Colors.status.error
                        : Colors.accent
                  }
                />
              </View>

              <View style={styles.requestStatusContent}>
                <AppText variant="body2" weight="semibold">
                  {supervisorName}
                </AppText>

                <AppText variant="caption" color="secondary">
                  {request.status === "PENDING"
                    ? "Pending response"
                    : request.status === "ACCEPTED"
                      ? "Request accepted"
                      : "Request declined"}
                </AppText>
              </View>

              <View
                style={[
                  styles.requestStatusBadge,
                  request.status === "ACCEPTED" &&
                    styles.requestStatusBadgeAccepted,
                  request.status === "REJECTED" &&
                    styles.requestStatusBadgeRejected,
                ]}
              >
                <AppText
                  variant="caption"
                  weight="semibold"
                  color={
                    request.status === "ACCEPTED"
                      ? "success"
                      : request.status === "REJECTED"
                        ? "error"
                        : "secondary"
                  }
                >
                  {request.status}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    )}

    {myLatestRequest && (
      <View style={styles.latestRequestMessage}>
        <AppText variant="caption" color="secondary">
          Latest request:{" "}
          {myLatestRequest.supervisor?.fullName ??
            myLatestRequest.supervisor?.name ??
            "Supervisor"}{" "}
          · {myLatestRequest.status}
        </AppText>
      </View>
    )}
  </View>
);
