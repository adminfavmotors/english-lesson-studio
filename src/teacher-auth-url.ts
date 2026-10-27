// Lesson invitations and account confirmation links use different credentials.
export function isTeacherAuthCallback(url: URL, params: Record<string,string>) {
  const teacherAccountPage=url.pathname==='/login'||url.pathname==='/teacher/students'||(url.pathname==='/'&&url.searchParams.get('mode')==='teacher'&&url.searchParams.get('view')==='students');
  return !url.searchParams.has('session') && !params.invite && teacherAccountPage && !!(params.access_token||params.error_description);
}
export function teacherAccountReturnUrl(address: string) {
  // Keep the existing provider allow-list contract; the router canonicalises it
  // to /teacher/students before account callback processing.
  const url=new URL(address);url.search='?mode=teacher&view=students';url.hash='';url.pathname='/';return url.toString();
}
