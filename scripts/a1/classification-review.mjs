import fs from 'node:fs';
import { createHash } from 'node:crypto';

const normalise = value => Array.isArray(value) ? value.map(normalise)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, normalise(value[key])]))
    : value;
export const reviewHash = value => createHash('sha256')
  .update(JSON.stringify(normalise(value))).digest('hex');

export function assertReviewedA1(documents) {
  const review = JSON.parse(fs.readFileSync(new URL('../../docs/a1-classification-review.json', import.meta.url), 'utf8'));
  const versions = JSON.parse(fs.readFileSync(new URL('../../src/data/a1-versions.json', import.meta.url), 'utf8'));
  if (review.reviews.length !== 30 || documents.length !== 30)
    throw new Error('Expected 30 reviewed A1 lessons.');
  documents.forEach(({catalogue, content}, index) => {
    const row = review.reviews[index];
    const id = `a1-${String(index + 1).padStart(2, '0')}`;
    const previousCatalogue = Object.fromEntries(
      ['title','subtitle','level','topic','duration','sequence'].map(key => [key, catalogue[key]]));
    previousCatalogue.skills = row.source.legacy_skills;
    if (row.material_id !== id || row.source.teaching_revision !== versions[id] ||
        catalogue.sequence !== index + 1 ||
        reviewHash(content) !== row.source.content_sha256 ||
        reviewHash(previousCatalogue) !== row.source.catalogue_sha256 ||
        catalogue.classification_status !== 'reviewed' || catalogue.legacy_skills !== null ||
        reviewHash(catalogue.skills) !== reviewHash(row.proposal.skills) ||
        reviewHash(catalogue.language_focus) !== reviewHash(row.proposal.language_focus))
      throw new Error(`${id}: reconcile this lesson with its classification review before building.`);
  });
}
