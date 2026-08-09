import React from 'react';
import Link from 'next/link';

import { AccentColor } from '@/types/quiz';

interface QuizCardProps {
  labNumber: string;
  accentColor: AccentColor;
  title: string;
  description: string;
  href: string;
}

const colorStyles: Record<AccentColor, { text: string; bgLight: string; bgDark: string }> = {
  scan: {
    text: 'text-scan',
    bgLight: 'bg-scan/10',
    bgDark: 'bg-scan',
  },
  blood: {
    text: 'text-blood',
    bgLight: 'bg-blood/10',
    bgDark: 'bg-blood',
  },
  amber: {
    text: 'text-amber',
    bgLight: 'bg-amber/10',
    bgDark: 'bg-amber',
  },
  jade: {
    text: 'text-jade',
    bgLight: 'bg-jade/10',
    bgDark: 'bg-jade',
  },
};

export default function QuizCard({ labNumber, accentColor, title, description, href }: QuizCardProps) {
  const styles = colorStyles[accentColor];
  
  return (
    <article className="rounded-2xl border border-line bg-white p-6 flex flex-col hover:-translate-y-1 transition-transform">
      <p className={`catalog-tag text-xs font-medium ${styles.text}`}>{labNumber}</p>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center my-4 ${styles.bgLight}`}>
        <div className={`w-4 h-4 rounded-full ${styles.bgDark}`}></div>
      </div>
      <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-inkfade leading-relaxed flex-1">
        {description}
      </p>
      <Link href={href} className={`mt-5 text-sm font-semibold flex items-center gap-1 ${styles.text}`}>
        스캔 시작 →
      </Link>
    </article>
  );
}
