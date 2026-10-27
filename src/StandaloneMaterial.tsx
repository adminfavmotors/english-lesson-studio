import { useEffect, useState } from "react";
import { BookOpen, LoaderCircle } from "lucide-react";
import type { Material } from "./material-model";
import { loadMaterial } from "./material-api";
import MaterialStudy from "./MaterialStudy";
import { useTeacherAccount } from "./use-teacher-account";
import { studentClassroomPath } from "./app-routes";
export default function StandaloneMaterial({ id }: { id: string }) {
  const { user, ready } = useTeacherAccount();
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    setMaterial(null);
    setError("");
    void loadMaterial(id, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) {
          setMaterial(value);
          document.title = `${value.title} · Student · Lesson Studio`;
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError((error as Error).message);
      });
    return () => controller.abort();
  }, [id, user?.id, ready]);
  return (
    <div className="student-workspace standalone-material-shell" data-role="student">
      <header>
        <BookOpen size={24} />
        <span>Lesson Studio</span>
        <small>STUDENT PRACTICE</small>
      </header>
      <main>
        {error ? (
          <div className="library-error" role="alert">
            <p>{error}</p>
            <a href={studentClassroomPath}>Back to classroom</a>
          </div>
        ) : material &&
          (!material.owner_id || material.owner_id === user?.id) ? (
          <MaterialStudy
            key={`${material.id}.${material.version}`}
            material={material}
            teacher={false}
            onBack={() => location.assign(studentClassroomPath)}
          />
        ) : (
          <div className="library-loading" role="status">
            <LoaderCircle className="students-spinner" />
            Loading lesson…
          </div>
        )}
      </main>
    </div>
  );
}
