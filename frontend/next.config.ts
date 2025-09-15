import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,

    webpack(config) {
        // Exclude svg from Next's default file loader

        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: "@svgr/webpack", options: { icon: false } }],
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
    eslint: {
        dirs: ["src/app", "src/components", "src/lib"], // Only run ESLint on the 'apps' and 'utils' directories during production builds (next build)
    },

    serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;
