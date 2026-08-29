import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface CurrencyCardProps {
  usdToMxn: number;
  onSendRemittance?: () => void;
}

export default function CurrencyCard({
  usdToMxn,
  onSendRemittance,
}: CurrencyCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.exchangeRate}>
            1 USD = {usdToMxn.toFixed(2)} MXN
          </Text>
          <TouchableOpacity onPress={onSendRemittance}>
            <Text style={styles.link}>Send a remittance →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.flagButton}>
          <Image
            source={require("../../assets/images/country-selector.png")}
            style={styles.countrySelectorIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "rgba(24, 39, 75, 0.10)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  exchangeRate: {
    fontSize: 20,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#292929",
    lineHeight: 28,
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#2F7BE1",
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  flagButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  countrySelectorIcon: {
    width: 56,
    height: 36,
  },
});
