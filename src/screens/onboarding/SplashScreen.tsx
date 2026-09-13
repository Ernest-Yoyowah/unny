import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  StatusBar,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui";
import { Colors, Spacing, Typography } from "../../theme";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const PARTICLES = [
  { left: "10%", top: "17%", size: 3, delay: 0 },
  { left: "86%", top: "20%", size: 4, delay: 500 },
  { left: "18%", top: "31%", size: 2, delay: 900 },
  { left: "91%", top: "38%", size: 3, delay: 300 },
  { left: "7%", top: "58%", size: 3, delay: 700 },
  { left: "88%", top: "65%", size: 2, delay: 1100 },
  { left: "15%", top: "78%", size: 3, delay: 400 },
  { left: "82%", top: "82%", size: 4, delay: 800 },
];

const NAVY = "#06182B";
const NAVY_DEEP = "#03111F";
const GOLD = "#F5B82E";
const GOLD_LIGHT = "#FFD66B";
const WHITE = "#FFFFFF";
const MUTED_WHITE = "rgba(255,255,255,0.72)";

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(14)).current;
  const backgroundScale = useRef(new Animated.Value(1)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const goldLineScale = useRef(new Animated.Value(0)).current;

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
              toValue: 0.42,
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
              toValue: 0.08,
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
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(goldLineScale, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
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

    const backgroundAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundScale, {
          toValue: 1.025,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScale, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    backgroundAnimation.start();

    particleLoops.forEach((animation) => {
      animation.start();
    });

    return () => {
      backgroundAnimation.stop();

      particleLoops.forEach((animation) => {
        animation.stop();
      });
    };
  }, [
    backgroundScale,
    bottomOpacity,
    bottomTranslate,
    contentOpacity,
    contentTranslate,
    exitOpacity,
    goldLineScale,
    logoOpacity,
    logoScale,
    navigation,
    particleAnimations,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: exitOpacity,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={NAVY_DEEP}
        translucent={false}
      />

      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ scale: backgroundScale }],
          },
        ]}
      >
        <Image
          source={require("../../../assets/gctu/sch-entrace.jpeg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.navyWash} />
        <View style={styles.imageTint} />
        <View style={styles.topOverlay} />
        <View style={styles.bottomOverlay} />
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
                  {
                    translateY: particleAnimations[index].translateY,
                  },
                  {
                    scale: particleAnimations[index].scale,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <View
        style={[
          styles.topBrand,
          {
            top: insets.top + Spacing[3],
          },
        ]}
      >
        <View style={styles.accentDot} />

        <AppText style={styles.universityLabel}>
          GHANA COMMUNICATION TECHNOLOGY UNIVERSITY
        </AppText>
      </View>

      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.brand,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../../../assets/gctu/logoMain.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Animated.View
            style={[
              styles.goldLine,
              {
                transform: [{ scaleX: goldLineScale }],
              },
            ]}
          />

          <AppText style={styles.brandSubtitle}>PROJECT ARCHIVE</AppText>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />

            <AppText style={styles.eyebrow}>ACADEMIC LEGACY</AppText>

            <View style={styles.eyebrowLine} />
          </View>

          <AppText style={styles.headline}>Final-year student archive</AppText>

          <AppText style={styles.description}>
            Discover completed projects, research, and ideas from the academic
            community of GCTU.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: bottomOpacity,
            transform: [{ translateY: bottomTranslate }],
            paddingBottom: Math.max(insets.bottom, Spacing[5]),
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingTrack}>
            <View style={styles.loadingProgress} />
          </View>
        </View>

        <AppText style={styles.footerText}>PREPARING YOUR ARCHIVE</AppText>

        <View style={styles.footerAccent} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NAVY_DEEP,
    overflow: "hidden",
  },

  background: {
    ...StyleSheet.absoluteFill,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  navyWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(3, 17, 31, 0.67)",
  },

  imageTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(6, 24, 43, 0.28)",
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "rgba(3, 15, 28, 0.26)",
  },

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "46%",
    backgroundColor: "rgba(3, 13, 25, 0.38)",
  },

  particles: {
    ...StyleSheet.absoluteFill,
  },

  particle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: GOLD,
  },

  topBrand: {
    position: "absolute",
    left: Spacing[6],
    right: Spacing[6],
    zIndex: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  accentDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: GOLD,
    marginRight: Spacing[2],
  },

  universityLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 8,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1.55,
    textAlign: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
    marginTop: -Spacing[7],
  },

  brand: {
    alignItems: "center",
    marginBottom: Spacing[7],
  },

  logo: {
    width: 225,
    height: 92,
  },

  goldLine: {
    width: 54,
    height: 3,
    marginTop: Spacing[4],
    backgroundColor: GOLD,
    borderRadius: 999,
  },

  brandSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 9,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 3.4,
    marginTop: Spacing[3],
  },

  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
  },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: Spacing[3],
  },

  eyebrowLine: {
    width: 30,
    height: 1,
    backgroundColor: "rgba(245,184,46,0.58)",
  },

  eyebrow: {
    color: GOLD_LIGHT,
    fontSize: 9,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 2.4,
    marginHorizontal: Spacing[2],
  },

  headline: {
    color: WHITE,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: Typography.weight.extrabold,
    letterSpacing: -0.9,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },

  description: {
    marginTop: Spacing[3],
    maxWidth: 330,
    color: MUTED_WHITE,
    fontSize: Typography.size.md,
    lineHeight: 23,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 6,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: Spacing[6],
  },

  loadingContainer: {
    width: 116,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
    marginBottom: Spacing[3],
  },

  loadingTrack: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  loadingProgress: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: GOLD,
  },

  footerText: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 8,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1.7,
    textAlign: "center",
  },

  footerAccent: {
    width: 20,
    height: 1,
    marginTop: Spacing[3],
    backgroundColor: "rgba(245,184,46,0.45)",
  },
});
