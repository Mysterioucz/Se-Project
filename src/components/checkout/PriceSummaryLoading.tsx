export default function PriceSummaryLoading() {
    return (
        <div className="border-2 border-primary-300 rounded-lg p-6 w-full max-w-[56.25rem] animate-pulse">
            {/* Total Section Loading */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-100 rounded w-16"></div>
                <div className="h-6 bg-gray-100 rounded w-24"></div>
            </div>

            {/* Action Buttons Loading */}
            <div className="flex gap-4 justify-between">
                <div className="h-12 bg-gray-100 rounded w-full"></div>
                <div className="h-12 bg-gray-100 rounded w-full"></div>
            </div>
        </div>
    );
}
