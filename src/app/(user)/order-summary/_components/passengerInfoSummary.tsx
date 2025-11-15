interface PassengerInfoSummaryProps {
    count: number;
    GivenName: string;
    LastName: string;
    GenderOnID: string;
    Birthdate: string;
    Nationality: string;
    SeatNo: string;
    PassportNo?: string | null;
    PassportIssueDate?: string | null;
    PassportExpiryDate?: string | null;
}

export default function PassengerInfoSummary({
    count,
    GivenName,
    LastName,
    GenderOnID,
    Birthdate,
    Nationality,
    SeatNo,
    PassportNo = "",
    PassportIssueDate = "",
    PassportExpiryDate = "",
}: PassengerInfoSummaryProps) {
    const showPassportInfo =
        PassportNo || PassportIssueDate || PassportExpiryDate;

    return (
        <div className="bg-primary-50 flex flex-col items-start gap-4 self-stretch rounded-md p-4">
            <span className="text-primary-900 font-sarabun text-[1.5rem] leading-[1.2] font-semibold">
                Passenger {count} Info
            </span>
            <div className="flex flex-col items-start justify-center gap-2 pl-6">
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Given Name :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {GivenName}
                    </span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Lastname :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {LastName}
                    </span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Gender on ID :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {GenderOnID}
                    </span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Birthdate :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {Birthdate}
                    </span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Nationality :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {Nationality}
                    </span>
                </span>

                {showPassportInfo && (
                    <>
                        {PassportNo && (
                            <span className="font-sarabun text-[1rem] leading-[120%]">
                                <span className="text-primary-600 font-bold">
                                    Passport No. :{" "}
                                </span>
                                <span className="text-primary-800 font-normal">
                                    {" "}
                                    {PassportNo}
                                </span>
                            </span>
                        )}
                        {PassportIssueDate && (
                            <span className="font-sarabun text-[1rem] leading-[120%]">
                                <span className="text-primary-600 font-bold">
                                    Passport Issue Date :{" "}
                                </span>
                                <span className="text-primary-800 font-normal">
                                    {" "}
                                    {PassportIssueDate}
                                </span>
                            </span>
                        )}
                        {PassportExpiryDate && (
                            <span className="font-sarabun text-[1rem] leading-[120%]">
                                <span className="text-primary-600 font-bold">
                                    Passport Expiry Date :{" "}
                                </span>
                                <span className="text-primary-800 font-normal">
                                    {" "}
                                    {PassportExpiryDate}
                                </span>
                            </span>
                        )}
                    </>
                )}
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Seat No. :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {" "}
                        {SeatNo}
                    </span>
                </span>
            </div>
        </div>
    );
}
