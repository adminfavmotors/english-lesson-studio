import { LEGACY_MATERIAL_SKILLS, MATERIAL_LANGUAGE_FOCUS, MATERIAL_SKILLS } from "./material-model";
import type { MaterialClassification as Classification } from "./material-model";

export default function MaterialClassification({ classification, showLegacy = false }: {
  classification: Classification; showLegacy?: boolean;
}) {
  if (classification.classification_status === "needs_review")
    return <div className="material-classification">
      <p className="material-classification-pending">Classification needs review</p>
      {showLegacy && <p className="material-classification-legacy">
        Previous tags: {classification.legacy_skills.map(value => LEGACY_MATERIAL_SKILLS[value]).join(", ")}
      </p>}
    </div>;

  return <dl className="material-classification">
    <div><dt>Skills</dt><dd className="material-skill-tags">
      {classification.skills.length ? classification.skills.map(value =>
        <span key={value}>{MATERIAL_SKILLS[value]}</span>) : <span>None</span>}
    </dd></div>
    <div><dt>Language focus</dt><dd className="material-skill-tags">
      {classification.language_focus.length ? classification.language_focus.map(value =>
        <span key={value}>{MATERIAL_LANGUAGE_FOCUS[value]}</span>) : <span>None</span>}
    </dd></div>
  </dl>;
}
