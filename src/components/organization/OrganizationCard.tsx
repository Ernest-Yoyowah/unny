import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge } from "../ui";
import { Organization } from "../../types/organization.types";
import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

interface OrganizationCardProps {
  organization: Organization;
  onPress: () => void;
  variant?: "default" | "search";
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onPress,
  variant = "default",
}) => {
  const isVerified = organization.verificationStatus === "verified";

  if (variant === "search") {
    return (
      <TouchableOpacity
        style={styles.searchCard}
        onPress={onPress}
        activeOpacity={0.78}
        accessibilityRole="button"
        accessibilityLabel={organization.name}
      >
        <View style={styles.logoPlaceholder}>
          <AppText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: Colors.text.inverse,
            }}
          >
            {organization.shortName.slice(0, 2)}
          </AppText>
        </View>

        <View style={styles.searchContent}>
          <View style={styles.nameRow}>
            <AppText
              variant="body2"
              weight="semibold"
              numberOfLines={1}
              style={styles.orgName}
            >
              {organization.shortName}
            </AppText>
            {isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={Colors.status.success}
              />
            )}
          </View>
          <AppText variant="caption" color="secondary" numberOfLines={1}>
            {organization.name}
          </AppText>
          <AppText variant="caption" color="tertiary">
            {organization.city}, {organization.country}
          </AppText>
        </View>

        <View style={styles.searchMeta}>
          <AppText variant="caption" color="tertiary">
            {organization.memberCount.toLocaleString()} members
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={organization.name}
    >
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          <AppText
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: Colors.text.inverse,
              letterSpacing: -0.5,
            }}
          >
            {organization.shortName.slice(0, 2)}
          </AppText>
        </View>

        <View style={styles.headerMeta}>
          {isVerified ? (
            <Badge label="Verified" variant="success" dot />
          ) : organization.verificationStatus === "pending" ? (
            <Badge label="Pending" variant="warning" dot />
          ) : (
            <Badge label="Unverified" variant="default" />
          )}
        </View>
      </View>

      <AppText variant="h5" weight="bold" numberOfLines={2} style={styles.name}>
        {organization.name}
      </AppText>

      <AppText
        variant="caption"
        color="secondary"
        numberOfLines={1}
        style={styles.shortInfo}
      >
        Est. {organization.establishedYear} · {organization.city},{" "}
        {organization.country}
      </AppText>

      <AppText
        variant="body2"
        color="secondary"
        numberOfLines={2}
        style={styles.description}
      >
        {organization.description}
      </AppText>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons
            name="people-outline"
            size={14}
            color={Colors.text.tertiary}
          />
          <AppText variant="caption" color="tertiary" style={styles.statText}>
            {organization.memberCount.toLocaleString()} members
          </AppText>
        </View>
        <View style={styles.dividerDot} />
        <View style={styles.stat}>
          <Ionicons
            name="book-outline"
            size={14}
            color={Colors.text.tertiary}
          />
          <AppText variant="caption" color="tertiary" style={styles.statText}>
            {organization.courseCount} courses
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing[2.5],
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing[1],
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerMeta: {
    marginTop: 2,
  },
  name: {
    lineHeight: 24,
  },
  shortInfo: {
    marginTop: -Spacing[1],
  },
  description: {
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing[3],
    marginTop: Spacing[1],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing[2],
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    marginLeft: 2,
  },
  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border.strong,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing[3],
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  searchContent: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orgName: {
    flex: 1,
  },
  searchMeta: {
    alignItems: "flex-end",
  },
});
