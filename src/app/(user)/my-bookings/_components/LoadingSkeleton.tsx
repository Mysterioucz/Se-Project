export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((index) => (
                <div key={index}>
                    {/* BookingItemHeader Skeleton */}
                    <div className="flex items-end justify-between pb-4">
                        {/* Booking ID section */}
                        <div className="flex flex-row items-center gap-4">
                            <div className="h-3.5 w-20 rounded bg-gray-300"></div>
                            <div className="bg-primary-200 h-3.5 w-32 rounded"></div>
                            <div className="h-5 w-5 rounded bg-gray-300"></div>
                        </div>
                        {/* Status badge skeleton */}
                        <div className="h-8 w-24 rounded-2xl bg-gray-300"></div>
                    </div>

                    {/* BookingItem Skeleton */}
                    <div className="border-primary-300 mb-6 overflow-hidden rounded-lg border-3">
                        {/* Header skeleton */}
                        <div className="bg-primary-300 flex items-center justify-between p-2">
                            <div className="bg-primary-400 ml-4 h-6 w-64 rounded"></div>
                        </div>

                        {/* Content skeleton */}
                        <div className="grid grid-cols-1 gap-4 bg-white md:grid-cols-3">
                            <div className="space-y-6 p-4 md:col-span-2">
                                {/* Depart section */}
                                <div className="space-y-3">
                                    <div className="bg-primary-200 h-5 w-20 rounded"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="bg-primary-200 h-6 w-32 rounded"></div>
                                            <div className="bg-primary-200 h-4 w-40 rounded"></div>
                                        </div>
                                        <div className="bg-primary-200 h-4 w-24 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="bg-primary-200 h-6 w-32 rounded"></div>
                                            <div className="bg-primary-200 h-4 w-40 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary-200 h-4 w-24 rounded"></div>
                                        <div className="bg-primary-200 h-4 w-4 rounded-full"></div>
                                        <div className="bg-primary-200 h-1 w-32 rounded"></div>
                                        <div className="bg-primary-200 h-4 w-16 rounded"></div>
                                    </div>
                                </div>

                                {/* Return section */}
                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="bg-primary-200 h-5 w-20 rounded"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="bg-primary-200 h-6 w-32 rounded"></div>
                                            <div className="bg-primary-200 h-4 w-40 rounded"></div>
                                        </div>
                                        <div className="bg-primary-200 h-4 w-24 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="bg-primary-200 h-6 w-32 rounded"></div>
                                            <div className="bg-primary-200 h-4 w-40 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary-200 h-4 w-24 rounded"></div>
                                        <div className="bg-primary-200 h-4 w-4 rounded-full"></div>
                                        <div className="bg-primary-200 h-1 w-32 rounded"></div>
                                        <div className="bg-primary-200 h-4 w-16 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Price section */}
                            <div className="bg-primary-100 -m-1 flex flex-col items-end justify-center p-4 text-right md:m-0">
                                <div className="bg-primary-200 mb-2 h-4 w-40 rounded"></div>
                                <div className="bg-primary-200 mb-3 h-6 w-32 rounded"></div>
                                <div className="bg-primary-200 h-8 w-36 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
