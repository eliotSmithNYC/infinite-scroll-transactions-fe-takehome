# Transaction Feed

Infinite-scrolling React Native transaction feed built from the provided Figma
design and mock transaction API.

## Demo

_paste iOS video here_

_paste Android video here_

The error state shown in the recordings was produced by temporarily injecting a
one-shot failure into the mock, which never rejects on its own. That edit is not
in this repo.

## Running

```bash
yarn install
yarn start
```

## Verification

```bash
yarn test
yarn type-check
yarn lint
```

## Implementation

- Uses a single `SectionList` for the screen and transaction feed.
- Completed transactions are accumulated and grouped by local calendar date.
- Pagination uses the provided `pageInfo.hasNextPage` and guards against
  duplicate in-flight requests.
- Includes loading, error, and retry states.
- Includes focused unit tests for transaction grouping and display logic.

## Notes

I kept the implementation intentionally scoped to the requested transaction feed
and followed the existing project conventions where possible.

## Time spent

~3 hours.
