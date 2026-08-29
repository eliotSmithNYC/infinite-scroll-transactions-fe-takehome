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
