import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppText, Input, Button } from "../../components/ui";
import { useForgotPassword } from "../../hooks/useAuth";
import { Colors, Spacing, Typography, BorderRadius } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { extractApiError } from "../../api/client";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const apiError = error ? extractApiError(error) : null;

  const onSubmit = (values: FormValues) => {
    forgotPassword(values.email, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSubmitted ? (
            <View style={styles.successState}>
              <View style={styles.successIcon}>
                <Ionicons
                  name="mail-open-outline"
                  size={44}
                  color={Colors.status.success}
                />
              </View>
              <AppText variant="h3" weight="bold" style={styles.heading}>
                Check your email
              </AppText>
              <AppText
                variant="body1"
                color="secondary"
                style={styles.successText}
              >
                We've sent a password reset link to your email address. The link
                expires in 30 minutes.
              </AppText>
              <Button
                variant="outline"
                size="md"
                label="Back to Sign In"
                onPress={() => navigation.navigate("Login")}
                style={styles.backToLogin}
              />
            </View>
          ) : (
            <>
              <View style={styles.headingBlock}>
                <AppText variant="h2" weight="bold" style={styles.heading}>
                  Reset password
                </AppText>
                <AppText variant="body1" color="secondary">
                  Enter your institutional email and we'll send you a reset
                  link.
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
                      placeholder="you@university.edu.ng"
                      keyboardType="email-address"
                      autoComplete="email"
                      textContentType="emailAddress"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      required
                    />
                  )}
                />

                <Button
                  variant="primary"
                  size="lg"
                  label="Send Reset Link"
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isPending}
                  fullWidth
                  style={styles.submitBtn}
                />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[6],
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
    marginLeft: -Spacing[2],
    marginTop: Spacing[2],
  },
  content: {
    flexGrow: 1,
    paddingBottom: Spacing[12],
  },
  headingBlock: {
    gap: Spacing[2],
    marginBottom: Spacing[8],
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
  submitBtn: {
    marginTop: Spacing[2],
  },
  successState: {
    flex: 1,
    paddingTop: Spacing[10],
    gap: Spacing[4],
    alignItems: "flex-start",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.status.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
  },
  successText: {
    lineHeight: 26,
  },
  backToLogin: {
    marginTop: Spacing[4],
  },
});
