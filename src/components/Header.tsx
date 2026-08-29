import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/comun-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require("../../assets/images/support-notification.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.inviteButton}>
        <Image
          source={require("../../assets/images/confetti.png")}
          style={styles.confettiIcon}
          resizeMode="contain"
        />
        <Text style={styles.inviteText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: "#E8FCA2",
  },
  leftSection: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(6, 78, 62, 0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 66,
    height: 20,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "flex-end",
    marginRight: 6,
  },
  confettiIcon: {
    width: 16,
    height: 16,
  },
  inviteText: {
    fontSize: 14,
    color: "#0A2E1E",
    fontWeight: "500",
  },
});
