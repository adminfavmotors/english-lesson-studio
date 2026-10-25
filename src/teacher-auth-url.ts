// Lesson invitations and account confirmation links use different credentials.
export function isTeacherAuthCallback(url: URL, params: Record<string,string>) {
  return !url.searchParams.has('session') && url.searchParams.get('mode')==='teacher' && url.searchParams.get('view')==='students' && !!(params.access_token||params.error_description);
}
export function teacherAccountReturnUrl(address: string) {
  const url=new URL(address);url.search='?mode=teacher&view=students';url.hash='';url.pathname='/';return url.toString();
}
