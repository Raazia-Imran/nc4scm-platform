"use client";
import Link from "next/link";

export default function ServiceFlipRail({ services }) {
  const fallback = ["LC3 Technology", "Material Characterization", "New Material Development", "Technological Support"].map((title, index) => ({ _id: `service-placeholder-${index}`, title, summary: "Service details will remain editable in Sanity once supplied." }));
  const items = services.length ? services : fallback;
  return <div className="flip-rail">{items.map((service, index) => <article className="flip-card" key={service._id || service.title}><div className="flip-card-inner"><div className="flip-face flip-front"><span>0{index + 1}</span><h3>{service.title}</h3></div><div className="flip-face flip-back"><p>{service.summary || "Technical expertise tailored to the material challenge."}</p>{service.slug?.current && <Link href={`/services/${service.slug.current}`}>View details ↗</Link>}</div></div></article>)}</div>;
}
