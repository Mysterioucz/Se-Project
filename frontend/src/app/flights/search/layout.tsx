import Navbar from "@components/Navbar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
    params: { searchParams: URLSearchParams };
}) {
    return children;
}
