// Offline session fixture for browser → real SQL/RLS tests. This module is
// aliased only by the test Vite server; it is never a product import or build flag.
import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
const key='lessonstudio.clerk.qa';
const subscribe=(notify:()=>void)=>{window.addEventListener('qa-clerk',notify);return()=>window.removeEventListener('qa-clerk',notify);};
const snapshot=()=>localStorage.getItem(key);
const getToken=async()=>{const raw=snapshot();return raw?JSON.parse(raw).access_token:null;};
export function ClerkProvider({children}:{children:ReactNode}){return children;}
export function useAuth(){
  const raw=useSyncExternalStore(subscribe,snapshot);
  const user=raw?JSON.parse(raw).user:null;
  return {isLoaded:true,isSignedIn:!!user,sessionId:user?'sess_'+user.id.replaceAll('-',''):null,getToken};
}
export const useClerk=()=>({
  signOut:async({redirectUrl}:{redirectUrl:string})=>{localStorage.removeItem(key);window.dispatchEvent(new Event('qa-clerk'));location.assign(redirectUrl);},
  redirectToSignIn:async()=>{throw new Error('Use the real portal browser check for external sign-in.');},
  redirectToSignUp:async()=>{throw new Error('Use the real portal browser check for external sign-up.');},
});
