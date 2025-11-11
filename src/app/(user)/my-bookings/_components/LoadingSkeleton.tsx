export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((index) => (
                <div
                    key={index}
                    className="border-primary-300 overflow-hidden rounded-lg border-3"
                >
                    {/* Header skeleton */}
                    <div className="bg-primary-300 h-12 p-2"></div>

                    {/* Content skeleton */}
                    <div className="grid grid-cols-1 gap-4 bg-white p-4 md:grid-cols-3">
                        <div className="space-y-4 md:col-span-2">
                            {/* Depart section */}
                            <div className="space-y-3">
                                <div className="bg-primary-200 h-4 w-20 rounded"></div>
                                <div className="bg-primary-200 h-6 w-3/4 rounded"></div>
                                <div className="bg-primary-200 h-4 w-1/2 rounded"></div>
                                <div className="bg-primary-200 h-4 w-2/3 rounded"></div>
                            </div>

                            {/* Return section (optional) */}
                            <div className="space-y-3 pt-4">
                                <div className="bg-primary-200 h-4 w-20 rounded"></div>
                                <div className="bg-primary-200 h-6 w-3/4 rounded"></div>
                                <div className="bg-primary-200 h-4 w-1/2 rounded"></div>
                            </div>
                        </div>

                        {/* Price section */}
                        <div className="bg-primary-100 flex flex-col items-end justify-center space-y-3 p-4">
                            <div className="bg-primary-200 h-4 w-32 rounded"></div>
                            <div className="bg-primary-200 h-6 w-24 rounded"></div>
                            <div className="bg-primary-200 h-8 w-28 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
