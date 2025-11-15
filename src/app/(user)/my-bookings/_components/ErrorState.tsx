interface ErrorStateProps {
    error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className="my-10 rounded-lg bg-red-50 p-6 text-center text-red-600">
            <div className="mb-2 text-2xl font-bold">
                Error Loading Bookings
            </div>
            <div className="text-lg">{error}</div>
        </div>
    );
}
