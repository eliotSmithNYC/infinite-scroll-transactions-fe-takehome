/**
 * Transaction Types
 */

export enum Direction {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum UnifiedTransactionLifecycleStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export enum UnifiedTransactionStatusPill {
  PENDING = "PENDING",
  CLEARING = "CLEARING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  REJECTED = "REJECTED",
  RETURNED = "RETURNED",
  RETURN = "RETURN",
}

export enum UnifiedTransactionType {
  ATM = "ATM",
  BOOK_PAYMENT = "BOOK_PAYMENT",
  CARD = "CARD",
  CASH_DEPOSIT = "CASH_DEPOSIT",
  CHECK_DEPOSIT = "CHECK_DEPOSIT",
  DEBIT_CARD_TRANSFER = "DEBIT_CARD_TRANSFER",
  DISPUTE = "DISPUTE",
  OTHER = "OTHER",
  PAYMENT = "PAYMENT",
  PEER_PAYMENT = "PEER_PAYMENT",
  REMITTANCE = "REMITTANCE",
  REMITTANCE_FEE = "REMITTANCE_FEE",
  WIRE_PAYMENT = "WIRE_PAYMENT",
}

// Transaction Detail Types (union of possible detail structures)

export interface UnifiedTransactionCardDetails {
  __typename: "UnifiedTransactionCardDetails";
  cardLastFourDigits?: string | null;
  isRecurring?: boolean | null;
}

export interface UnifiedTransactionPaymentDetails {
  __typename: "UnifiedTransactionPaymentDetails";
  accountName?: string | null;
  counterpartyAccountLastFourDigits?: string | null;
  counterpartyInstitutionName?: string | null;
  isDirectDeposit?: boolean;
}

export interface UnifiedTransactionPeerPaymentDetails {
  __typename: "UnifiedTransactionPeerPaymentDetails";
  counterpartyName?: string | null;
  peerPaymentRejectionReason?: string | null;
  userNote?: string | null;
}

export interface UnifiedTransactionBookPaymentDetails {
  __typename: "UnifiedTransactionBookPaymentDetails";
  counterpartyAccountLastFourDigits?: string | null;
  counterpartyName?: string | null;
  counterpartyUsername?: string | null;
  bookPaymentRejectionReason?: string | null;
  userNote?: string | null;
}

export interface UnifiedTransactionChequeDepositDetails {
  __typename: "UnifiedTransactionChequeDepositDetails";
  chequeDepositId?: string | null;
  canViewChequeImages?: boolean;
}

export type TransactionDetails =
  | UnifiedTransactionCardDetails
  | UnifiedTransactionPaymentDetails
  | UnifiedTransactionPeerPaymentDetails
  | UnifiedTransactionBookPaymentDetails
  | UnifiedTransactionChequeDepositDetails;

// Main Transaction Type
export interface UnifiedTransaction {
  __typename: "UnifiedTransaction";
  id: string;
  title: string;
  amountCents: number;
  direction: Direction;
  lifecycleStatus: UnifiedTransactionLifecycleStatus;
  statusPill: UnifiedTransactionStatusPill;
  statusPillInfo?: string | null;
  createdAt: string; // ISO timestamp
  transactionType: UnifiedTransactionType;
  details?: TransactionDetails;
}

// Pagination Types
export interface UnifiedTransactionEdge {
  __typename?: "UnifiedTransactionEdge";
  node: UnifiedTransaction;
}

export interface PageInfo {
  __typename?: "PageInfo";
  endCursor: string;
  hasNextPage: boolean;
}

export interface UnifiedTransactionConnection {
  __typename?: "UnifiedTransactionConnection";
  edges: UnifiedTransactionEdge[];
  pageInfo: PageInfo;
}
