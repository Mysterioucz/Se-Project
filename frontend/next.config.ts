import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,

    webpack(config) {
        // Exclude svg from Next's default file loader

        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        });
        return config;
    },

    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.ts",
            },
        },
    },
};

export default nextConfig;
