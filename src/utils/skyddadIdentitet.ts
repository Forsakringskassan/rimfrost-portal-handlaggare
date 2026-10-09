import type { OperativUppgiftItem } from "../types";

// TEMPORARY MOCK (FKPOC-1113): Portal BFF doesn't yet say whether an uppgift is
// SID-märkt, and OUL leaves `individer` empty, so the portal has nothing to derive
// it from. Until the BFF sends `skyddadIdentitet`, a dev build treats the
// handläggning-ids listed in this localStorage key as SID-märkta (seeded by
// rimfrost-kubernetes/populate_sid_uppgift_1113.sh). Never active in a production
// build. Remove once the backend supplies the field.
export const MOCK_SID_STORAGE_KEY = "mockSidHandlaggningIds";

function mockSidHandlaggningIds(): string[] {
  if (!import.meta.env.DEV) {
    return [];
  }
  try {
    const ids: unknown = JSON.parse(
      localStorage.getItem(MOCK_SID_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function isSidUppgift(uppgift: OperativUppgiftItem): boolean {
  if (uppgift.skyddadIdentitet !== undefined) {
    return uppgift.skyddadIdentitet;
  }
  return mockSidHandlaggningIds().includes(uppgift.handlaggningId);
}
