import Navbar from "@/src/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex flex-col h-screen">
            <Navbar />
            {children}
        </section>
    );
}
