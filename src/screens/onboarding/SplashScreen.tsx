import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui";
import { Colors, Spacing, Typography, BorderRadius } from "../../theme";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PARTICLES = [
  { left: "12%", top: "19%", size: 4, delay: 0 },
  { left: "82%", top: "23%", size: 3, delay: 500 },
  { left: "22%", top: "34%", size: 2, delay: 900 },
  { left: "88%", top: "39%", size: 4, delay: 300 },
  { left: "8%", top: "61%", size: 3, delay: 700 },
  { left: "91%", top: "67%", size: 2, delay: 1100 },
  { left: "17%", top: "78%", size: 3, delay: 400 },
  { left: "79%", top: "81%", size: 4, delay: 800 },
];

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const logoScale = useRef(new Animated.Value(0.65)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0.25)).current;
  const ringScale = useRef(new Animated.Value(0.7)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(24)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(18)).current;
  const backgroundScale = useRef(new Animated.Value(1)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const particleAnimations = useRef(
    PARTICLES.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(8),
      scale: new Animated.Value(0.7),
    })),
  ).current;

  useEffect(() => {
    const particleLoops = particleAnimations.map((particle, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(PARTICLES[index].delay),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.7,
              duration: 900,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: -10,
              duration: 1600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.25,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: 8,
              duration: 1600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0.7,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ),
    );

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          friction: 7,
          tension: 35,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslate, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bottomTranslate, {
          toValue: 0,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(850),
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        navigation.replace("Onboarding");
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 0.55,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoGlow, {
          toValue: 0.2,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundScale, {
          toValue: 1.04,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScale, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    particleLoops.forEach((animation) => animation.start());

    return () => {
      particleLoops.forEach((animation) => animation.stop());
    };
  }, [
    backgroundScale,
    bottomOpacity,
    bottomTranslate,
    contentOpacity,
    contentTranslate,
    exitOpacity,
    logoGlow,
    logoOpacity,
    logoScale,
    navigation,
    particleAnimations,
    ringOpacity,
    ringScale,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: exitOpacity,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ scale: backgroundScale }],
          },
        ]}
      >
        <View style={styles.backgroundOrbOne} />
        <View style={styles.backgroundOrbTwo} />
        <View style={styles.backgroundOrbThree} />
      </Animated.View>

      <View style={styles.particles}>
        {PARTICLES.map((particle, index) => (
          <Animated.View
            key={`${particle.left}-${particle.top}`}
            style={[
              styles.particle,
              {
                width: particle.size,
                height: particle.size,
                left: particle.left as `${number}%`,
                top: particle.top as `${number}%`,
                opacity: particleAnimations[index].opacity,
                transform: [
                  { translateY: particleAnimations[index].translateY },
                  { scale: particleAnimations[index].scale },
                ],
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.center}>
        <View style={styles.logoArea}>
          <Animated.View
            style={[
              styles.outerRing,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.middleRing,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: logoGlow,
                transform: [{ scale: logoScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logo,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <AppText style={styles.logoText}>U</AppText>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <AppText style={styles.brandName}>Unny</AppText>

          <AppText style={styles.headline}>
            Where ideas
            {"\n"}
            become <AppText style={styles.headlineAccent}>impact.</AppText>
          </AppText>

          <AppText style={styles.description}>
            Discover knowledge. Share ideas.{"\n"}Build what lasts.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: bottomOpacity,
            transform: [{ translateY: bottomTranslate }],
          },
        ]}
      >
        <View style={styles.footerLine} />
        <AppText style={styles.footerText}>
          A trusted home for academic excellence
        </AppText>
        <View style={styles.footerIcon}>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOrbOne: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.35,
    height: SCREEN_WIDTH * 1.35,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: Colors.primaryDim,
    opacity: 0.3,
    top: -SCREEN_WIDTH * 0.6,
    left: -SCREEN_WIDTH * 0.35,
  },
  backgroundOrbTwo: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.15,
    height: SCREEN_WIDTH * 1.15,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: Colors.primary,
    opacity: 0.045,
    bottom: -SCREEN_WIDTH * 0.35,
    right: -SCREEN_WIDTH * 0.45,
  },
  backgroundOrbThree: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: Colors.primary,
    opacity: 0.035,
    top: SCREEN_HEIGHT * 0.32,
    left: -SCREEN_WIDTH * 0.38,
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
    marginTop: -Spacing[10],
  },
  logoArea: {
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[8],
  },
  outerRing: {
    position: "absolute",
    width: 186,
    height: 186,
    borderRadius: 93,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  middleRing: {
    position: "absolute",
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 35,
    elevation: 20,
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  logoText: {
    color: Colors.text.inverse,
    fontSize: 54,
    lineHeight: 62,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: -3,
  },
  content: {
    alignItems: "center",
  },
  brandName: {
    color: Colors.primary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    letterSpacing: 5,
    marginBottom: Spacing[4],
  },
  headline: {
    color: Colors.text.primary,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: -1.5,
    textAlign: "center",
  },
  headlineAccent: {
    color: Colors.primary,
  },
  description: {
    marginTop: Spacing[5],
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
    lineHeight: 24,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[5],
  },
  footerLine: {
    width: 34,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: Spacing[3],
  },
  footerText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  footerIcon: {
    marginTop: Spacing[3],
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },
});
