import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, EmptyState } from "../../components/ui";
import { MOCK_ORGANIZATIONS } from "../../data/mock";
import { useDebounce } from "../../hooks/useDebounce";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { OrganizationCard } from "@/components/moderation/PendingProjectCard";

type Props = NativeStackScreenProps<
  MainStackParamList,
  "OrganizationDiscovery"
>;

export const OrganizationDiscoveryScreen: React.FC<Props> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered =
    debouncedQuery.length >= 1
      ? MOCK_ORGANIZATIONS.filter(
          (o) =>
            o.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            o.shortName.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : MOCK_ORGANIZATIONS;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <AppText variant="h5" weight="semibold">
            Discover Organizations
          </AppText>
          <AppText variant="caption" color="tertiary">
            Find and join your institution
          </AppText>
        </View>
      </View>

      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.text.tertiary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities, colleges..."
            placeholderTextColor={Colors.text.tertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            allowFontScaling={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <AppText
            variant="caption"
            color="tertiary"
            style={styles.resultsLabel}
          >
            {filtered.length} institution{filtered.length !== 1 ? "s" : ""}{" "}
            found
          </AppText>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon="business-outline"
            title="No organizations found"
            description={`No results for "${debouncedQuery}"`}
          />
        )}
        renderItem={({ item }) => (
          <OrganizationCard
            organization={item}
            onPress={() => {
              if (item.verificationStatus === "verified") {
                navigation.navigate("VerificationFlow", {
                  organizationId: item.id,
                });
              }
            }}
          />
        )}
      />

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing[4] }]}
      >
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("CreateOrganization")}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={18} color={Colors.text.inverse} />
          <AppText variant="body2" weight="semibold" color="inverse">
            Register Your Institution
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[4],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -Spacing[2],
    marginTop: 2,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[4],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    fontFamily: "System",
    padding: 0,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[4],
  },
  resultsLabel: {
    marginBottom: Spacing[3],
  },
  separator: {
    height: Spacing[3],
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[4],
  },
});
