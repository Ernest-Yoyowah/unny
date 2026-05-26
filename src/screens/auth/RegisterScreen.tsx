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
import { AppText, Input, Button, Badge } from "../../components/ui";
import { useRegister } from "../../hooks/useAuth";
import { Colors, Spacing, Typography, BorderRadius } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { extractApiError } from "../../api/client";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const schema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid institutional email address"),
    organizationCode: z.string().min(4, "Enter a valid organization join code"),
    role: z.enum(["student", "lecturer"]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { mutate: register, isPending, error } = useRegister();
  const [selectedRole, setSelectedRole] = useState<"student" | "lecturer">(
    "student",
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      organizationCode: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  const apiError = error ? extractApiError(error) : null;

  const onSubmit = (values: FormValues) => {
    register(values);
  };

  const handleRoleSelect = (role: "student" | "lecturer") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headingBlock}>
          <AppText variant="h2" weight="bold" style={styles.heading}>
            Create account
          </AppText>
          <AppText variant="body1" color="secondary">
            Join your institution on Unny.
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

          <View>
            <AppText
              variant="label"
              weight="medium"
              color="secondary"
              style={styles.roleLabel}
            >
              I am a
            </AppText>
            <View style={styles.roleSelector}>
              {(["student", "lecturer"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    selectedRole === role && styles.roleOptionActive,
                  ]}
                  onPress={() => handleRoleSelect(role)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selectedRole === role }}
                >
                  <Ionicons
                    name={
                      role === "student" ? "school-outline" : "easel-outline"
                    }
                    size={18}
                    color={
                      selectedRole === role
                        ? Colors.primary
                        : Colors.text.tertiary
                    }
                  />
                  <AppText
                    variant="body2"
                    weight={selectedRole === role ? "semibold" : "regular"}
                    color={selectedRole === role ? "primary" : "tertiary"}
                    style={styles.roleText}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Dr. Amaka Okonkwo"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                required
              />
            )}
          />

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

          <Controller
            control={control}
            name="organizationCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Organization Join Code"
                placeholder="e.g. LEGON2023"
                autoCapitalize="characters"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.organizationCode?.message}
                hint="Provided by your institution admin"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a strong password"
                isSecure
                textContentType="newPassword"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                isSecure
                textContentType="newPassword"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                required
              />
            )}
          />

          <Button
            variant="primary"
            size="lg"
            label="Create Account"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
            fullWidth
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="body2" color="secondary">
            Already have an account?{" "}
          </AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            accessibilityRole="button"
          >
            <AppText variant="body2" color="accent" weight="semibold">
              Sign In
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[12],
    paddingTop: Spacing[4],
    flexGrow: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
    marginLeft: -Spacing[2],
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
  roleLabel: {
    marginBottom: Spacing[2],
    color: Colors.text.secondary,
  },
  roleSelector: {
    flexDirection: "row",
    gap: Spacing[3],
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.surface,
  },
  roleOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },
  roleText: {
    textTransform: "capitalize",
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
