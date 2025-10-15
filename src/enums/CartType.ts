export type CartType = {
    id: number;
    FlightType: string;
    ClassType: string;
    Adults: number;
    Childrens: number;
    Infants: number;
    Price: number;
    DepartureAirport: string,
    ArrivalAirport: string,
    DepartureCity: string;
    ArrivalCity: string;

    Depart: {
        FlightNo: string;
        DepartTime: Date;
        ArrivalTime: Date;
        AirlineName: string;
        Stops: number;
    };

    Return: {
        FlightNo: string | null;
        DepartTime: Date | null;
        ArrivalTime: Date | null;
        AirlineName: string | null;
        Stops: number | null;
    } | null;
};