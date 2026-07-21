"use client";

import React, { type ReactNode } from "react";

type PageDissolveTransitionProps = {
  children: ReactNode;
};

type ViewTransitionProps = {
  children?: ReactNode;
  default?: string;
  enter?: string;
  exit?: string;
  share?: string;
};

// Next's compiled React exposes ViewTransition when experimental.viewTransition is on.
const ViewTransition = (
  React as unknown as {
    ViewTransition: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

// Shared App Router dissolve: browser snapshots keep the outgoing page visible
// while the destination crossfades in. No black cover overlay.
export function PageDissolveTransition({
  children,
}: PageDissolveTransitionProps) {
  return (
    <ViewTransition
      default="page-dissolve"
      enter="page-dissolve"
      exit="page-dissolve"
      share="page-dissolve"
    >
      {children}
    </ViewTransition>
  );
}
