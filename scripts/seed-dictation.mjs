// Prints reviewed source data as SQL. Does not contact a working database.
import { readFileSync } from 'node:fs';
import { validateMaterialDocument } from '../src/material-model.ts';
const document=JSON.parse(readFileSync(new URL('./materials/dictation-in-the-news.json',import.meta.url),'utf8'));
const errors=validateMaterialDocument(document);
if(errors.length)throw new Error(errors.join(' '));
const quote=value=>value===null?'null':typeof value==='number'?String(value):"'"+String(typeof value==='object'?JSON.stringify(value):value).replaceAll("'","''")+"'";
const data={id:'dictation-in-the-news',owner_id:null,...document.catalogue,content:document.content};
console.log(`insert into public.lesson_materials(${Object.keys(data).join(',')}) values(${Object.values(data).map(quote).join(',')}) on conflict(id) do update set ${Object.keys(data).filter(k=>k!=='id'&&k!=='owner_id').map(k=>`${k}=excluded.${k}`).join(',')} where lesson_materials.owner_id is null returning id,version,catalogue_version;`);
