'use client';

import { useEffect, useState, useRef, ElementType } from 'react';

interface TruncatedTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

export function TruncatedText({ text, className = '', as: Component = 'p', style = {} }: TruncatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  return (
    <Component
      ref={textRef}
      className={`truncate ${className}`}
      style={style}
      title={isTruncated ? text : undefined}
    >
      {text}
    </Component>
  );
}