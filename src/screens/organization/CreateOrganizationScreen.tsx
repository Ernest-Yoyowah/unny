import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  AppText,
  Input,
  Button,
  Divider,
  SectionCard,
} from "../../components/ui";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<MainStackParamList, "CreateOrganization">;

const schema = z.object({
  name: z.string().min(4, "Full name must be at least 4 characters"),
  shortName: z
    .string()
    .min(2, "Short name is required")
    .max(10, "Max 10 characters"),
  domain: z.string().min(4, "Email domain required (e.g. legon.edu.gh)"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const STEPS = ["Basic Info", "Location", "Contact"];

export const CreateOrganizationScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shortName: "",
      domain: "",
      description: "",
      country: "Nigeria",
      state: "",
      website: "",
    },
  });

  const stepFields: (keyof FormValues)[][] = [
    ["name", "shortName", "description"],
    ["country", "state"],
    ["domain", "website"],
  ];

  const handleNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="close" size={22} color={Colors.text.primary} />
          </TouchableOpacity>
          <AppText variant="h5" weight="semibold">
            Register Institution
          </AppText>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.stepBar}>
          {STEPS.map((label, index) => (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  index <= step && styles.stepCircleActive,
                ]}
              >
                {index < step ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={Colors.text.inverse}
                  />
                ) : (
                  <AppText
                    variant="caption"
                    weight="semibold"
                    color={index <= step ? "inverse" : "tertiary"}
                  >
                    {index + 1}
                  </AppText>
                )}
              </View>
              <AppText
                variant="caption"
                weight={index === step ? "semibold" : "regular"}
                color={index <= step ? "primary" : "tertiary"}
              >
                {label}
              </AppText>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < step && styles.stepLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <Divider />

        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <SectionCard>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.sectionLabel}
              >
                Institution Details
              </AppText>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Full Institution Name"
                    placeholder="e.g. University of Lagos"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="shortName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Short Name / Acronym"
                    placeholder="e.g. LEGON2023"
                    autoCapitalize="characters"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.shortName?.message}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="About the Institution"
                    placeholder="Brief description..."
                    multiline
                    numberOfLines={3}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.description?.message}
                    required
                  />
                )}
              />
            </SectionCard>
          )}

          {step === 1 && (
            <SectionCard>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.sectionLabel}
              >
                Location
              </AppText>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Country"
                    placeholder="e.g. Nigeria"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.country?.message}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="State / Region"
                    placeholder="e.g. Lagos"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.state?.message}
                    required
                  />
                )}
              />
            </SectionCard>
          )}

          {step === 2 && (
            <SectionCard>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.sectionLabel}
              >
                Contact & Verification
              </AppText>
              <Controller
                control={control}
                name="domain"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Institutional Email Domain"
                    placeholder="e.g. legon.edu.gh"
                    keyboardType="url"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.domain?.message}
                    hint="Used to verify student and staff emails"
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name="website"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Official Website"
                    placeholder="https://legon.edu.gh"
                    keyboardType="url"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.website?.message}
                  />
                )}
              />
            </SectionCard>
          )}
        </ScrollView>

        <View
          style={[styles.footer, { paddingBottom: insets.bottom + Spacing[4] }]}
        >
          <View style={styles.footerRow}>
            {step > 0 && (
              <Button
                variant="outline"
                size="lg"
                label="Back"
                onPress={() => setStep((s) => s - 1)}
                style={styles.backStepBtn}
              />
            )}
            {step < STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="lg"
                label="Continue"
                onPress={handleNext}
                fullWidth={step === 0}
                style={styles.nextBtn}
              />
            ) : (
              <Button
                variant="primary"
                size="lg"
                label="Register Institution"
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                fullWidth={false}
                style={styles.nextBtn}
              />
            )}
          </View>
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[5],
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.default,
    marginLeft: Spacing[2],
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  formContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[8],
  },
  sectionLabel: {
    marginBottom: Spacing[4],
  },
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  footerRow: {
    flexDirection: "row",
    gap: Spacing[3],
  },
  backStepBtn: {
    flex: 0,
    minWidth: 100,
  },
  nextBtn: {
    flex: 1,
  },
});
