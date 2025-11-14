export enum ReportErrorType {
    DUPLICATE_REPORT = "DUPLICATE_REPORT",
    INVALID_BOOKING_ID = "INVALID_BOOKING_ID",
    UNAUTHORIZED_BOOKING = "UNAUTHORIZED_BOOKING",
    AUTHENTICATION = "AUTHENTICATION",
    MISSING_PARAMETER = "MISSING_PARAMETER",
    INVALID_REFERENCE = "INVALID_REFERENCE",
    BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
    SERVER_ERROR = "SERVER_ERROR",
    UNKNOWN = "UNKNOWN",
}

export const ReportErrorMessages: Record<ReportErrorType, string> = {
    [ReportErrorType.DUPLICATE_REPORT]: "Report Already Exists",
    [ReportErrorType.INVALID_BOOKING_ID]: "Invalid Booking ID",
    [ReportErrorType.UNAUTHORIZED_BOOKING]: "Unauthorized Booking",
    [ReportErrorType.AUTHENTICATION]: "Authentication Error",
    [ReportErrorType.MISSING_PARAMETER]: "Missing Required Fields",
    [ReportErrorType.INVALID_REFERENCE]: "Invalid Reference",
    [ReportErrorType.BOOKING_NOT_FOUND]: "Booking Not Found",
    [ReportErrorType.SERVER_ERROR]: "Submission Error",
    [ReportErrorType.UNKNOWN]: "Unknown Error",
};

export const getErrorColor = (errorType: ReportErrorType | null): { bg: string; border: string; text: string } => {
    if (errorType === ReportErrorType.DUPLICATE_REPORT) {
        return {
            bg: "#FEF3C7",
            border: "#F59E0B",
            text: "#92400E",
        };
    }
    return {
        bg: "#FEE2E2",
        border: "#EF4444",
        text: "#991B1B",
    };
};
