import { Colors } from "@/theme";

export type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case "ACCEPTED":
      return {
        label: "Accepted",
        icon: "checkmark-circle" as const,
        color: Colors.status.success,
        background: Colors.status.successLight,
        border: Colors.status.success,
      };

    case "REJECTED":
      return {
        label: "Declined",
        icon: "close-circle" as const,
        color: Colors.status.error,
        background: Colors.status.errorLight,
        border: Colors.status.errorBorder,
      };

    default:
      return {
        label: "Awaiting response",
        icon: "time-outline" as const,
        color: Colors.accent,
        background: Colors.accentLight,
        border: Colors.accent,
      };
  }
};
