# Agent instructions

Expo / React Native app showing an account balance and a transaction feed. The feed is
built in `App.tsx` and `src/`.

`README.md` is the specification. The linked Figma file is the visual reference for the
screen it describes — use it for exact dimensions, colours, and states, not as a source
of additional requirements.

## Commands

```bash
yarn type-check   # tsc --noEmit
yarn lint         # eslint . --ext .ts,.tsx
yarn test         # jest (once test infrastructure is added)
```

Run type-check and lint before considering a change done; both pass silently on a clean
tree. These are the whole local verification surface — don't run anything broader. The
tsconfig is strict and includes `noUnusedLocals` and `noUnusedParameters`.

## Scope

Implement the transaction feed. Don't add navigation, detail screens, state-management
libraries, theming layers, or features beyond what `README.md` asks for.

## Structure

The screen is **one virtualized list**. A virtualized list must never be nested inside a
same-orientation `ScrollView` — windowing breaks and every row renders at once. The
greeting, `BalanceCard`, `CurrencyCard`, and the "Transactions" heading belong in
`ListHeaderComponent`.

Derive grouped sections from a single accumulated array rather than maintaining a
separate grouped structure alongside it. The dataset is small (~207 rows) and deriving
keeps one source of truth.

## Mock data invariants

From `src/data/mockTransactions.ts`. These cause real bugs if missed:

- **Page 0 returns 7 items, not 20**; `pageSize` is honoured only for `page > 0`. Drive
  pagination off `pageInfo.hasNextPage`, never `edges.length === pageSize`.
- **Pages > 0 are generated with `Math.random()`**, so refetching a page returns
  different transactions with different ids — de-duplicating by id won't catch a double
  fetch. Never refetch a page already held; advance the page only after a success.
- `hasNextPage` is `page < 10`: 11 pages, ~207 transactions. The loading indicator must
  stop at the end.
- Page 0 may not fill the viewport, so `onEndReached` can fire immediately on mount.
- The fixture includes a transaction with `lifecycleStatus: ERROR` / `statusPill: FAILED`,
  and `statusPillInfo` is populated across the data.
- Some transactions have no counterparty (`Check deposit`, `Remittance charge`) and some
  are merchants (`Starbucks`), so avatars need a fallback path.
- `details` is optional and a discriminated union: `Remittance charge` has no `details`
  key at all, and the REMITTANCE row's details carry the PeerPayment `__typename` — so
  narrow by `__typename`, not by `transactionType`.

## Dates

`createdAt` is a UTC ISO string. **Group by local calendar day** — build the key from
`getFullYear`/`getMonth`/`getDate`, never `createdAt.split("T")[0]`. UTC-keyed grouping
agrees with local time during the day and silently diverges in the evening.

Pure date functions should take `now` as an explicit parameter, so they're testable
without mocking the clock.

## Pagination

`onEndReached` can fire several times within one tick during a fast scroll, and loading
state read from that closure is stale. Guard with a **ref set synchronously before the
await**, and bail when `hasNextPage` is false.

## Money

Amounts are integer cents (`amountCents`). Keep them integer end to end and divide only
at the formatting boundary. Prefer a small pure `formatCents` helper over inline
`toLocaleString` — testable without a renderer, and avoids `Intl` differences between
Hermes on Android and iOS.

## Conventions

New files should be indistinguishable from those in `src/components/`. Formatting is
Prettier 3 defaults: double quotes, semicolons, 2-space indent, trailing commas, ~80
columns.

Components follow one shape — `import React from "react"` explicitly (even though
`react/react-in-jsx-scope` is off), an `interface XProps` above, a default-exported named
function with props destructured in the signature, and `StyleSheet.create` at the bottom
ordered outer to inner. One component per file.

- `TouchableOpacity` throughout, not `Pressable`.
- Images: `require("../../assets/images/x.png")` with `resizeMode="contain"` and explicit
  `width`/`height`.
- Text styles set `fontFamily` **and** a matching `fontWeight`. (`Header.tsx`'s
  `inviteText` omits `fontFamily`; don't copy that.)

## Design tokens

Text `#292929` primary, `#616161` secondary (completed debit amounts), `#a3a3a3` tertiary
(subtitles, date headers, pending and failed amounts), `#049770` success (credit
amounts), `#db331b` error. Avatars: initials on `#f5f5f5` with `#808080` text for
pending/failed rows, on `#ebf6ff` with `#4598ed` text for completed rows; type icons sit
on `#ebf6ff`. Brand `#e8fca2` lime, `#023128` green; `#2f7be1` links, `#e0e0e0` borders.

Spacing scale `4, 8, 16, 24, 64`; page gutter and card radius both `16`. Rows are `52`
tall with `16` between them; avatars `48` square, fully rounded.

Headings are General Sans Medium (16/24, 18/26, 20/28, 48/56); body is Inter Regular
16/24 and 14/20. Figma reports `letterSpacing` as a **percentage** — `-1` means −1%, so
convert against the font size: `-0.16` at 16px, `-0.14` at 14px.

## Feed display rules

Amounts: credits signed `+` in the success colour; completed debits signed `-` in
secondary; pending amounts unsigned in tertiary; failed amounts tertiary and struck
through, with a short "Payment failed" appended to the subtitle in the error colour.

The subtitle shows the bare time for today's rows and for rows under a date header;
anywhere else it is `<Day> • <time>` (`Yesterday • 11:34am`) — never `Today • …`.

Initials come from `counterpartyName` only. Rows without one (`Starbucks`,
`Check deposit`, `Remittance charge`) get a type icon on the blue fill, never initials
derived from the title. Initials avatars carry a `16` badge — the Mexico flag on
REMITTANCE, the Común tilde otherwise; icon avatars carry none.

## Android

- `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` are iOS-only. Pair them
  with `elevation`, as `CurrencyCard.tsx` does.
- Set `stickySectionHeadersEnabled` explicitly; the default differs by platform.
- Leave font scaling enabled — don't cap it with `maxFontSizeMultiplier`; row heights
  should accommodate scaled text.
- Titles need `numberOfLines={1}` and `ellipsizeMode="tail"` so long names truncate
  without pushing the amount off-screen.

## Code quality

- No `any`, no `@ts-ignore`, no non-null `!` used to silence the compiler.
- No catch-all `utils`/`helpers` module — name modules for what they do.
- Comments explain *why*, not what the code already says.
- No dead code: unused props, unused exports, components nothing renders.
- No premature generality — no config object with one caller, no generic where a concrete
  type reads better.
- No new runtime dependency without a clear reason; `FlatList`/`SectionList` are
  sufficient for a list this size.
- Prefer boring, explicable constructions over clever ones.
