/* The 3rd i Visuals logo, used in every header. */
export function Brand({ href = '/' }: { href?: string }) {
  return (
    <a href={href} className="brand" aria-label="3rd i Visuals home">
      <img src="/assets/logo.png" alt="3rd i Visuals" className="brand-logo" width={600} height={160} decoding="async" />
    </a>
  );
}
