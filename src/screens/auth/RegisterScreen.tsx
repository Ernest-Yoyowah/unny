import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { useRegister } from "../../hooks/useAuth";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { AuthStackParamList } from "../../navigation/types";
import { extractApiError } from "../../api/client";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Computer Science",
  "Information Technology",
] as const;

const LEVEL_OPTIONS = ["400"] as const;

const schema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),

    email: z.string().email("Enter a valid institutional email address"),

    department: z
      .string()
      .min(1, "Select your department")
      .refine((value) => DEPARTMENT_OPTIONS.includes(value as any), {
        message: "Choose a valid department",
      }),

    matricNumber: z.string().optional(),

    level: z
      .string()
      .min(1, "Select your level")
      .refine((value) => LEVEL_OPTIONS.includes(value as any), {
        message: "Only final-year level 400 is allowed",
      }),

    role: z.enum(["student", "lecturer"]),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  onBlur,
  error,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.selectContainer}>
      <View style={styles.labelRow}>
        <AppText variant="label" weight="medium" color="primary">
          {label}
        </AppText>
        {required && (
          <AppText variant="label" color="error" style={styles.required}>
            *
          </AppText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.selectField, error && styles.selectFieldError]}
        onPress={() => {
          setIsOpen((prev) => !prev);
          onBlur?.();
        }}
        activeOpacity={0.9}
      >
        <AppText
          variant="body1"
          color={value ? "primary" : "tertiary"}
          style={[styles.selectValue, !value && styles.placeholderText]}
        >
          {value || placeholder}
        </AppText>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.text.tertiary}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                value === option.value && styles.optionActive,
              ]}
              onPress={() => {
                onChange(option.value);
                setIsOpen(false);
                onBlur?.();
              }}
            >
              <AppText
                variant="body1"
                color={value === option.value ? "primary" : "secondary"}
                weight={value === option.value ? "semibold" : "regular"}
              >
                {option.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <AppText variant="caption" color="error" style={styles.helperText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

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
      department: "",
      matricNumber: "",
      level: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  const apiError = error ? extractApiError(error) : null;

  useEffect(() => {
    if (apiError) Alert.alert("Registration failed", apiError.message);
  }, [apiError]);

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
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{
            top: 8,
            bottom: 8,
            left: 8,
            right: 8,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headingBlock}>
          <AppText variant="h2" weight="bold" style={styles.heading}>
            Create account
          </AppText>

          <AppText variant="body1" color="secondary">
            Join your academic community on Unny.
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
              Account type
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
                >
                  <Ionicons
                    name={
                      role === "student"
                        ? "school-outline"
                        : "cloud-upload-outline"
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
                    {role === "student" ? "Student" : "Lecturer"}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <Input
                label="Full Name"
                placeholder="Ama Mensah"
                autoCapitalize="words"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.fullName?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Institutional Email"
                placeholder="you@gctu.edu.gh"
                keyboardType="email-address"
                autoComplete="email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.email?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <SelectField
                label="Department"
                value={field.value}
                placeholder="Select department"
                options={DEPARTMENT_OPTIONS.map((option) => ({
                  label: option,
                  value: option,
                }))}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.department?.message}
                required
              />
            )}
          />

          {selectedRole === "student" && (
            <>
              <Controller
                control={control}
                name="matricNumber"
                render={({ field }) => (
                  <Input
                    label="Student ID"
                    placeholder="423******8"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.matricNumber?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <SelectField
                    label="Level"
                    value={field.value}
                    placeholder="Select level"
                    options={LEVEL_OPTIONS.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.level?.message}
                    required
                  />
                )}
              />
            </>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Password"
                placeholder="Create a strong password"
                isSecure
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.password?.message}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                isSecure
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
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

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

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
  },

  roleOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },

  roleText: {
    textTransform: "capitalize",
  },

  selectContainer: {
    width: "100%",
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[1.5],
  },

  required: {
    marginLeft: 2,
    lineHeight: 16,
  },

  selectField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    minHeight: 52,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },

  selectFieldError: {
    borderColor: Colors.status.error,
    backgroundColor: Colors.status.errorLight,
  },

  selectValue: {
    flex: 1,
    color: Colors.text.primary,
  },

  placeholderText: {
    color: Colors.text.tertiary,
  },

  optionsList: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing[2],
    overflow: "hidden",
  },

  option: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },

  optionActive: {
    backgroundColor: Colors.primaryDim,
  },

  helperText: {
    marginTop: Spacing[1.5],
  },

  submitBtn: {
    marginTop: Spacing[2],
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing[8],
  },
});
