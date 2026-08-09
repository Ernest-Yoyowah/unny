import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppText, Button } from "../../components/ui";
import { Colors, Spacing, Typography, BorderRadius } from "../../theme";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  tagline: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: "rocket-outline",
    tagline: "ACADEMIC PROJECTS",
    title: "Discover and showcase academic work.",
    description:
      "Explore student projects, research resources, and academic contributions from verified institutions in one trusted platform.",
  },
  {
    id: "2",
    icon: "shield-checkmark-outline",
    tagline: "VERIFIED COMMUNITY",
    title: "A trusted academic network.",
    description:
      "Students, Lecturers, and institutions connect through verified identities, reducing misinformation and protecting academic work.",
  },
  {
    id: "3",
    icon: "cloud-upload-outline",
    tagline: "SHARE KNOWLEDGE",
    title: "Submit, organize, and preserve ideas.",
    description:
      "Upload projects, attach resources, add documentation, and build a lasting archive of academic achievements.",
  },
  {
    id: "4",
    icon: "git-merge-outline",
    tagline: "COLLABORATION",
    title: "From submission to recognition.",
    description:
      "Follow projects through discovery, review, moderation, and approval while building a stronger academic ecosystem.",
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate("Auth");
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <AppText style={styles.logoText}>U</AppText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <AppText variant="body2" color="tertiary" weight="medium">
            Skip
          </AppText>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={48} color={Colors.primary} />
            </View>
            <AppText variant="overline" color="tertiary" style={styles.tagline}>
              {item.tagline}
            </AppText>
            <AppText variant="h2" weight="bold" style={styles.title}>
              {item.title}
            </AppText>
            <AppText
              variant="body1"
              color="secondary"
              style={styles.description}
            >
              {item.description}
            </AppText>
          </View>
        )}
      />

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing[6] }]}
      >
        <View style={styles.indicators}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Button
          variant="primary"
          size="lg"
          label={isLast ? "Get Started" : "Continue"}
          onPress={goNext}
          fullWidth
          rightIcon={
            !isLast ? (
              <Ionicons
                name="arrow-forward"
                size={18}
                color={Colors.text.inverse}
              />
            ) : undefined
          }
        />

        {activeIndex === 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Auth")}
            style={styles.signInLink}
            accessibilityRole="button"
          >
            <AppText variant="body2" color="secondary">
              Already have an account?{" "}
              <AppText variant="body2" color="accent" weight="semibold">
                Sign in
              </AppText>
            </AppText>
          </TouchableOpacity>
        )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.extrabold,
  },
  slide: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[8],
    gap: Spacing[4],
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius["2xl"],
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
  },
  tagline: {
    marginBottom: -Spacing[2],
  },
  title: {
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  description: {
    lineHeight: 26,
    color: Colors.text.secondary,
  },
  footer: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    gap: Spacing[5],
  },
  indicators: {
    flexDirection: "row",
    gap: Spacing[1.5],
    marginBottom: Spacing[1],
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border.strong,
  },
  signInLink: {
    alignItems: "center",
    paddingTop: Spacing[1],
  },
});
