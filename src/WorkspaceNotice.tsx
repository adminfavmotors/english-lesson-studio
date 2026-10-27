import AppLink from './AppLink';
import { BookOpen, LoaderCircle } from "lucide-react";

export default function WorkspaceNotice({title,description,href,label="Back to Lesson Studio",loading=false,onRetry}:{title:string;description?:string;href?:string;label?:string;loading?:boolean;onRetry?:()=>void}) {
  return <main className="workspace-notice"><BookOpen size={30} aria-hidden="true"/><h1>{title}</h1>{description&&<p>{description}</p>}{loading&&<LoaderCircle className="students-spinner" size={22} aria-label="Loading"/>}<div>{onRetry&&<button className="primary" onClick={onRetry}>Retry connection</button>}{href&&<AppLink className="secondary" href={href}>{label}</AppLink>}</div></main>;
}
