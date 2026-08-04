import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer({
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.steampowered.com" },
      { protocol: "https", hostname: "avatars.steamstatic.com" },
    ],
  },
});
