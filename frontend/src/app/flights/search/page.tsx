import Footer from "@components/footer/footer";
import Image from "next/image";
import Navbar from "@/components/Navbar";
// test
export default function Page() {
    return (
        <div>
            <Navbar isSignIn={true} displayName="John Doe" />
            <div>Flight Search</div>
            <Footer />
        </div>
    );
}
