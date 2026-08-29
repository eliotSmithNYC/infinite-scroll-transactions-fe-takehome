import {
  Direction,
  UnifiedTransaction,
  UnifiedTransactionLifecycleStatus,
} from "../types/transaction";

export interface TransactionSection {
  key: string;
  /**
   * The header's heading line: "Pending", or "Completed" above the first
   * completed section's date. The design stacks the two rather than nesting
   * completed days under a level of their own.
   */
  groupLabel?: string;
  /** The header's date line: "Today", "Yesterday", "January 1". */
  title?: string;
  data: UnifiedTransaction[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * A stable, sortable key for the *device-local* calendar day of `date`.
 * `createdAt` is UTC, so slicing the ISO string would put an evening
 * transaction on the following day for every timezone behind UTC.
 */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function dayLabel(date: Date, now: Date): string {
  const key = dayKey(date);
  if (key === dayKey(now)) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === dayKey(yesterday)) {
    return "Yesterday";
  }

  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function formatTransactionTime(date: Date): string {
  const hours = date.getHours();
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours12}:${minutes}${hours < 12 ? "am" : "pm"}`;
}

function groupThousands(dollars: number): string {
  const digits = String(dollars);
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += ",";
    }
    grouped += digits[i];
  }
  return grouped;
}

/**
 * Amounts stay integer cents until here; `Intl` is avoided because Hermes
 * ships different ICU data on Android and iOS.
 */
export function formatCents(amountCents: number): string {
  const cents = Math.abs(amountCents);
  const remainder = String(cents % 100).padStart(2, "0");
  return `$${groupThousands(Math.floor(cents / 100))}.${remainder}`;
}

/**
 * Pending rows are unsigned: every pending transaction in this feed is a
 * request awaiting action, so the money has not moved in either direction yet.
 */
export function formatTransactionAmount(
  transaction: UnifiedTransaction
): string {
  const amount = formatCents(transaction.amountCents);
  if (
    transaction.lifecycleStatus === UnifiedTransactionLifecycleStatus.PENDING
  ) {
    return amount;
  }
  return transaction.direction === Direction.CREDIT
    ? `+${amount}`
    : `-${amount}`;
}

/**
 * The counterparty, or null for transactions that have none (a card purchase,
 * a check deposit, a remittance fee). `details` is optional and a discriminated
 * union whose member does not follow from `transactionType` — the REMITTANCE
 * row carries peer-payment details — so it is narrowed by `__typename`.
 *
 * A blank name is treated as absent: initials derived from it would be empty,
 * leaving a badged circle with nothing in it.
 */
export function counterpartyName(
  transaction: UnifiedTransaction
): string | null {
  const details = transaction.details;
  if (
    details?.__typename === "UnifiedTransactionPeerPaymentDetails" ||
    details?.__typename === "UnifiedTransactionBookPaymentDetails"
  ) {
    return details.counterpartyName?.trim() || null;
  }
  return null;
}

export function initials(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return "";
  }
  const first = tokens[0][0];
  const last = tokens[tokens.length - 1][0];
  return (tokens.length === 1 ? first : first + last).toUpperCase();
}

/**
 * Sections are derived from the full accumulated array on every change rather
 * than merged page by page, so a day split across two pages is one section by
 * construction.
 */
export function buildSections(
  pending: UnifiedTransaction[],
  completed: UnifiedTransaction[],
  now: Date
): TransactionSection[] {
  const sections: TransactionSection[] = [];

  if (pending.length > 0) {
    sections.push({
      key: "pending",
      groupLabel: "Pending",
      data: pending,
    });
  }

  const byDay = new Map<string, UnifiedTransaction[]>();
  for (const transaction of completed) {
    const key = dayKey(new Date(transaction.createdAt));
    const day = byDay.get(key);
    if (day) {
      day.push(transaction);
    } else {
      byDay.set(key, [transaction]);
    }
  }

  const days = Array.from(byDay.entries()).sort(([a], [b]) => (a < b ? 1 : -1));

  days.forEach(([key, transactions], index) => {
    transactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    sections.push({
      key,
      title: dayLabel(new Date(transactions[0].createdAt), now),
      groupLabel: index === 0 ? "Completed" : undefined,
      data: transactions,
    });
  });

  return sections;
}
