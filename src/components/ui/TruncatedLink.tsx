'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';
import Link from 'next/link';

interface TruncatedLinkProps {
  text: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export function TruncatedLink({ text, href, className = '', style = {}, icon, onClick }: TruncatedLinkProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium transition hover:bg-[rgba(110,226,158,0.08)] max-w-full ${className}`}
      style={style}
      title={isTruncated ? text : undefined}
    >
      {icon}
      <span ref={spanRef} className="truncate">{text}</span>
    </Link>
  );
}