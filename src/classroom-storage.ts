import { emptyDocument, parseDocument } from "./store-model.ts";
import type { Document } from "./store-model.ts";
import type { Workspace } from "./app-routes.ts";

export const LEGACY_CLASSROOM_KEY = "lesson-studio.unit14.v1";
export const classroomStorageKey = (workspace: Workspace) => `${LEGACY_CLASSROOM_KEY}.${workspace}`;
type StorageAccess = Pick<Storage,"getItem"|"setItem">;

export function loadClassroomDraft(storage: StorageAccess, workspace: Workspace): {document:Document;storageError:boolean} {
  let snapshot=emptyDocument();
  try {
    const current=storage.getItem(classroomStorageKey(workspace));
    if(current!==null)return {document:parseDocument(current),storageError:false};
    const legacy=storage.getItem(LEGACY_CLASSROOM_KEY);
    if(legacy===null)return {document:snapshot,storageError:false};
    snapshot=parseDocument(legacy);
    // Fork the previous shared browser draft once. Future edits use separate keys.
    for(const area of ["teacher","student"] as const) {
      const key=classroomStorageKey(area);
      if(storage.getItem(key)===null)storage.setItem(key,JSON.stringify(snapshot));
    }
    return {document:snapshot,storageError:false};
  } catch {
    return {document:snapshot,storageError:true};
  }
}
