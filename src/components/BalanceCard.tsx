import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface BalanceCardProps {
  balance: number;
  onDeposit?: () => void;
  onTransfer?: () => void;
}

export default function BalanceCard({
  balance,
  onDeposit,
  onTransfer,
}: BalanceCardProps) {
  const formatBalance = (amount: number) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Available balance</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsLink}>See details</Text>
          <Image
            source={require("../../assets/images/card-icon.png")}
            style={styles.cardIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.balance}>${formatBalance(balance)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onDeposit}>
          <Image
            source={require("../../assets/images/deposit-icon.png")}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onTransfer}>
          <Image
            source={require("../../assets/images/transfer-icon.png")}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#292929",
    lineHeight: 20,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailsLink: {
    fontSize: 16,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#A3A3A3",
    lineHeight: 20,
  },
  cardIcon: {
    width: 16,
    height: 16,
  },
  balance: {
    fontSize: 48,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#292929",
    lineHeight: 56,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 44,
    backgroundColor: "#0A2E1E",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  buttonIcon: {
    width: 18,
    height: 18,
  },
  buttonIconText: {
    fontSize: 18,
    color: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#FFF",
    lineHeight: 24,
    letterSpacing: -0.16,
  },
});
