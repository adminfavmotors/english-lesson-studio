const lessonMessages: Record<string, string> = {
  "Daily session creation limit reached. Reuse an existing lesson link.":
    "You have reached today’s limit for new shared lessons. Reopen an existing lesson link to continue.",
  "Session storage limit reached. Contact the lesson owner.":
    "A new shared lesson cannot be created right now. Reopen an existing lesson or try again later.",
  "Only the teacher can reset this lesson.":
    "Only your teacher can clear the lesson answers.",
  "Only the teacher can review answers.":
    "Only your teacher can mark answers.",
  "Only the teacher can hide reading text.":
    "Only your teacher can hide the reading text.",
  "Only the teacher can change student details, the schedule or the lesson timer.":
    "Your teacher controls student details, the schedule and the lesson timer.",
  "Invalid answer. Use at most 8000 characters per field.":
    "Use no more than 8,000 characters in each answer.",
  "Choose a lesson length between 1 and 240 minutes.":
    "Choose a lesson duration between 1 and 240 minutes.",
  "Invalid lesson date.": "Choose a valid lesson date.",
  "Invalid lesson time.": "Choose a valid lesson time.",
};

export function sharedLessonErrorMessage(status: number, detail?: unknown): string {
  if (typeof detail === "string" && Object.hasOwn(lessonMessages, detail))
    return lessonMessages[detail];
  if (status === 401 || status === 403)
    return "This lesson link could not be verified. Reopen the full link you received to reconnect.";
  if (status === 404)
    return "This shared lesson is unavailable. Check the lesson link and try again.";
  if (status === 413)
    return "This answer is too long. Shorten it and try again.";
  if (status === 429)
    return "Too many requests. Please wait a moment and try again.";
  if (status === 400)
    return "This change could not be saved. Check your answers and try again.";
  return "Could not connect to the shared lesson. Check your connection and try again.";
}
