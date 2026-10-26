import { useEffect, useState } from "react";
import { BookOpen, LoaderCircle } from "lucide-react";
import type { Material } from "./material-model";
import { loadMaterial } from "./material-api";
import MaterialStudy from "./MaterialStudy";
import { useTeacherAccount } from "./use-teacher-account";
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
          document.title = `${value.title} · Lesson Studio`;
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError((error as Error).message);
      });
    return () => controller.abort();
  }, [id, user?.id, ready]);
  return (
    <div className="student-workspace standalone-material-shell">
      <header>
        <BookOpen size={24} />
        <span>Lesson Studio</span>
        <small>STUDENT PRACTICE</small>
      </header>
      <main>
        {error ? (
          <div className="library-error" role="alert">
            <p>{error}</p>
            <a href="/?mode=student">Back to classroom</a>
          </div>
        ) : material &&
          (!material.owner_id || material.owner_id === user?.id) ? (
          <MaterialStudy
            key={`${material.id}.${material.version}`}
            material={material}
            teacher={false}
            onBack={() => location.assign("/?mode=student")}
          />
        ) : (
          <div className="library-loading" role="status">
            <LoaderCircle className="students-spinner" />
            Opening lesson…
          </div>
        )}
      </main>
    </div>
  );
}
