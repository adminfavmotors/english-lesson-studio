import { lazy, Suspense, useEffect, useState } from "react";
import { canonicalAppUrl, resolveAppRoute } from "./app-routes";
import LandingPage from "./LandingPage";
import WorkspaceNotice from "./WorkspaceNotice";

const AuthenticatedApp=lazy(()=>import("./AuthenticatedApp"));

export default function App() {
  const [address,setAddress]=useState(()=>location.href);
  useEffect(()=>{
    const update=()=>{const url=canonicalAppUrl(location.href);if(url.href!==location.href)history.replaceState(null,"",url);setAddress(url.href);};
    window.addEventListener("popstate",update);
    return()=>window.removeEventListener("popstate",update);
  },[]);
  const route=resolveAppRoute(address);
  if(route.area==="entry")return <LandingPage/>;
  if(route.area==="not-found")return <WorkspaceNotice title="Page not found" description="This page is not available." href="/"/>;
  return <Suspense fallback={<WorkspaceNotice title="Opening your workspace…" loading/>}><AuthenticatedApp route={route}/></Suspense>;
}
