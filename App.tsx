import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import Header from "./src/components/Header";
import BalanceCard from "./src/components/BalanceCard";
import CurrencyCard from "./src/components/CurrencyCard";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "GeneralSans-Regular": require("./assets/fonts/GeneralSans-Regular.ttf"),
        "GeneralSans-Medium": require("./assets/fonts/GeneralSans-Medium.ttf"),
        "GeneralSans-Semibold": require("./assets/fonts/GeneralSans-Semibold.ttf"),
        "GeneralSans-Bold": require("./assets/fonts/GeneralSans-Bold.ttf"),
        "GeneralSans-Black": require("./assets/fonts/GeneralSans-Black.ttf"),
        "GeneralSans-Light": require("./assets/fonts/GeneralSans-Light.ttf"),
        "GeneralSans-Ultralight": require("./assets/fonts/GeneralSans-Ultralight.ttf"),
        "GeneralSans-UltraBold": require("./assets/fonts/GeneralSans-UltraBold.ttf"),
        "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
        "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
        "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
        "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
        "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
        "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
        "Inter-UltraLight": require("./assets/fonts/Inter-UltraLight.ttf"),
        "Inter-UltraBold": require("./assets/fonts/Inter-UltraBold.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A2E1E" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.topGradientSection}>
          <Header />
          <ScrollView style={styles.scrollView}>
            <View style={styles.topContent}>
              <LinearGradient
                colors={["#E8FCA2", "white"]}
                style={styles.gradientOverlay}
                pointerEvents="none"
              />
              <Text style={styles.greeting}>Good morning, David!</Text>
              <BalanceCard balance={157.18} />
            </View>

            <View style={styles.whiteSection}>
              <CurrencyCard usdToMxn={19.6} />

              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Transactions</Text>
              </View>

              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  Transaction feed coming soon...
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#E8FCA2",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E8FCA2",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  topGradientSection: {
    flex: 1,
    backgroundColor: "#E8FCA2",
    position: "relative",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  topContent: {
    paddingTop: 10,
    backgroundColor: "#E8FCA2",
  },
  whiteSection: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    minHeight: "100%",
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#023128",
    lineHeight: 28,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  transactionsHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 18,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#292929",
    lineHeight: 24,
  },
  placeholder: {
    padding: 40,
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#666",
    textAlign: "center",
  },
});
