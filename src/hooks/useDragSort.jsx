import { useState, useRef, useCallback, useEffect } from "react";

const storageKey = (dayId, type) => `drag_order_${type}_${dayId}`;

const saveOrder = (dayId, type, ids) => {
  try {
    localStorage.setItem(storageKey(dayId, type), JSON.stringify(ids));
  } catch {}
};

const loadOrder = (dayId, type) => {
  try {
    const raw = localStorage.getItem(storageKey(dayId, type));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const applyOrder = (items, savedIds) => {
  if (!savedIds?.length) return items;
  const map = Object.fromEntries(items.map((i) => [String(i.id), i]));
  const ordered = savedIds.map((id) => map[String(id)]).filter(Boolean);
  const newItems = items.filter((i) => !savedIds.includes(String(i.id)));
  return [...ordered, ...newItems];
};

export function useDragSort(items, dayId, type) {
  const [sorted, setSorted] = useState([]);

  // Live mutable copy — avoids stale closure / async setState issues
  const liveRef = useRef([]);
  const fromRef = useRef(null);

  // Sync when items or dayId change
  useEffect(() => {
    if (!items?.length) {
      liveRef.current = [];
      setSorted([]);
      return;
    }
    const next = applyOrder(items, loadOrder(dayId, type));
    liveRef.current = next;
    setSorted(next);
  }, [items, dayId, type]);

  const onDragStart = useCallback((index) => {
    fromRef.current = index;
  }, []);

  const onDragEnter = useCallback((toIndex) => {
    const from = fromRef.current;
    if (from === null || from === toIndex) return;

    const next = [...liveRef.current];
    const [moved] = next.splice(from, 1);
    next.splice(toIndex, 0, moved);

    liveRef.current = next; // update ref synchronously
    fromRef.current = toIndex; // track new position
    setSorted([...next]); // trigger re-render
  }, []);

  const onDragEnd = useCallback(() => {
    fromRef.current = null;
    const ids = liveRef.current.map((i) => String(i.id));
    saveOrder(dayId, type, ids);
  }, [dayId, type]);

  const patchSorted = useCallback((updated) => {
    liveRef.current = liveRef.current.map((i) =>
      String(i.id) === String(updated.id) ? { ...i, ...updated } : i,
    );
    setSorted([...liveRef.current]);
  }, []);

  const addSorted = useCallback(
    (item) => {
      liveRef.current = [item, ...liveRef.current];
      saveOrder(
        dayId,
        type,
        liveRef.current.map((i) => String(i.id)),
      );
      setSorted([...liveRef.current]);
    },
    [dayId, type],
  );

  const removeSorted = useCallback(
    (itemId) => {
      liveRef.current = liveRef.current.filter(
        (i) => String(i.id) !== String(itemId),
      );
      saveOrder(
        dayId,
        type,
        liveRef.current.map((i) => String(i.id)),
      );
      setSorted([...liveRef.current]);
    },
    [dayId, type],
  );

  return {
    sorted,
    setSorted: (fn) => {
      const next = typeof fn === "function" ? fn(liveRef.current) : fn;
      liveRef.current = next;
      setSorted([...next]);
    },
    patchSorted,
    addSorted,
    removeSorted,
    dragHandlers: { onDragStart, onDragEnter, onDragEnd },
  };
}
