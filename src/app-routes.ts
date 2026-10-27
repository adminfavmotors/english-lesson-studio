export type Workspace = "teacher" | "student";
export type TeacherPage = "students" | "materials" | "classroom";
export type AppRoute =
  | { area: "entry" }
  | { area: "teacher"; page: TeacherPage; materialId?: string }
  | { area: "student"; page: "classroom" | "lesson"; materialId?: string }
  | { area: "not-found"; workspace?: Workspace };

const materialIdPattern = /^[a-z0-9-]{3,100}$/;
export const teacherPath = (page: TeacherPage) => `/teacher/${page}`;
export const teacherMaterialPath = (id = "") =>
  id ? `/teacher/materials/${encodeURIComponent(id)}` : teacherPath("materials");
export const studentClassroomPath = "/student/classroom";
export const studentLessonPath = (id: string) => `/student/lessons/${encodeURIComponent(id)}`;
export const classroomPath = (workspace: Workspace) => `/${workspace}/classroom`;

export function canonicalAppUrl(address: string): URL {
  const url = new URL(address);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const legacy = path === "/" && (url.searchParams.has("mode") || url.searchParams.has("view") || url.searchParams.has("session") || !!url.hash);
  if (legacy) {
    const teacher = url.searchParams.get("mode") === "teacher";
    const view = url.searchParams.get("view");
    const id = url.searchParams.get("material") || "";
    if (url.searchParams.has("session")) url.pathname = classroomPath(teacher ? "teacher" : "student");
    else if (teacher) url.pathname = view === "students" ? teacherPath("students") : view === "classroom" ? teacherPath("classroom") : teacherMaterialPath(id);
    else url.pathname = view === "material" && id ? studentLessonPath(id) : studentClassroomPath;
  } else if (path === "/teacher" || path === "/student") {
    url.pathname = path === "/teacher" ? teacherPath("materials") : studentClassroomPath;
  } else url.pathname = path;

  const workspace = url.pathname.startsWith("/teacher/") ? "teacher" : url.pathname.startsWith("/student/") ? "student" : null;
  if (workspace) {
    // A lesson capability belongs only on a classroom URL, never on account pages.
    if (url.searchParams.has("session")) url.pathname = classroomPath(workspace);
    else if (url.pathname === teacherPath("materials") && url.searchParams.get("material"))
      url.pathname = teacherMaterialPath(url.searchParams.get("material")!);
    url.searchParams.delete("mode");
    url.searchParams.delete("view");
    url.searchParams.delete("material");
  }
  return url;
}

export function resolveAppRoute(address: string): AppRoute {
  const url = canonicalAppUrl(address);
  const path = url.pathname;
  if (path === "/") return { area: "entry" };
  if (path === teacherPath("students")) return { area: "teacher", page: "students" };
  if (path === teacherPath("classroom")) return { area: "teacher", page: "classroom" };
  if (path === teacherPath("materials")) return { area: "teacher", page: "materials" };
  const teacherMaterial = path.match(/^\/teacher\/materials\/([^/]+)$/);
  if (teacherMaterial && materialIdPattern.test(teacherMaterial[1]))
    return { area: "teacher", page: "materials", materialId: teacherMaterial[1] };
  if (path === studentClassroomPath) return { area: "student", page: "classroom" };
  const studentMaterial = path.match(/^\/student\/lessons\/([^/]+)$/);
  if (studentMaterial && materialIdPattern.test(studentMaterial[1]))
    return { area: "student", page: "lesson", materialId: studentMaterial[1] };
  return { area: "not-found", workspace: path.startsWith("/teacher/") ? "teacher" : path.startsWith("/student/") ? "student" : undefined };
}

export function navigateToMaterial(id = "") {
  history.pushState(null, "", teacherMaterialPath(id));
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
