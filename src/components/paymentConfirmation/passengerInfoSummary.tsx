interface PassengerInfoSummaryProps {
    count: number;
    GivenName: string;
    LastName: string;
    GenderOnID: string;
    Birthdate: string;
    Nationality: string;
    SeatNo: string;
}

export default function PassengerInfoSummary({count, GivenName,LastName,GenderOnID,Birthdate,Nationality,SeatNo}: PassengerInfoSummaryProps) {
    return (
        <div className="flex flex-col items-start self-stretch p-4 gap-4 rounded-md bg-primary-50">
            <span className="text-primary-900 font-sarabun text-[1.5rem] font-semibold leading-[1.2]">
                Passenger {count} Info
            </span>
            <div className="flex flex-col justify-center items-start pl-6 gap-2">
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Given Name : </span>
                    <span className="font-normal text-primary-800"> {GivenName}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Lastname : </span>
                    <span className="font-normal text-primary-800"> {LastName}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Gender on ID : </span>
                    <span className="font-normal text-primary-800"> {GenderOnID}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Birthdate : </span>
                    <span className="font-normal text-primary-800"> {Birthdate}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Nationality : </span>
                    <span className="font-normal text-primary-800"> {Nationality}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Seat No. : </span>
                    <span className="font-normal text-primary-800"> {SeatNo}</span>
                </span>
            </div>
        </div>


    );
}