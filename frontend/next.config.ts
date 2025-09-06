import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,

    webpack(config) {
        // Exclude svg from Next's default file loader
        const fileLoaderRule = config.module.rules.find(
            (rule: any) => rule.test && rule.test.test(".svg")
        );
        if (fileLoaderRule) {
            fileLoaderRule.exclude = /\.svg$/i;
        }

        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        });
        return config;
    },

    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.ts",
                },
            },
        },
    },
};

export default nextConfig;
