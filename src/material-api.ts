import { platform } from "./platform-client";
import { validateMaterial, materialId } from "./material-model";
import type {
  Material,
  MaterialContent,
  MaterialSummary,
} from "./material-model";
import packagedVersions from "./data/a1-versions.json";
const builtinVersions: Record<string, number> = packagedVersions;
const columns =
  "id,owner_id,title,subtitle,level,topic,skills,duration,sequence,version,created_at,updated_at";
export async function loadMaterials(
  signal: AbortSignal,
): Promise<{ materials: MaterialSummary[]; offline: boolean }> {
  try {
    const rows: MaterialSummary[] = [];
    for (let offset = 0; ; offset += 250) {
      const { data, error } = await platform
        .from("lesson_materials")
        .select(columns)
        .order("sequence", { ascending: true, nullsFirst: false })
        .order("id")
        .range(offset, offset + 249)
        .abortSignal(signal);
      if (error) throw error;
      rows.push(...(data as MaterialSummary[]));
      if (data.length < 250) break;
    }
    return { materials: rows, offline: false };
  } catch (error) {
    if (signal.aborted) throw error;
    const { default: lessons } = await import("./data/a1-lessons.json");
    return {
      materials: lessons.map((l) => ({
        id: materialId(l.sequence!),
        owner_id: null,
        title: l.title,
        subtitle: l.subtitle,
        level: l.level,
        topic: l.topic,
        skills: l.skills as MaterialSummary["skills"],
        duration: l.duration,
        sequence: l.sequence,
        version: builtinVersions[materialId(l.sequence!)] ?? 1,
        created_at: "",
        updated_at: "",
      })),
      offline: true,
    };
  }
}
export async function loadMaterial(
  id: string,
  signal: AbortSignal,
): Promise<Material> {
  const { data, error } = await platform
    .from("lesson_materials")
    .select("*")
    .eq("id", id)
    .abortSignal(signal)
    .single();
  if (!error && data) {
    const errors = validateMaterial(data.content);
    if (errors.length)
      throw new Error("This lesson could not be opened because some content is missing or invalid. Please try again later.");
    return data as Material;
  }
  if (signal.aborted) throw error;
  if (/^a1-\d{2}$/.test(id)) {
    const { default: lessons } = await import("./data/a1-lessons.json");
    const content = lessons.find((l) => materialId(l.sequence!) === id) as
      | MaterialContent
      | undefined;
    if (content)
      return {
        id,
        owner_id: null,
        ...content,
        content,
        version: builtinVersions[id] ?? 1,
        created_at: "",
        updated_at: "",
      };
  }
  throw new Error(
    "This lesson is unavailable. Check that you are using the right account and lesson link.",
  );
}
export async function importMaterial(content: MaterialContent) {
  const errors = validateMaterial(content);
  if (errors.length) throw new Error(errors.join(" "));
  const id = "custom-" + crypto.randomUUID();
  const { data, error } = await platform
    .from("lesson_materials")
    .insert({ id, content: { ...content, sequence: null } })
    .select("*")
    .single();
  if (error)
    throw new Error(
      "Could not save the lesson. Check that you are signed in and connected to the internet, then try again.",
    );
  return data as Material;
}
export async function loadFavourites(signal: AbortSignal) {
  const { data, error } = await platform
    .from("material_favourites")
    .select("material_id")
    .abortSignal(signal);
  if (error) throw error;
  return new Set(data.map((r) => r.material_id as string));
}
export async function saveFavourite(id: string, active: boolean) {
  const result = active
    ? await platform.from("material_favourites").insert({ material_id: id })
    : await platform.from("material_favourites").delete().eq("material_id", id);
  if (result.error && result.error.code !== "23505")
    throw new Error("Could not save favourites. Please try again.");
}
