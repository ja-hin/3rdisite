/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.STATIC_EXPORT
    ? {
        output: 'export',
        images: { unoptimized: true },
        // no server in a static export: only .tsx files are routes, so app/api/lead/route.ts is skipped.
        // Set NEXT_PUBLIC_LEAD_ENDPOINT so the form posts somewhere else (Formspree, Web3Forms, ...).
        pageExtensions: ['tsx', 'jsx', 'js'],
        ...(process.env.PREVIEW ? { assetPrefix: '.' } : {}),
      }
    : {}),
};
export default nextConfig;
