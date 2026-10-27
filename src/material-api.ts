import { platform } from './platform-client';
import { validateMaterial } from './material-model';
import type { Material, MaterialContent, MaterialSummary } from './material-model';
const columns = 'id,owner_id,title,subtitle,level,topic,skills,duration,sequence,version,created_at,updated_at';
export async function loadMaterials(signal: AbortSignal): Promise<{materials: MaterialSummary[]}> {
  const rows: MaterialSummary[] = [];
  for (let offset = 0; ; offset += 250) {
    const {data, error} = await platform.from('lesson_materials').select(columns).order('sequence', {ascending: true, nullsFirst: false}).order('id').range(offset, offset + 249).abortSignal(signal);
    if (error) throw new Error('Could not load your lesson library. Check your connection and try again.');
    rows.push(...data as MaterialSummary[]);
    if (data.length < 250) break;
  }
  return {materials: rows};
}
export async function loadMaterial(id: string, signal: AbortSignal): Promise<Material> {
  const {data, error} = await platform.from('lesson_materials').select('*').eq('id', id).abortSignal(signal).single();
  if (error || !data) throw new Error('This lesson is unavailable for your account. Ask your teacher for a shared lesson invitation.');
  if (validateMaterial(data.content).length) throw new Error('This lesson could not be opened because some content is missing or invalid. Please try again later.');
  return data as Material;
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
