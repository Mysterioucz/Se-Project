import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <h2 className="mt-4 text-3xl font-semibold text-gray-700">
                    Page Not Found
                </h2>
                <p className="mt-2 text-gray-600">
                    Sorry, the page you are looking for does not exist
                </p>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}
