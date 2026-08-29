import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import Header from "./src/components/Header";
import BalanceCard from "./src/components/BalanceCard";
import CurrencyCard from "./src/components/CurrencyCard";
import SectionHeader from "./src/components/SectionHeader";
import TransactionRow from "./src/components/TransactionRow";
import useTransactionFeed from "./src/hooks/useTransactionFeed";
import { TransactionSection } from "./src/lib/transactions";
import { UnifiedTransaction } from "./src/types/transaction";

// Deep enough to cover a hard iOS bounce. Android stretches rather than
// exposing the background, so this is inert there.
const OVERSCROLL_FILL_HEIGHT = 600;

function transactionKey(item: UnifiedTransaction) {
  return item.id;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { sections, isLoadingMore, error, now, loadMore, retry } =
    useTransactionFeed();

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

  const listHeader = (
    <View>
      {/* The list's own background is white, for the feed and for the bounce
          past the bottom. This scrolls with the content and so paints the gap
          opened by a bounce past the top, where the header is lime. */}
      <View style={styles.overscrollFill} pointerEvents="none" />

      <View style={styles.topContent}>
        <LinearGradient
          colors={["#E8FCA2", "white"]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />
        <Text style={styles.greeting}>Good morning, David!</Text>
        <BalanceCard balance={157.18} />
      </View>

      <CurrencyCard usdToMxn={19.6} />

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Transactions</Text>
      </View>
    </View>
  );

  // Nothing renders once the last page has landed: the spinner is tied to a
  // fetch being in flight, not to there being more to fetch. Retry goes through
  // the hook's own retry, never loadMore, which declines to fetch while errored.
  const listFooter =
    error !== null ? (
      <View style={styles.footer}>
        <Text style={styles.footerMessage}>We couldn’t load transactions.</Text>
        <TouchableOpacity style={styles.footerAction} onPress={retry}>
          <Text style={styles.footerActionText}>Try again</Text>
        </TouchableOpacity>
      </View>
    ) : isLoadingMore ? (
      <ActivityIndicator style={styles.footer} color="#023128" />
    ) : null;

  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <StatusBar barStyle="dark-content" />
        <Header />
        <SectionList<UnifiedTransaction, TransactionSection>
          style={styles.list}
          contentContainerStyle={styles.listContent}
          sections={sections}
          keyExtractor={transactionKey}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <SectionHeader
                groupLabel={section.groupLabel}
                title={section.title}
              />
            </View>
          )}
          renderItem={({ item, section }) => (
            <View style={styles.row}>
              <TransactionRow
                transaction={item}
                showDate={section.title === undefined}
                now={now}
              />
            </View>
          )}
          stickySectionHeadersEnabled={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
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
  list: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 64,
  },
  overscrollFill: {
    position: "absolute",
    top: -OVERSCROLL_FILL_HEIGHT,
    left: 0,
    right: 0,
    height: OVERSCROLL_FILL_HEIGHT,
    backgroundColor: "#E8FCA2",
  },
  topContent: {
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#E8FCA2",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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
  },
  transactionsTitle: {
    fontSize: 18,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    color: "#292929",
    lineHeight: 26,
  },
  sectionHeader: {
    marginTop: 24,
  },
  row: {
    marginTop: 16,
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  footerMessage: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#616161",
    lineHeight: 20,
    letterSpacing: -0.14,
  },
  footerAction: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerActionText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#2F7BE1",
    lineHeight: 24,
    letterSpacing: -0.16,
  },
});
