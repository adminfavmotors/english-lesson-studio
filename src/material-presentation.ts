import type { MaterialSummary } from "./material-model";

// English catalogue labels are presentation only. Stored lesson content is unchanged.
const a1Labels = [
  ["Introductions", "Start a conversation and introduce yourself"],
  ["Personal information", "Spell names and say numbers"],
  ["Countries and languages", "Talk about countries and languages"],
  ["Personal information", "Complete a simple personal information form"],
  ["Family", "Introduce family and friends"],
  ["Everyday objects", "Name everyday objects and ask for what you need"],
  ["Colours and preferences", "Describe colours and choose a gift"],
  ["Home", "Talk about rooms and furniture"],
  ["Where things are", "Find things using simple descriptions"],
  ["Daily routines", "Talk about your morning and tell the time"],
  ["Daily routines", "Describe a daily routine"],
  ["Habits", "Ask and answer questions about habits"],
  ["Food", "Talk about food and preferences"],
  ["At a café", "Order food and drinks"],
  ["Shopping", "Ask about prices and choose what to buy"],
  ["Town", "Talk about places nearby"],
  ["Directions", "Ask for and follow simple directions"],
  ["Abilities", "Talk about skills and ask for help"],
  ["People and appearance", "Describe people and their belongings"],
  ["Right now", "Say what is happening now"],
  ["Weather", "Talk about the weather and choose an activity"],
  ["How you feel", "Describe how you feel and ask for help"],
  ["Clothes and shopping", "Choose clothes in the right colour and size"],
  ["Travel", "Buy a ticket and check travel details"],
  ["Free time", "Find a hobby you have in common"],
  ["Dates and appointments", "Arrange a date and time to meet"],
  ["Messages", "Write a clear message about a meeting"],
  [
    "Communication strategies",
    "Ask for repetition and check important details",
  ],
  ["Places to stay", "Check in and ask about your stay"],
  ["Putting it together", "Use everyday English in a new town"],
] as const;

export function materialPresentation(
  material: Pick<MaterialSummary, "id" | "owner_id" | "topic" | "subtitle">,
) {
  const index = /^a1-\d{2}$/.test(material.id)
    ? Number(material.id.slice(3)) - 1
    : -1;
  const labels = !material.owner_id && index >= 0 ? a1Labels[index] : undefined;
  return labels
    ? { topic: labels[0], subtitle: labels[1] }
    : { topic: material.topic, subtitle: material.subtitle };
}
