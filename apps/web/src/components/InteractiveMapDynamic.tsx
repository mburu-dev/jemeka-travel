"use client";

import dynamic from "next/dynamic";

export const InteractiveMapDynamic = dynamic(
  () => import("./InteractiveMap").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-3xl" /> }
);
