/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["uploads-ssl.webflow.com"],
    minimumCacheTTL: 60,
  },
  //   async headers() {
  //     return [
  //       {
  //         source: "/:all*(svg|jpg|png|webp)",
  //         locale: false,
  //         headers: [
  //           {
  //             key: "Cache-Control",
  //             value: "public, max-age=9999999999, must-revalidate",
  //           },
  //           {
  //             key: "CDN-Cache-Control",
  //             value: "18000",
  //           },
  //         ],
  //       },
  //     ];
  //   },
};

export default nextConfig;
