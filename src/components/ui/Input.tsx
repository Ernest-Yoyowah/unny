import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./Typography";
import { Colors, Typography, BorderRadius, Spacing } from "../../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isSecure?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isSecure = false,
      containerStyle,
      inputStyle,
      required = false,
      editable = true,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(!isSecure);

    const borderColor = error
      ? Colors.status.error
      : isFocused
        ? Colors.accent
        : Colors.border.default;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelRow}>
            <AppText
              variant="label"
              weight="medium"
              color="primary"
              style={styles.label}
            >
              {label}
            </AppText>
            {required && (
              <AppText variant="label" color="error" style={styles.required}>
                *
              </AppText>
            )}
          </View>
        )}

        <View
          style={[
            styles.inputWrapper,
            { borderColor },
            isFocused && styles.inputFocused,
            !editable && styles.inputDisabled,
            error && styles.inputError,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeft : null,
              inputStyle,
            ]}
            secureTextEntry={!isVisible}
            placeholderTextColor={Colors.text.tertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={editable}
            allowFontScaling={false}
            autoCapitalize="none"
            {...rest}
          />

          {isSecure ? (
            <TouchableOpacity
              onPress={() => setIsVisible((v) => !v)}
              style={styles.rightIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={isVisible ? "Hide password" : "Show password"}
            >
              <Ionicons
                name={isVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          ) : rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : null}
        </View>

        {(error || hint) && (
          <AppText
            variant="caption"
            color={error ? "error" : "tertiary"}
            style={styles.helperText}
          >
            {error ?? hint}
          </AppText>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[1.5],
  },
  label: {
    color: Colors.text.secondary,
  },
  required: {
    marginLeft: 2,
    lineHeight: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    minHeight: 52,
    paddingHorizontal: Spacing[4],
  },
  inputFocused: {
    backgroundColor: Colors.surface,
  },
  inputDisabled: {
    backgroundColor: Colors.surfaceSecondary,
    opacity: 0.7,
  },
  inputError: {
    backgroundColor: Colors.status.errorLight,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    paddingVertical: Spacing[3],
    fontWeight: Typography.weight.regular,
  },
  inputWithLeft: {
    marginLeft: Spacing[2],
  },
  leftIcon: {
    marginRight: Spacing[1],
  },
  rightIcon: {
    marginLeft: Spacing[2],
  },
  helperText: {
    marginTop: Spacing[1.5],
  },
});
