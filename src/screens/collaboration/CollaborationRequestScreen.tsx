import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppText, Button, Card } from "../../components/ui";
import { useNotifications } from "../../hooks/useNotifications";
import {
  useAcceptCollaborationInvite,
  useMyCollaborationInvites,
  useRejectCollaborationInvite,
} from "./hooks/useCollaboration";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./styles/CollaborationRequestScreen.styles";

type Props = NativeStackScreenProps<MainStackParamList, "CollaborationRequest">;

export const CollaborationRequestScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();

  const { data } = useNotifications();
  const { data: collaborationInvites, isLoading: isLoadingInvites } =
    useMyCollaborationInvites();

  const acceptInvite = useAcceptCollaborationInvite();
  const rejectInvite = useRejectCollaborationInvite();

  const notification = data?.data.find(
    (item) => item.id === route.params.notificationId,
  );

  const invitation = collaborationInvites?.data.find(
    (item) =>
      item.projectId === route.params.projectId ||
      item.project?.id === route.params.projectId,
  );

  const projectTitle =
    invitation?.project?.title ??
    notification?.message?.match(/"([^"]+)"/)?.[1] ??
    "Academic project";

  const isProcessing = acceptInvite.isPending || rejectInvite.isPending;

  const handleAccept = async () => {
    if (!invitation?.id) {
      Alert.alert(
        "Invitation unavailable",
        "We couldn't find the collaboration invite for this project.",
      );
      return;
    }

    try {
      await acceptInvite.mutateAsync({
        inviteId: invitation.id,
      });

      Alert.alert(
        "You're in",
        "You have successfully joined the collaboration.",
        [
          {
            text: "View project",
            onPress: () => {
              navigation.popToTop();
              navigation.navigate("ProjectDetails", {
                projectId: route.params.projectId,
              });
            },
          },
        ],
      );
    } catch {
      Alert.alert(
        "Unable to accept",
        "We couldn't accept the collaboration invitation. Please try again.",
      );
    }
  };

  const handleReject = () => {
    if (!invitation?.id) {
      Alert.alert(
        "Invitation unavailable",
        "We couldn't find the collaboration invite for this project.",
      );
      return;
    }

    Alert.alert(
      "Decline invitation?",
      "You won't be added to this project if you decline this invitation.",
      [
        {
          text: "Keep invitation",
          style: "cancel",
        },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await rejectInvite.mutateAsync({
                inviteId: invitation.id,
              });

              Alert.alert(
                "Invitation declined",
                "The collaboration invitation has been declined.",
                [
                  {
                    text: "Done",
                    onPress: () => navigation.popToTop(),
                  },
                ],
              );
            } catch {
              Alert.alert(
                "Unable to decline",
                "We couldn't decline the invitation. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={21} color={Colors.text.primary} />
        </TouchableOpacity>

        <AppText variant="h5" weight="semibold">
          Collaboration
        </AppText>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing[8],
          },
        ]}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="people-outline" size={34} color={Colors.primary} />
          </View>

          <AppText variant="overline" color="tertiary" style={styles.eyebrow}>
            COLLABORATION INVITATION
          </AppText>

          <AppText variant="h2" weight="bold" style={styles.heading}>
            You’ve been invited to collaborate
          </AppText>

          <AppText variant="body1" color="secondary" style={styles.intro}>
            Someone has invited you to contribute to an academic project. Review
            the invitation before making your decision.
          </AppText>
        </View>

        <Card style={styles.projectCard}>
          <View style={styles.projectLabelRow}>
            <View style={styles.projectIcon}>
              <Ionicons
                name="rocket-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View style={styles.projectLabel}>
              <AppText variant="caption" color="tertiary" weight="semibold">
                PROJECT
              </AppText>

              <AppText variant="body1" weight="semibold" numberOfLines={4}>
                {projectTitle}
              </AppText>
            </View>
          </View>
        </Card>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Colors.accent}
            />
          </View>

          <View style={styles.infoContent}>
            <AppText variant="body2" weight="semibold">
              What happens if you accept?
            </AppText>

            <AppText
              variant="caption"
              color="secondary"
              style={styles.infoText}
            >
              You'll become a collaborator on this project and gain access to
              the project workspace and its collaboration features.
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            label="Accept invitation"
            fullWidth
            disabled={isProcessing || isLoadingInvites || !invitation}
            isLoading={acceptInvite.isPending || isLoadingInvites}
            onPress={handleAccept}
            rightIcon={
              !acceptInvite.isPending && !isLoadingInvites ? (
                <Ionicons
                  name="checkmark"
                  size={19}
                  color={Colors.text.inverse}
                />
              ) : undefined
            }
          />

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            disabled={isProcessing || isLoadingInvites || !invitation}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Decline collaboration invitation"
          >
            <Ionicons
              name="close-outline"
              size={18}
              color={Colors.status.error}
            />

            <AppText
              variant="body2"
              weight="semibold"
              style={styles.rejectText}
            >
              Decline invitation
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
