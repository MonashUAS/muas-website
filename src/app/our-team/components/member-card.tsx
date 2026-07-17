"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "../data/team-data";
import { temporaryImage } from "../data/team-data";

type MemberCardProps = {
  member: TeamMember;
};

export function MemberCard({ member }: MemberCardProps) {
  const [imageSource, setImageSource] = useState(member.image);

  return (
    <article className="group flex w-full max-w-[19rem] flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] text-center shadow-[0_22px_65px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] motion-reduce:transition-none sm:w-[19rem]">
      <div className="relative aspect-square w-full overflow-hidden bg-blue-950">
        <Image
          src={imageSource}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes="19rem"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
          onError={() => {
            if (imageSource !== temporaryImage.src) {
              setImageSource(temporaryImage.src);
            }
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(0,0,0,0.34)_100%)]" />
      </div>

      <div className="flex min-h-[7.5rem] w-full flex-col items-center justify-center px-5 py-5">
        <h3 className="text-b1 font-black leading-tight text-white">
          {member.name}
        </h3>

        <p className="mt-2 text-b2 font-medium text-blue-100">{member.role}</p>
      </div>
    </article>
  );
}
