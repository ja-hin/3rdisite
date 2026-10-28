'use client';

export function Eyebrow({ children, light = false, grad = false, reveal }: { children: React.ReactNode; light?: boolean; grad?: boolean; reveal?: number }) {
  return (
    <p className={`sp-eyebrow ${light ? 'sp-eyebrow--light' : ''} ${grad ? 'sp-eyebrow--grad' : ''}`} data-reveal={reveal}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}
