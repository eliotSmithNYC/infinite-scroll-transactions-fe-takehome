import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateCompletedTransactions,
  generatePendingTransactions,
} from "../data/mockTransactions";
import { buildSections, TransactionSection } from "../lib/transactions";
import { UnifiedTransaction } from "../types/transaction";

const PAGE_SIZE = 20;

interface TransactionFeed {
  sections: TransactionSection[];
  isLoadingMore: boolean;
  error: Error | null;
  /** The instant every date label on the screen is measured against. */
  now: Date;
  /** Safe to call from onEndReached, however often it fires. */
  loadMore: () => void;
  retry: () => void;
}

export default function useTransactionFeed(): TransactionFeed {
  // State holds what the list renders; refs hold what pagination reads and
  // writes synchronously.
  const [completed, setCompleted] = useState<UnifiedTransaction[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pending] = useState(() =>
    generatePendingTransactions().edges.map((edge) => edge.node)
  );
  const [now] = useState(() => new Date());
  // Mounting the loading footer changes the list's content length, and a
  // changed content length is all VirtualizedList needs to fire onEndReached
  // again — so it re-fires inside every fetch, not in some rare edge case, and
  // isLoadingMore read from that closure is a render behind. This ref flips
  // synchronously before the await, so the second call sees the first.
  const inFlight = useRef(false);
  // What to request next, and whether there is anything left to request. Refs
  // for the same reason: both have to be current before onEndReached can fire
  // again, which is well before React commits a render.
  const nextPage = useRef(0);
  const hasNextPage = useRef(true);

  const loadPage = useCallback(async () => {
    if (inFlight.current || !hasNextPage.current) {
      return;
    }
    inFlight.current = true;
    setIsLoadingMore(true);

    try {
      const { edges, pageInfo } = await generateCompletedTransactions(
        nextPage.current,
        PAGE_SIZE
      );
      // Both advance only on success, so a retry re-requests the page that
      // failed, and both land before inFlight clears.
      nextPage.current += 1;
      hasNextPage.current = pageInfo.hasNextPage;
      setCompleted((current) => current.concat(edges.map((edge) => edge.node)));
    } catch (caught) {
      // nextPage is untouched here. Refetching a page that did land would not
      // be caught by de-duplicating on id: the generator invents new ids and
      // amounts on every call.
      setError(caught instanceof Error ? caught : new Error(String(caught)));
    } finally {
      inFlight.current = false;
      setIsLoadingMore(false);
    }
  }, []);

  // The error check lives here rather than in loadPage: if the core guard read
  // `error`, retry would clear the state and then call a closure still seeing
  // the stale non-null value, and would silently do nothing.
  const loadMore = useCallback(() => {
    if (error === null) {
      loadPage();
    }
  }, [error, loadPage]);

  const retry = useCallback(() => {
    setError(null);
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    // Page 0 is requested explicitly. It returns seven rows regardless of the
    // page size, which need not fill the viewport, so waiting for
    // onEndReached to fire would risk a feed that never starts.
    loadPage();
  }, [loadPage]);

  const sections = useMemo(
    () => buildSections(pending, completed, now),
    [pending, completed, now]
  );

  return { sections, isLoadingMore, error, now, loadMore, retry };
}
