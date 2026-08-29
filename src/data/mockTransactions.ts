/**
 * Mock Transaction Data Generator
 *
 * Generates realistic mock transaction data matching the Comun GraphQL API structure.
 */

import {
  UnifiedTransaction,
  UnifiedTransactionConnection,
  Direction,
  UnifiedTransactionLifecycleStatus,
  UnifiedTransactionStatusPill,
  UnifiedTransactionType,
} from "../types/transaction";

export const generatePendingTransactions = (): UnifiedTransactionConnection => {
  return {
    __typename: "UnifiedTransactionConnection",
    edges: [
      {
        __typename: "UnifiedTransactionEdge",
        node: {
          __typename: "UnifiedTransaction",
          id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDYz",
          title: "Uriel Habie requested",
          amountCents: 10000, // $100.00
          direction: Direction.CREDIT,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.PENDING,
          statusPill: UnifiedTransactionStatusPill.PENDING,
          statusPillInfo: "This request is awaiting your action.",
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
          transactionType: UnifiedTransactionType.PEER_PAYMENT,
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "Uriel Habie",
            userNote: "Coffee money",
            peerPaymentRejectionReason: null,
          },
        },
      },
      {
        __typename: "UnifiedTransactionEdge",
        node: {
          __typename: "UnifiedTransaction",
          id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDYy",
          title: "You requested from Alvaro Simon",
          amountCents: 3364, // $33.64
          direction: Direction.DEBIT,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.PENDING,
          statusPill: UnifiedTransactionStatusPill.PENDING,
          statusPillInfo: "This request is waiting for approval.",
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          transactionType: UnifiedTransactionType.PEER_PAYMENT,
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "Alvaro Simon",
            userNote: "Lunch split",
            peerPaymentRejectionReason: null,
          },
        },
      },
      {
        __typename: "UnifiedTransactionEdge",
        node: {
          __typename: "UnifiedTransaction",
          id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDYx",
          title: "Miguel Perez requested",
          amountCents: 10000, // $100.00
          direction: Direction.CREDIT,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.PENDING,
          statusPill: UnifiedTransactionStatusPill.PENDING,
          statusPillInfo: "This request is awaiting your action.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
          transactionType: UnifiedTransactionType.PEER_PAYMENT,
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "Miguel Perez",
            userNote: "Gas money",
            peerPaymentRejectionReason: null,
          },
        },
      },
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "pending-cursor-end",
      hasNextPage: false,
    },
  };
};

export const generateCompletedTransactions = async (
  page: number = 0,
  pageSize: number = 20
): Promise<UnifiedTransactionConnection> => {
  // Simulate network delay for pages after the first one
  if (page > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const transactions: UnifiedTransaction[] = [];

  // Page 0: Curated transactions matching the design
  if (page === 0) {
    transactions.push(
      // Yesterday - Peer payment outgoing
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQ2",
        title: "Payment to Vicky Lau",
        amountCents: 20350, // $203.50
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        transactionType: UnifiedTransactionType.PEER_PAYMENT,
        details: {
          __typename: "UnifiedTransactionPeerPaymentDetails",
          counterpartyName: "Vicky Lau",
          userNote: "Rent payment",
          peerPaymentRejectionReason: null,
        },
      },
      // Yesterday - Remittance to Mexico
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQ1",
        title: "Remittance to Daniel Gonzalez",
        amountCents: 20299, // $202.99
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 60 * 2
        ).toISOString(),
        transactionType: UnifiedTransactionType.REMITTANCE,
        details: {
          __typename: "UnifiedTransactionPeerPaymentDetails",
          counterpartyName: "Daniel Gonzalez",
          userNote: "Family support",
          peerPaymentRejectionReason: null,
        },
      },
      // Yesterday - Peer payment
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQ0",
        title: "Payment to Dan Murphy",
        amountCents: 20000, // $200.00
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        transactionType: UnifiedTransactionType.PEER_PAYMENT,
        details: {
          __typename: "UnifiedTransactionPeerPaymentDetails",
          counterpartyName: "Dan Murphy",
          userNote: null,
          peerPaymentRejectionReason: null,
        },
      },
      // Yesterday - Check deposit (credit)
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQz",
        title: "Check deposit",
        amountCents: 79387, // $793.87
        direction: Direction.CREDIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 120
        ).toISOString(),
        transactionType: UnifiedTransactionType.CHECK_DEPOSIT,
        details: {
          __typename: "UnifiedTransactionChequeDepositDetails",
          chequeDepositId: "CHK123456",
          canViewChequeImages: true,
        },
      },
      // Yesterday - Card payment
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQy",
        title: "Starbucks",
        amountCents: 682, // $6.82
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 180
        ).toISOString(),
        transactionType: UnifiedTransactionType.CARD,
        details: {
          __typename: "UnifiedTransactionCardDetails",
          cardLastFourDigits: "2192",
          isRecurring: false,
        },
      },
      // January 1 - Failed payment
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQx",
        title: "Payment to Jose Perozo",
        amountCents: 7500, // $75.00
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.ERROR,
        statusPill: UnifiedTransactionStatusPill.FAILED,
        statusPillInfo: "Payment failed - insufficient funds",
        createdAt: new Date(2025, 0, 1, 12, 30).toISOString(),
        transactionType: UnifiedTransactionType.PEER_PAYMENT,
        details: {
          __typename: "UnifiedTransactionPeerPaymentDetails",
          counterpartyName: "Jose Perozo",
          userNote: null,
          peerPaymentRejectionReason: "Insufficient funds",
        },
      },
      // January 1 - Remittance fee
      {
        __typename: "UnifiedTransaction",
        id: "VW5pZmllZFRyYW5zYWN0aW9uOjE4NDQw",
        title: "Remittance charge",
        amountCents: 299, // $2.99
        direction: Direction.DEBIT,
        lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
        statusPill: UnifiedTransactionStatusPill.COMPLETED,
        statusPillInfo: null,
        createdAt: new Date(2025, 0, 1, 9, 15).toISOString(),
        transactionType: UnifiedTransactionType.REMITTANCE_FEE,
      }
    );
  } else {
    // Generate random transactions for subsequent pages
    const merchants = [
      "Amazon",
      "Target",
      "Walmart",
      "CVS",
      "Whole Foods",
      "Shell",
      "Uber",
      "Netflix",
      "Spotify",
      "Apple",
    ];
    const people = [
      "John Smith",
      "Sarah Johnson",
      "Mike Williams",
      "Emma Brown",
      "Chris Davis",
    ];

    for (let i = 0; i < pageSize; i++) {
      const index = page * pageSize + i;
      const daysAgo = Math.floor(index / 5) + 2;
      const isDebit = Math.random() > 0.4; // 60% debits, 40% credits

      if (isDebit) {
        // Card payment
        const merchant = merchants[index % merchants.length];
        transactions.push({
          __typename: "UnifiedTransaction",
          id: `VW5pZmllZFRyYW5zYWN0aW9uOjE4NDM${index}-debit`,
          title: merchant,
          amountCents: Math.floor(Math.random() * 10000 + 500), // $5 - $105
          direction: Direction.DEBIT,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
          statusPill: UnifiedTransactionStatusPill.COMPLETED,
          statusPillInfo: null,
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * daysAgo
          ).toISOString(),
          transactionType: UnifiedTransactionType.CARD,
          details: {
            __typename: "UnifiedTransactionCardDetails",
            cardLastFourDigits: "2192",
            isRecurring: false,
          },
        });
      } else {
        // Peer payment received
        const person = people[index % people.length];
        transactions.push({
          __typename: "UnifiedTransaction",
          id: `VW5pZmllZFRyYW5zYWN0aW9uOjE4NDM${index}-credit`,
          title: `Payment from ${person}`,
          amountCents: Math.floor(Math.random() * 50000 + 2000), // $20 - $520
          direction: Direction.CREDIT,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
          statusPill: UnifiedTransactionStatusPill.COMPLETED,
          statusPillInfo: null,
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * daysAgo
          ).toISOString(),
          transactionType: UnifiedTransactionType.PEER_PAYMENT,
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: person,
            userNote: null,
            peerPaymentRejectionReason: null,
          },
        });
      }
    }
  }

  return {
    __typename: "UnifiedTransactionConnection",
    edges: transactions.map((node) => ({
      __typename: "UnifiedTransactionEdge" as const,
      node,
    })),
    pageInfo: {
      __typename: "PageInfo",
      endCursor: `completed-cursor-page-${page}`,
      hasNextPage: page < 10, // Limit to 10 pages for demo
    },
  };
};
