import React, { useEffect } from "react";
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppText, Input, Button } from "../../components/ui";
import { useLogin } from "../../hooks/useAuth";
import { Colors, Spacing, Typography, BorderRadius } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { extractApiError } from "../../api/client";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const { mutateAsync: login, isPending, error, reset } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const apiError = error ? extractApiError(error) : null;

  useEffect(() => {
    if (!apiError) {
      return;
    }

    Alert.alert("Sign in failed", apiError.message);
  }, [apiError]);

  const onSubmit = async (values: FormValues) => {
    if (isPending) {
      return;
    }

    reset();

    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
    } catch {
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.hero,
          {
            paddingTop: insets.top + Spacing[8],
          },
        ]}
      >
        <Image
          source={require("../../../assets/gctu/logo-2.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headingBlock}>
            <AppText variant="h3" weight="bold" style={styles.heading}>
              Welcome back
            </AppText>

            <AppText variant="body2" color="secondary">
              Sign in to continue exploring your academic community.
            </AppText>
          </View>

          <View style={styles.form}>
            {apiError && (
              <View style={styles.errorBanner}>
                <AppText variant="body2" color="error">
                  {apiError.message}
                </AppText>
              </View>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Institutional Email"
                  placeholder="student@gctu.edu.gh"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  required
                  editable={!isPending}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  isSecure
                  autoComplete="password"
                  textContentType="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  required
                  editable={!isPending}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotLink}
              accessibilityRole="button"
              disabled={isPending}
            >
              <AppText variant="body2" color="accent" weight="medium">
                Forgot password?
              </AppText>
            </TouchableOpacity>

            <Button
              variant="primary"
              size="lg"
              label={isPending ? "Signing In..." : "Sign In"}
              onPress={handleSubmit(onSubmit)}
              isLoading={isPending}
              fullWidth
              disabled={isPending}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footer}>
            <AppText variant="body2" color="secondary">
              New to GCTU archive?{" "}
            </AppText>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              accessibilityRole="button"
              disabled={isPending}
            >
              <AppText variant="body2" color="accent" weight="semibold">
                Create account
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  hero: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingBottom: Spacing[10],
    gap: Spacing[2],
  },

  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
    overflow: "hidden",
  },

  logoImage: {
    width: "100%",
    height: 100,
  },

  brandName: {
    color: Colors.text.inverse,
    fontSize: Typography.size["3xl"],
    fontWeight: Typography.weight.extrabold,
    letterSpacing: -1,
    paddingTop: Spacing[2],
  },

  tagline: {
    color: "white",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    letterSpacing: 0.4,
  },

  sheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    overflow: "hidden",
  },

  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.default,
    alignSelf: "center",
    marginTop: Spacing[3],
  },

  content: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[12],
  },

  headingBlock: {
    gap: Spacing[1],
    marginTop: Spacing[5],
    marginBottom: Spacing[7],
  },

  heading: {
    letterSpacing: -0.5,
  },

  form: {
    gap: Spacing[4],
  },

  errorBanner: {
    backgroundColor: Colors.status.errorLight,
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
  },

  forgotLink: {
    alignSelf: "flex-end",
    marginTop: -Spacing[2],
  },

  submitBtn: {
    marginTop: Spacing[2],
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing[8],
  },
});
