export type Value = string | number | boolean | null;
export type Entry = { value: Value; time: number; writer: string };
export type Document = { version: 1; fields: Record<string, Entry> };
export const emptyDocument = (): Document => ({ version: 1, fields: {} });
export function parseDocument(raw: string | null): Document {
  if (!raw) return emptyDocument();
  try {
    const doc = JSON.parse(raw);
    if (doc.version !== 1 || !doc.fields || typeof doc.fields !== 'object' || Array.isArray(doc.fields)) return emptyDocument();
    const fields: Record<string, Entry> = {};
    for (const [key, entry] of Object.entries(doc.fields)) {
      const e = entry as Entry;
      if (e && Number.isFinite(e.time) && typeof e.writer === 'string' && (e.value === null || ['string', 'number', 'boolean'].includes(typeof e.value))) fields[key] = e;
    }
    return { version: 1, fields };
  } catch { return emptyDocument(); }
}
export function mergeDocuments(a: Document, b: Document): Document {
  const fields = { ...a.fields };
  for (const [key, entry] of Object.entries(b.fields)) {
    const prev = fields[key];
    if (!prev || entry.time > prev.time || (entry.time === prev.time && entry.writer > prev.writer)) fields[key] = entry;
  }
  return { version: 1, fields };
}
