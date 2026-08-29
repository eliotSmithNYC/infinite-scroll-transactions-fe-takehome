# React Native Take-Home Project: Infinite Scrolling Transaction Feed

## Your Task

Build an infinite scroll transaction feed. Implement the transaction list with infinite scrolling. View the [Figma design here](https://www.figma.com/design/z3PZCzJObF4lJoGeTSfP8F/FE-Transactions-Take-Home?node-id=0-1&t=ApGFdr5BqEeCvNOr-1).

**Time Estimate**: 2-3 hours

## What You Need to Build

Replace the placeholder in `App.tsx` with a transaction feed that shows:

1. **Pending transactions** at the top
2. **Completed transactions** below, grouped by date
3. **Infinite scroll** - load more as user scrolls down

## Getting Started

```bash
yarn install
yarn start
```

## Mock Data API

```typescript
// Import from: src/data/mockTransactions.ts

// Get pending transactions
generatePendingTransactions(): UnifiedTransactionConnection

// Get completed transactions (async, paginated)
generateCompletedTransactions(page: number, pageSize: number): Promise<UnifiedTransactionConnection>
```

## Key Data Structure

```typescript
{
  id: string;
  title: string;                    // "Payment from Miguel Perez"
  amountCents: number;              // 10000 = $100.00
  direction: "CREDIT" | "DEBIT";    // Money in or out
  lifecycleStatus: "PENDING" | "COMPLETED" | "ERROR";
  createdAt: string;                // ISO timestamp
  transactionType: "PEER_PAYMENT" | "CARD" | "CHECK_DEPOSIT" | ...
  details: { ... }                  // Type-specific details
}
```

## Requirements

### Display Format

- Show initials/icon on left
- Transaction title and formatted time
- Amount on right (green for CREDIT, gray for DEBIT)

### Infinite Scroll

- Load 20 transactions per page
- Show loading indicator while fetching

<img src='https://github.com/user-attachments/assets/4ca0a22b-5c0c-402d-b232-e77f7dfc3e27' width=400 />

## Implementation notes

- **The screen is one `SectionList`.** The greeting, balance, currency card and
  "Transactions" heading are its `ListHeaderComponent`; the scaffold's
  `ScrollView` was removed rather than wrapped around the list, because a
  virtualized list nested in a same-orientation `ScrollView` loses windowing and
  renders every row at once. `SectionList` rather than FlashList: ~207 rows over
  11 pages does not justify another native dependency.
- **Sections are derived from one flat array, not merged page by page.**
  Completed transactions accumulate as a single list and are regrouped whenever
  it changes. A transaction's section is a function of its own timestamp, so a
  day split across two fetched pages is one section by construction — there is
  no page-boundary merge step left to get wrong.
- **Grouping is by local calendar day.** `createdAt` is UTC, so day keys are
  built from `getFullYear`/`getMonth`/`getDate` rather than sliced out of the
  ISO string, which would file an evening transaction under the next day for
  every timezone behind UTC. The date functions take `now` as a parameter, so
  the tests assert against it without mocking the clock.
- **Pagination is guarded by refs, not by state.** `VirtualizedList` fires
  `onEndReached` again whenever the list's content length changes — including
  when the loading footer itself mounts — so it re-fires inside every fetch, and
  a loading flag read from that closure is a render behind. The in-flight flag
  is a ref flipped synchronously before the await; the page number and
  `hasNextPage` are refs written after a successful response and before that
  flag clears, which is the only ordering under which a retry re-requests the
  page that failed. Pages past the first are generated with `Math.random()`, so
  a refetch returns different ids and de-duplicating would not catch a double
  fetch.
- **Amounts stay integer cents** until a small `formatCents` at the display
  boundary, which also avoids `Intl` — Hermes ships different ICU data on
  Android and iOS.
