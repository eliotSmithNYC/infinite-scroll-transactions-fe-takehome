import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SectionHeaderProps {
  /** Heading line: "Pending", or "Completed" above the first date. */
  groupLabel?: string;
  /** Date line: "Today", "Yesterday", "January 1". */
  title?: string;
}

export default function SectionHeader({
  groupLabel,
  title,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {groupLabel !== undefined && (
        <Text style={styles.groupLabel}>{groupLabel}</Text>
      )}
      {title !== undefined && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  groupLabel: {
    fontSize: 16,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#616161",
    lineHeight: 24,
  },
  title: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#A3A3A3",
    lineHeight: 20,
    letterSpacing: -0.14,
  },
});
