/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "/**": ["./contents/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/book",
        destination: "/books",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
