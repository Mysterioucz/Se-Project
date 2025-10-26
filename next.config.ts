import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                // Apply these headers to all routes in the application.
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "http://localhost:3000",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,DELETE,PATCH,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
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
