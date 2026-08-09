import React from 'react';

interface ViewfinderFrameProps {
  children: React.ReactNode;
  caption?: React.ReactNode;
}

export default function ViewfinderFrame({ children, caption }: ViewfinderFrameProps) {
  return (
    <div className="relative aspect-[4/5] max-w-sm mx-auto w-full">
      <div className="bracket text-scan absolute inset-0"><span></span></div>
      <div className="absolute inset-6 rounded-2xl bg-white border border-line overflow-hidden flex items-center justify-center">
        {children}
        <div className="scanline"></div>
      </div>
      {caption && (
        <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-paper px-3 catalog-tag text-[11px] text-inkfade">
          {caption}
        </p>
      )}
    </div>
  );
}
