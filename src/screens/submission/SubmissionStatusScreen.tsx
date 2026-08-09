import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  AppText,
  Button,
  Badge,
  SectionCard,
  Divider,
} from "../../components/ui";
import { MOCK_ORGANIZATIONS } from "../../data/mock";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { VerificationDocumentType } from "@/types/moderation.types";

type Props = NativeStackScreenProps<MainStackParamList, "VerificationFlow">;

type StepId = "intro" | "documents" | "review" | "submitted";

const REQUIRED_DOCS: {
  type: VerificationDocumentType;
  label: string;
  description: string;
}[] = [
  {
    type: "government_registration",
    label: "Government Registration",
    description:
      "Certificate of registration from the relevant government authority",
  },
  {
    type: "accreditation_certificate",
    label: "Accreditation Letter",
    description:
      "Official accreditation letter from the relevant educational authority",
  },
  {
    type: "letterhead",
    label: "Official Letterhead",
    description: "Sample of official institution letterhead",
  },
];

export const VerificationFlowScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { organizationId } = route.params;
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<StepId>("intro");
  const [uploadedDocs, setUploadedDocs] = useState<VerificationDocumentType[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const org = MOCK_ORGANIZATIONS.find((o) => o.id === organizationId);
  if (!org) return null;

  const canSubmit = uploadedDocs.length === REQUIRED_DOCS.length;

  const toggleDoc = (type: VerificationDocumentType) => {
    setUploadedDocs((prev) =>
      prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type],
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("submitted");
    }, 1500);
  };

  if (step === "submitted") {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.submittedContent}>
          <View style={styles.submittedIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={52}
              color={Colors.status.success}
            />
          </View>
          <AppText variant="h3" weight="bold">
            Submitted
          </AppText>
          <AppText
            variant="body1"
            color="secondary"
            style={styles.submittedText}
          >
            Your verification request for {org.name} has been submitted. Our
            team will review the documents within 3–5 business days.
          </AppText>
          <Button
            variant="primary"
            size="lg"
            label="Done"
            fullWidth
            style={styles.doneBtn}
            onPress={() => navigation.popToTop()}
          />
        </View>
      </View>
    );
  }

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
        <AppText variant="h5" weight="semibold">
          Verification
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === "intro" && (
          <>
            <View style={styles.orgIntro}>
              <View style={styles.orgLogo}>
                <AppText variant="h4" weight="bold" color="inverse">
                  {org.shortName.slice(0, 2)}
                </AppText>
              </View>
              <AppText variant="h4" weight="bold" style={styles.orgName}>
                {org.name}
              </AppText>
              <Badge
                label={org.verificationStatus}
                variant="warning"
                size="md"
              />
            </View>

            <SectionCard style={styles.infoCard}>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.cardLabel}
              >
                What is institution verification?
              </AppText>
              <AppText
                variant="body2"
                color="secondary"
                style={styles.infoText}
              >
                Verification confirms that your institution is a legitimate
                educational organization. Verified institutions gain access to
                all platform features including course management and student
                enrollment.
              </AppText>
            </SectionCard>

            <SectionCard style={styles.infoCard}>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.cardLabel}
              >
                Required Documents
              </AppText>
              {REQUIRED_DOCS.map((doc, index) => (
                <View key={doc.type}>
                  <View style={styles.docPreviewRow}>
                    <View style={styles.docBullet}>
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color={Colors.accent}
                      />
                    </View>
                    <View style={styles.docPreviewInfo}>
                      <AppText variant="body2" weight="medium">
                        {doc.label}
                      </AppText>
                      <AppText variant="caption" color="tertiary">
                        {doc.description}
                      </AppText>
                    </View>
                  </View>
                  {index < REQUIRED_DOCS.length - 1 && (
                    <Divider spacing={Spacing[3]} />
                  )}
                </View>
              ))}
            </SectionCard>
          </>
        )}

        {step === "documents" && (
          <>
            <AppText
              variant="body2"
              color="secondary"
              style={styles.uploadInstruction}
            >
              Upload each of the required documents. Accepted formats: PDF, JPG,
              PNG.
            </AppText>

            <SectionCard style={styles.docsCard}>
              {REQUIRED_DOCS.map((doc, index) => {
                const isUploaded = uploadedDocs.includes(doc.type);
                return (
                  <View key={doc.type}>
                    <TouchableOpacity
                      style={styles.uploadRow}
                      onPress={() => toggleDoc(doc.type)}
                      activeOpacity={0.75}
                      accessibilityRole="button"
                    >
                      <View
                        style={[
                          styles.uploadStatus,
                          isUploaded && styles.uploadStatusDone,
                        ]}
                      >
                        <Ionicons
                          name={
                            isUploaded ? "checkmark" : "cloud-upload-outline"
                          }
                          size={16}
                          color={
                            isUploaded
                              ? Colors.text.inverse
                              : Colors.text.tertiary
                          }
                        />
                      </View>
                      <View style={styles.uploadInfo}>
                        <AppText variant="body2" weight="medium">
                          {doc.label}
                        </AppText>
                        <AppText
                          variant="caption"
                          color={isUploaded ? "success" : "tertiary"}
                        >
                          {isUploaded ? "Uploaded" : "Tap to upload"}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                    {index < REQUIRED_DOCS.length - 1 && (
                      <Divider spacing={0} />
                    )}
                  </View>
                );
              })}
            </SectionCard>
          </>
        )}

        {step === "review" && (
          <>
            <SectionCard style={styles.reviewCard}>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.cardLabel}
              >
                Review Submission
              </AppText>
              {REQUIRED_DOCS.map((doc) => (
                <View key={doc.type} style={styles.reviewDocRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={Colors.status.success}
                  />
                  <AppText variant="body2" weight="medium">
                    {doc.label}
                  </AppText>
                </View>
              ))}
            </SectionCard>

            <View style={styles.notice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={Colors.text.tertiary}
              />
              <AppText
                variant="caption"
                color="tertiary"
                style={styles.noticeText}
              >
                Submitting false documentation may result in permanent
                suspension of your account.
              </AppText>
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + Spacing[4] }]}
      >
        {step === "intro" && (
          <Button
            variant="primary"
            size="lg"
            label="Begin Verification"
            fullWidth
            onPress={() => setStep("documents")}
          />
        )}
        {step === "documents" && (
          <View style={styles.footerRow}>
            <Button
              variant="outline"
              size="lg"
              label="Back"
              onPress={() => setStep("intro")}
              style={styles.backStepBtn}
            />
            <Button
              variant="primary"
              size="lg"
              label="Review"
              onPress={() => setStep("review")}
              disabled={!canSubmit}
              style={styles.nextBtn}
            />
          </View>
        )}
        {step === "review" && (
          <View style={styles.footerRow}>
            <Button
              variant="outline"
              size="lg"
              label="Back"
              onPress={() => setStep("documents")}
              style={styles.backStepBtn}
            />
            <Button
              variant="primary"
              size="lg"
              label="Submit"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              style={styles.nextBtn}
            />
          </View>
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
  content: {
    padding: Spacing[5],
    gap: Spacing[4],
    paddingBottom: Spacing[8],
  },
  orgIntro: {
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },
  orgLogo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
  },
  orgName: {
    textAlign: "center",
  },
  infoCard: {
    gap: 0,
  },
  cardLabel: {
    marginBottom: Spacing[4],
  },
  infoText: {
    lineHeight: 22,
  },
  docPreviewRow: {
    flexDirection: "row",
    gap: Spacing[3],
    paddingVertical: Spacing[1],
  },
  docBullet: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  docPreviewInfo: {
    flex: 1,
    gap: 2,
  },
  uploadInstruction: {
    lineHeight: 22,
  },
  docsCard: {
    padding: 0,
    overflow: "hidden",
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
  },
  uploadStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadStatusDone: {
    backgroundColor: Colors.status.success,
    borderColor: Colors.status.success,
  },
  uploadInfo: {
    flex: 1,
    gap: 2,
  },
  reviewCard: {
    gap: Spacing[3],
  },
  reviewDocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  notice: {
    flexDirection: "row",
    gap: Spacing[2],
    alignItems: "flex-start",
  },
  noticeText: {
    flex: 1,
    lineHeight: 18,
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
    minWidth: 100,
  },
  nextBtn: {
    flex: 1,
  },
  submittedContent: {
    flex: 1,
    padding: Spacing[6],
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
  },
  submittedIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.status.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
  },
  submittedText: {
    textAlign: "center",
    lineHeight: 26,
  },
  doneBtn: {
    marginTop: Spacing[4],
  },
});
