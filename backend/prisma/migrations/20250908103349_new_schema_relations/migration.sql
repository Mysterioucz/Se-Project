-- CreateTable
CREATE TABLE "public"."Airport" (
    "AirportID" VARCHAR(10) NOT NULL,
    "AirportName" VARCHAR(100) NOT NULL,
    "City" VARCHAR(100) NOT NULL,
    "Country" VARCHAR(100) NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("AirportID")
);

-- CreateTable
CREATE TABLE "public"."Airline" (
    "AirlineName" VARCHAR(100) NOT NULL,
    "AirlineCaption" VARCHAR(255) NOT NULL,
    "Website" VARCHAR(255),
    "AmountOfAircraft" INTEGER NOT NULL,
    "Logo" VARCHAR(255),

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("AirlineName")
);

-- CreateTable
CREATE TABLE "public"."Aircraft" (
    "AircraftRegNo" VARCHAR(20) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,
    "SeatCapacity" INTEGER NOT NULL,
    "ModelName" VARCHAR(100) NOT NULL,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("AircraftRegNo")
);

-- CreateTable
CREATE TABLE "public"."Flight" (
    "FlightNo" VARCHAR(10) NOT NULL,
    "Schedule" TIMESTAMP(3) NOT NULL,
    "ArrivalAirportID" VARCHAR(10) NOT NULL,
    "DepartureAirportID" VARCHAR(10) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,
    "AircraftRegNo" VARCHAR(20) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("FlightNo","Schedule")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "TicketID" VARCHAR(50) NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "TicketStatus" TEXT NOT NULL,
    "PassengerName" TEXT NOT NULL,
    "PassengerLastName" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "DateOfBirth" TIMESTAMP(3) NOT NULL,
    "Nationality" TEXT NOT NULL,
    "BaggageChecked" DOUBLE PRECISION NOT NULL,
    "BaggageCabin" DOUBLE PRECISION NOT NULL,
    "SeatNo" TEXT NOT NULL,
    "AircraftRegNo" TEXT NOT NULL,
    "FlightNo" TEXT NOT NULL,
    "Schedule" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("TicketID")
);

-- CreateTable
CREATE TABLE "public"."Operate" (
    "AirportID" VARCHAR(10) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,

    CONSTRAINT "Operate_pkey" PRIMARY KEY ("AirportID","AirlineName")
);

-- CreateTable
CREATE TABLE "public"."Assigned_To" (
    "FlightNo" VARCHAR(10) NOT NULL,
    "Schedule" TIMESTAMP(3) NOT NULL,
    "UserAccountID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Assigned_To_pkey" PRIMARY KEY ("FlightNo","Schedule","UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "AirlineName" VARCHAR(50) NOT NULL,
    "ContactStatus" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("AdminAccountID","AirlineName")
);

-- CreateTable
CREATE TABLE "public"."Report_To" (
    "UserAccountID" VARCHAR(50) NOT NULL,
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "ReportStatus" TEXT NOT NULL,

    CONSTRAINT "Report_To_pkey" PRIMARY KEY ("UserAccountID","AdminAccountID")
);

-- CreateTable
CREATE TABLE "public"."CabinClass" (
    "AircraftRegNo" VARCHAR(20) NOT NULL,
    "Class" VARCHAR(20) NOT NULL,
    "StandardPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CabinClass_pkey" PRIMARY KEY ("AircraftRegNo","Class")
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "AircraftRegNo" VARCHAR(20) NOT NULL,
    "SeatNo" VARCHAR(10) NOT NULL,
    "SeatType" TEXT NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("AircraftRegNo","SeatNo")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "IPAddress" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminAccountID")
);

-- CreateTable
CREATE TABLE "public"."Airline_Message" (
    "AirlineName" VARCHAR(100) NOT NULL,
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "MessageText" TEXT NOT NULL,

    CONSTRAINT "Airline_Message_pkey" PRIMARY KEY ("AirlineName","AdminAccountID","MessageText")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "AccountID" VARCHAR(50) NOT NULL,
    "Password" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("AccountID")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "UserAccountID" VARCHAR(50) NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."User_Tel_No" (
    "UserAccountID" VARCHAR(50) NOT NULL,
    "TelNo" VARCHAR(20) NOT NULL,

    CONSTRAINT "User_Tel_No_pkey" PRIMARY KEY ("UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "ReportID" VARCHAR(50) NOT NULL,
    "ReportDescription" TEXT NOT NULL,
    "BookingID" TEXT NOT NULL,
    "Attachment" TEXT,
    "UserAccountID" VARCHAR(50) NOT NULL,
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "Email" TEXT NOT NULL,
    "TelNo" TEXT NOT NULL,
    "PassengerName" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("ReportID")
);

-- CreateTable
CREATE TABLE "public"."Domestic_Ticket" (
    "TicketID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Domestic_Ticket_pkey" PRIMARY KEY ("TicketID")
);

-- CreateTable
CREATE TABLE "public"."International_Ticket" (
    "TicketID" VARCHAR(50) NOT NULL,
    "PassportNo" TEXT NOT NULL,
    "IssuedCountry" TEXT NOT NULL,
    "PassportExpiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "International_Ticket_pkey" PRIMARY KEY ("TicketID")
);

-- CreateTable
CREATE TABLE "public"."Round_Trip_Ticket" (
    "TicketID" VARCHAR(50) NOT NULL,
    "TicketID2" VARCHAR(50) NOT NULL,

    CONSTRAINT "Round_Trip_Ticket_pkey" PRIMARY KEY ("TicketID")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "TicketID" VARCHAR(50) NOT NULL,
    "PaymentID" VARCHAR(50) NOT NULL,
    "UserAccountID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("TicketID","PaymentID")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "PaymentID" VARCHAR(50) NOT NULL,
    "PaymentDateTime" TIMESTAMP(3) NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "TransactionStatus" TEXT NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("PaymentID")
);

-- CreateTable
CREATE TABLE "public"."Airline_Tel_No" (
    "TelNo" VARCHAR(20) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,

    CONSTRAINT "Airline_Tel_No_pkey" PRIMARY KEY ("TelNo","AirlineName")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "SessionID" TEXT NOT NULL,
    "UserAccountID" VARCHAR(50) NOT NULL,
    "TokenHash" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastSeenAt" TIMESTAMP(3) NOT NULL,
    "IdleExpiresAt" TIMESTAMP(3) NOT NULL,
    "AbsoluteExpiresAt" TIMESTAMP(3) NOT NULL,
    "RevokedAt" TIMESTAMP(3),
    "RevokeReason" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("SessionID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flight_FlightNo_key" ON "public"."Flight"("FlightNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Round_Trip_Ticket_TicketID2_key" ON "public"."Round_Trip_Ticket"("TicketID2");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_TicketID_key" ON "public"."Purchase"("TicketID");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_PaymentID_key" ON "public"."Purchase"("PaymentID");

-- AddForeignKey
ALTER TABLE "public"."Aircraft" ADD CONSTRAINT "Aircraft_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flight" ADD CONSTRAINT "Flight_ArrivalAirportID_fkey" FOREIGN KEY ("ArrivalAirportID") REFERENCES "public"."Airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flight" ADD CONSTRAINT "Flight_DepartureAirportID_fkey" FOREIGN KEY ("DepartureAirportID") REFERENCES "public"."Airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flight" ADD CONSTRAINT "Flight_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flight" ADD CONSTRAINT "Flight_AircraftRegNo_fkey" FOREIGN KEY ("AircraftRegNo") REFERENCES "public"."Aircraft"("AircraftRegNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_FlightNo_Schedule_fkey" FOREIGN KEY ("FlightNo", "Schedule") REFERENCES "public"."Flight"("FlightNo", "Schedule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_AircraftRegNo_SeatNo_fkey" FOREIGN KEY ("AircraftRegNo", "SeatNo") REFERENCES "public"."Seat"("AircraftRegNo", "SeatNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Operate" ADD CONSTRAINT "Operate_AirportID_fkey" FOREIGN KEY ("AirportID") REFERENCES "public"."Airport"("AirportID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Operate" ADD CONSTRAINT "Operate_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assigned_To" ADD CONSTRAINT "Assigned_To_FlightNo_Schedule_fkey" FOREIGN KEY ("FlightNo", "Schedule") REFERENCES "public"."Flight"("FlightNo", "Schedule") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assigned_To" ADD CONSTRAINT "Assigned_To_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report_To" ADD CONSTRAINT "Report_To_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CabinClass" ADD CONSTRAINT "CabinClass_AircraftRegNo_fkey" FOREIGN KEY ("AircraftRegNo") REFERENCES "public"."Aircraft"("AircraftRegNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_AircraftRegNo_fkey" FOREIGN KEY ("AircraftRegNo") REFERENCES "public"."Aircraft"("AircraftRegNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Account"("AccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Airline_Message" ADD CONSTRAINT "Airline_Message_AdminAccountID_fkey" FOREIGN KEY ("AdminAccountID") REFERENCES "public"."Admin"("AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Airline_Message" ADD CONSTRAINT "Airline_Message_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."Account"("AccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User_Tel_No" ADD CONSTRAINT "User_Tel_No_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_UserAccountID_AdminAccountID_fkey" FOREIGN KEY ("UserAccountID", "AdminAccountID") REFERENCES "public"."Report_To"("UserAccountID", "AdminAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Domestic_Ticket" ADD CONSTRAINT "Domestic_Ticket_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "public"."Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."International_Ticket" ADD CONSTRAINT "International_Ticket_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "public"."Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round_Trip_Ticket" ADD CONSTRAINT "Round_Trip_Ticket_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "public"."Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Round_Trip_Ticket" ADD CONSTRAINT "Round_Trip_Ticket_TicketID2_fkey" FOREIGN KEY ("TicketID2") REFERENCES "public"."Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_TicketID_fkey" FOREIGN KEY ("TicketID") REFERENCES "public"."Ticket"("TicketID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_PaymentID_fkey" FOREIGN KEY ("PaymentID") REFERENCES "public"."Payment"("PaymentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Airline_Tel_No" ADD CONSTRAINT "Airline_Tel_No_AirlineName_fkey" FOREIGN KEY ("AirlineName") REFERENCES "public"."Airline"("AirlineName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "public"."User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;
