import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import {
  Direction,
  UnifiedTransaction,
  UnifiedTransactionLifecycleStatus,
  UnifiedTransactionStatusPill,
  UnifiedTransactionType,
} from "../types/transaction";
import {
  counterpartyName,
  dayKey,
  dayLabel,
  formatTransactionAmount,
  formatTransactionTime,
  initials,
} from "../lib/transactions";

interface TransactionRowProps {
  transaction: UnifiedTransaction;
  /** True in sections whose header is not a date, so the row shows its own. */
  showDate: boolean;
  now: Date;
}

// The design binds the same cheques glyph to card purchases as to check
// deposits, so only the remittance fee needs its own icon.
function typeIcon(
  transactionType: UnifiedTransactionType
): ImageSourcePropType {
  return transactionType === UnifiedTransactionType.REMITTANCE_FEE
    ? require("../../assets/images/world-icon.png")
    : require("../../assets/images/cheques-icon.png");
}

function badgeIcon(
  transactionType: UnifiedTransactionType
): ImageSourcePropType {
  return transactionType === UnifiedTransactionType.REMITTANCE
    ? require("../../assets/images/flag-badge.png")
    : require("../../assets/images/tilde-badge.png");
}

function amountStyle(transaction: UnifiedTransaction) {
  switch (transaction.lifecycleStatus) {
    case UnifiedTransactionLifecycleStatus.PENDING:
      return styles.amountPending;
    case UnifiedTransactionLifecycleStatus.ERROR:
      return styles.amountFailed;
    case UnifiedTransactionLifecycleStatus.COMPLETED:
      return transaction.direction === Direction.CREDIT
        ? styles.amountCredit
        : styles.amountDebit;
  }
}

function TransactionRow({ transaction, showDate, now }: TransactionRowProps) {
  const createdAt = new Date(transaction.createdAt);
  const time = formatTransactionTime(createdAt);
  const isToday = dayKey(createdAt) === dayKey(now);
  // Today's rows never read "Today • 1:15pm" — the day is only worth spelling
  // out when there is no date header above the row and it is not today.
  const subtitle =
    showDate && !isToday ? `${dayLabel(createdAt, now)} • ${time}` : time;

  const counterparty = counterpartyName(transaction);
  const isCompleted =
    transaction.lifecycleStatus ===
    UnifiedTransactionLifecycleStatus.COMPLETED;
  const isPending =
    transaction.lifecycleStatus === UnifiedTransactionLifecycleStatus.PENDING;

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View
          style={[
            styles.avatar,
            counterparty !== null && !isCompleted
              ? styles.avatarGray
              : styles.avatarBlue,
          ]}
        >
          {counterparty !== null ? (
            <>
              <Text
                style={[
                  styles.initials,
                  isCompleted ? styles.initialsBlue : styles.initialsGray,
                ]}
              >
                {initials(counterparty)}
              </Text>
              <Image
                source={badgeIcon(transaction.transactionType)}
                style={styles.badge}
                resizeMode="contain"
              />
            </>
          ) : (
            <Image
              source={typeIcon(transaction.transactionType)}
              style={styles.icon}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {transaction.title}
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
            {/* statusPill carries the user-facing label; lifecycleStatus
                drives the styling. */}
            {transaction.statusPill === UnifiedTransactionStatusPill.FAILED && (
              <>
                {" • "}
                <Text style={styles.failureReason}>Payment failed</Text>
              </>
            )}
          </Text>
        </View>

        <Text style={[styles.amount, amountStyle(transaction)]}>
          {formatTransactionAmount(transaction)}
        </Text>
      </View>

      {/* Every pending transaction in this feed is a request awaiting action,
          and the direction says whose: a request made of you is completed or
          rejected, one you made can only be cancelled. */}
      {isPending && (
        <View style={styles.actions}>
          {transaction.direction === Direction.CREDIT ? (
            <>
              <TouchableOpacity style={[styles.action, styles.actionNeutral]}>
                <Text style={[styles.actionText, styles.actionNeutralText]}>
                  Complete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.action, styles.actionDanger]}>
                <Text style={[styles.actionText, styles.actionDangerText]}>
                  Reject
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.action, styles.actionDanger]}>
              <Text style={[styles.actionText, styles.actionDangerText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBlue: {
    backgroundColor: "#EBF6FF",
  },
  avatarGray: {
    backgroundColor: "#F5F5F5",
  },
  initials: {
    fontSize: 18,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    lineHeight: 26,
  },
  initialsBlue: {
    color: "#4598ED",
  },
  initialsGray: {
    color: "#808080",
  },
  badge: {
    position: "absolute",
    left: 34,
    top: 34,
    width: 16,
    height: 16,
  },
  icon: {
    width: 32,
    height: 32,
  },
  details: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#292929",
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    color: "#A3A3A3",
    lineHeight: 20,
    letterSpacing: -0.14,
    marginTop: 4,
  },
  failureReason: {
    color: "#DB331B",
  },
  amount: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.16,
  },
  amountCredit: {
    color: "#049770",
  },
  amountDebit: {
    color: "#616161",
  },
  amountPending: {
    color: "#A3A3A3",
  },
  amountFailed: {
    color: "#A3A3A3",
    textDecorationLine: "line-through",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginLeft: 64,
  },
  action: {
    padding: 8,
    borderRadius: 8,
  },
  actionNeutral: {
    backgroundColor: "#F5F5F5",
  },
  actionDanger: {
    backgroundColor: "#FAE3D6",
  },
  actionText: {
    fontSize: 16,
    fontFamily: "GeneralSans-Medium",
    fontWeight: "500",
    lineHeight: 24,
  },
  actionNeutralText: {
    color: "#292929",
  },
  actionDangerText: {
    color: "#DB331B",
  },
});

export default React.memo(TransactionRow);
