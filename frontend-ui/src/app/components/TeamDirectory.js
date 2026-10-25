"use client";
import {useRef, useState, useEffect} from "react";
import Image from "next/image";
import {urlFor} from "@/sanityClient";
import RichTextRenderer from "./RichTextRenderer";
import EmailLinks from "./EmailLinks";

function Placeholder({female}) {
  return <svg viewBox="0 0 120 140" fill="none" aria-hidden="true" className="team-placeholder-art">
    <circle cx="60" cy="65" r="48" fill="#f1f5f2" />
    {female ? <path d="M29 76V53c0-24 14-37 31-37s31 13 31 37v23L77 89H43L29 76Z" fill="#9bb8ab"/> : null}
    <ellipse cx="60" cy="53" rx="20" ry="25" fill="#d7e5dd"/>
    {female ? <path d="M38 47c0-19 11-28 23-28 17 0 25 12 24 29-12-3-20-10-24-19-3 10-11 16-23 18Z" fill="#789b89"/> : null}
    <path d="M16 128c1-29 19-43 44-43s43 14 44 43" fill="#b6cdbf"/>
    <path d="m47 86 13 17 13-17" fill="#fff"/>
    <circle cx="60" cy="115" r="3" fill="#789b89"/>
  </svg>;
}
function Portrait({member, large=false}) {
  const src=urlFor(member.avatar)?.ignoreImageParams().width(large?600:320).fit("max").auto("format").url();
  return <div className={`team-portrait ${src?"":"team-portrait-empty"}`}>
    {src ? <Image src={src} alt={member.avatar.alt || member.fullName} fill sizes={large?"180px":"120px"} className="team-directory-photo"/> : <Placeholder female={member.portraitPlaceholder==="female"}/>}
  </div>;
}
function Contacts({member,text,full=false}) {
 return <div className="team-contact-links">
  {(member.email||member.secondaryEmail)&&<EmailLinks email={member.email||member.secondaryEmail} text={text}/>}
  {full&&member.email&&member.secondaryEmail&&<EmailLinks email={member.secondaryEmail} text={text} showAddress/>}
  {member.linkedinUrl&&<a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">{text.linkedin} <span aria-hidden="true">↗</span></a>}
  {member.profileUrl&&<a href={member.profileUrl} target="_blank" rel="noopener noreferrer">{text.academicProfile} <span aria-hidden="true">↗</span></a>}
 </div>;
}
export default function TeamDirectory({members,text}) {
 const [selected,setSelected]=useState(null);const dialog=useRef(null);const opener=useRef(null);
 useEffect(()=>{if(selected){dialog.current?.showModal();const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old;};}},[selected]);
 const close=()=>{dialog.current?.close();setSelected(null);opener.current?.focus();};
 const open=(member,event)=>{opener.current=event.currentTarget;setSelected(member);};
 return <>
  <div className="team-directory-grid">
   {members.map(member=><article className="team-profile-card" key={member._id}>
    <div className="team-profile-top"><Portrait member={member}/><div className="team-profile-identity"><p className="team-profile-role">{member.position}</p><h4>{member.fullName}</h4></div></div>
    <p className="team-profile-summary">{member.cardSummary || (member.bio||[]).flatMap(b=>b.children||[]).map(x=>x.text||"").join(" ").split(/(?<=[.!?])\s/).slice(0,2).join(" ") || member.position}</p>
    <ul className="team-focus-tags" aria-label={text.researchFocus}>{(member.researchInterests||[]).slice(0,3).map(item=><li key={item}>{item}</li>)}</ul>
    <div className="team-profile-actions"><button type="button" onClick={e=>open(member,e)} aria-label={`${text.biography}: ${member.fullName}`}>{text.biography}<span aria-hidden="true">↗</span></button></div>
    <Contacts member={member} text={text}/>
   </article>)}
  </div>
  <dialog ref={dialog} className="team-profile-dialog" aria-labelledby="team-dialog-name" onCancel={e=>{e.preventDefault();close();}}>
   {selected&&<div className="team-dialog-sheet"><button type="button" className="team-dialog-close" onClick={close} aria-label={text.closeProfile} autoFocus>×</button>
    <div className="team-dialog-header"><Portrait member={selected} large/><div><p className="team-profile-role">{selected.position}</p><h2 id="team-dialog-name">{selected.fullName}</h2>{selected.qualification&&<p className="team-qualification">{selected.qualification}</p>}</div></div>
    {selected.researchInterests?.length>0&&<section className="team-dialog-focus"><h3>{text.researchFocus}</h3><ul className="team-focus-tags">{selected.researchInterests.map(item=><li key={item}>{item}</li>)}</ul></section>}
    {selected.bio?.length>0&&<div className="team-dialog-bio"><RichTextRenderer value={selected.bio}/></div>}
    <Contacts member={selected} text={text} full/>
   </div>}
  </dialog>
 </>;
}
