import {
  buildSections,
  counterpartyName,
  dayLabel,
  formatCents,
  formatTransactionAmount,
  formatTransactionTime,
  initials,
} from "./transactions";
import {
  Direction,
  UnifiedTransaction,
  UnifiedTransactionLifecycleStatus,
  UnifiedTransactionStatusPill,
  UnifiedTransactionType,
} from "../types/transaction";

// The `test` script pins TZ=America/New_York. The code under test means the
// *device's* calendar day; New York is simply a zone far enough behind UTC that
// a late-evening transaction lands on the previous local day, which is the case
// an ISO-string-slicing implementation gets wrong.
const transaction = (
  id: string,
  createdAt: string,
  overrides: Partial<UnifiedTransaction> = {}
): UnifiedTransaction => ({
  __typename: "UnifiedTransaction",
  id,
  title: "Payment to Dan Murphy",
  amountCents: 20000,
  direction: Direction.DEBIT,
  lifecycleStatus: UnifiedTransactionLifecycleStatus.COMPLETED,
  statusPill: UnifiedTransactionStatusPill.COMPLETED,
  statusPillInfo: null,
  createdAt,
  transactionType: UnifiedTransactionType.PEER_PAYMENT,
  ...overrides,
});

describe("buildSections", () => {
  it("groups by the local calendar day, not the UTC day", () => {
    // 01:30 UTC on Aug 29 is 21:30 EDT on Aug 28.
    const sections = buildSections(
      [],
      [transaction("a", "2026-08-29T01:30:00.000Z")],
      new Date(2026, 7, 29, 12)
    );

    expect(sections.map((section) => section.key)).toEqual(["2026-08-28"]);
  });

  it("puts one local day fetched across two pages into a single section", () => {
    const pageOne = [transaction("a", "2026-08-27T18:00:00.000Z")];
    const pageTwo = [transaction("b", "2026-08-28T02:00:00.000Z")];

    const sections = buildSections(
      [],
      [...pageOne, ...pageTwo],
      new Date(2026, 7, 29, 12)
    );

    expect(sections.map((section) => section.key)).toEqual(["2026-08-27"]);
    expect(sections[0].data.map((item) => item.id)).toEqual(["b", "a"]);
  });

  it("orders sections newest first and rows newest first within a section", () => {
    const sections = buildSections(
      [],
      [
        transaction("older-day", "2026-08-20T15:00:00.000Z"),
        transaction("earlier", "2026-08-28T14:00:00.000Z"),
        transaction("later", "2026-08-28T19:00:00.000Z"),
      ],
      new Date(2026, 7, 29, 12)
    );

    expect(sections.map((section) => section.key)).toEqual([
      "2026-08-28",
      "2026-08-20",
    ]);
    expect(sections[0].data.map((item) => item.id)).toEqual([
      "later",
      "earlier",
    ]);
  });

  it("labels only the first completed section as the Completed group", () => {
    const pending = [
      transaction("p", "2026-08-29T15:00:00.000Z", {
        lifecycleStatus: UnifiedTransactionLifecycleStatus.PENDING,
      }),
    ];
    const sections = buildSections(
      pending,
      [
        transaction("a", "2026-08-28T14:00:00.000Z"),
        transaction("b", "2026-08-20T14:00:00.000Z"),
      ],
      new Date(2026, 7, 29, 12)
    );

    expect(
      sections.map((section) => [section.groupLabel, section.title])
    ).toEqual([
      ["Pending", undefined],
      ["Completed", "Yesterday"],
      [undefined, "August 20"],
    ]);
  });

  it("omits the pending section when there is nothing pending", () => {
    const sections = buildSections(
      [],
      [transaction("a", "2026-08-28T14:00:00.000Z")],
      new Date(2026, 7, 29, 12)
    );

    expect(sections.map((section) => section.key)).toEqual(["2026-08-28"]);
  });
});

describe("dayLabel", () => {
  const now = new Date(2026, 7, 29, 12);

  it("labels the current local day Today", () => {
    expect(dayLabel(new Date(2026, 7, 29, 1), now)).toBe("Today");
  });

  it("labels the previous local day Yesterday", () => {
    expect(dayLabel(new Date(2026, 7, 28, 23), now)).toBe("Yesterday");
  });

  it("labels anything older by month and day", () => {
    expect(dayLabel(new Date(2025, 0, 1, 12, 30), now)).toBe("January 1");
  });

  // Spring forward, just after midnight: the local day is 23 hours long, so
  // subtracting a fixed 24 hours from 00:30 lands two calendar days back
  // rather than one. Only this shape catches that; the autumn fall-back case
  // does not, since a 25-hour day still leaves you on the right day.
  it("looks back one calendar day across a spring-forward boundary", () => {
    expect(
      dayLabel(new Date(2026, 2, 8, 12), new Date(2026, 2, 9, 0, 30))
    ).toBe("Yesterday");
  });

  it("crosses a month boundary when looking back a day", () => {
    expect(dayLabel(new Date(2026, 6, 31, 9), new Date(2026, 7, 1, 9))).toBe(
      "Yesterday"
    );
  });
});

describe("formatTransactionTime", () => {
  it("formats midday and midnight as 12", () => {
    expect(formatTransactionTime(new Date(2026, 7, 29, 12, 30))).toBe("12:30pm");
    expect(formatTransactionTime(new Date(2026, 7, 29, 0, 5))).toBe("12:05am");
  });

  it("pads minutes and lowercases the meridiem", () => {
    expect(formatTransactionTime(new Date(2026, 7, 29, 13, 5))).toBe("1:05pm");
    expect(formatTransactionTime(new Date(2026, 7, 29, 8, 10))).toBe("8:10am");
  });
});

describe("formatCents", () => {
  it("formats sub-dollar, whole and fractional amounts", () => {
    expect(formatCents(50)).toBe("$0.50");
    expect(formatCents(5)).toBe("$0.05");
    expect(formatCents(682)).toBe("$6.82");
    expect(formatCents(0)).toBe("$0.00");
  });

  it("separates thousands", () => {
    expect(formatCents(157718)).toBe("$1,577.18");
    expect(formatCents(123456789)).toBe("$1,234,567.89");
  });
});

describe("formatTransactionAmount", () => {
  it("signs a completed credit positive", () => {
    expect(
      formatTransactionAmount(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          amountCents: 79387,
          direction: Direction.CREDIT,
        })
      )
    ).toBe("+$793.87");
  });

  it("signs a completed debit negative", () => {
    expect(
      formatTransactionAmount(
        transaction("a", "2026-08-28T14:00:00.000Z", { amountCents: 682 })
      )
    ).toBe("-$6.82");
  });

  it("signs a failed debit negative", () => {
    expect(
      formatTransactionAmount(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          amountCents: 7500,
          lifecycleStatus: UnifiedTransactionLifecycleStatus.ERROR,
          statusPill: UnifiedTransactionStatusPill.FAILED,
        })
      )
    ).toBe("-$75.00");
  });

  it("leaves a pending amount unsigned in either direction", () => {
    const pending = {
      lifecycleStatus: UnifiedTransactionLifecycleStatus.PENDING,
      statusPill: UnifiedTransactionStatusPill.PENDING,
      amountCents: 10000,
    };

    expect(
      formatTransactionAmount(
        transaction("a", "2026-08-29T14:00:00.000Z", {
          ...pending,
          direction: Direction.CREDIT,
        })
      )
    ).toBe("$100.00");
    expect(
      formatTransactionAmount(
        transaction("b", "2026-08-29T14:00:00.000Z", {
          ...pending,
          direction: Direction.DEBIT,
        })
      )
    ).toBe("$100.00");
  });
});

describe("counterpartyName", () => {
  it("reads peer-payment details regardless of the transaction type", () => {
    expect(
      counterpartyName(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          transactionType: UnifiedTransactionType.REMITTANCE,
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "Daniel Gonzalez",
          },
        })
      )
    ).toBe("Daniel Gonzalez");
  });

  it("treats an empty counterparty as none, so the row falls back to an icon", () => {
    expect(
      counterpartyName(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "",
          },
        })
      )
    ).toBeNull();
  });

  it("treats a whitespace-only counterparty as none", () => {
    expect(
      counterpartyName(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          details: {
            __typename: "UnifiedTransactionPeerPaymentDetails",
            counterpartyName: "   ",
          },
        })
      )
    ).toBeNull();
  });

  it("returns null for details that carry no counterparty", () => {
    expect(
      counterpartyName(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          title: "Starbucks",
          transactionType: UnifiedTransactionType.CARD,
          details: {
            __typename: "UnifiedTransactionCardDetails",
            cardLastFourDigits: "2192",
          },
        })
      )
    ).toBeNull();
  });

  it("returns null when the transaction has no details at all", () => {
    expect(
      counterpartyName(
        transaction("a", "2026-08-28T14:00:00.000Z", {
          title: "Remittance charge",
          transactionType: UnifiedTransactionType.REMITTANCE_FEE,
        })
      )
    ).toBeNull();
  });
});

describe("initials", () => {
  it("takes the first and last name", () => {
    expect(initials("Dan Murphy")).toBe("DM");
  });

  it("skips middle names", () => {
    expect(initials("María Elena Rodríguez")).toBe("MR");
  });

  it("doubles nothing for a single name", () => {
    expect(initials("Starbucks")).toBe("S");
  });

  it("preserves accents", () => {
    expect(initials("Álvaro Simón")).toBe("ÁS");
  });

  it("returns nothing for a blank name", () => {
    expect(initials("")).toBe("");
    expect(initials("   ")).toBe("");
  });
});
