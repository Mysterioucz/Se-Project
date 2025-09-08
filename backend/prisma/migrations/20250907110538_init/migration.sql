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

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("FlightNo")
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
    "BaggageChecked" BOOLEAN NOT NULL,
    "BaggageClaimNo" TEXT,
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
    "UserAccountID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Assigned_To_pkey" PRIMARY KEY ("FlightNo","UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "AirlineMessageID" VARCHAR(50) NOT NULL,
    "ContactStatus" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("AdminAccountID","AirlineMessageID")
);

-- CreateTable
CREATE TABLE "public"."Report_To" (
    "UserAccountID" VARCHAR(50) NOT NULL,
    "ReportID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Report_To_pkey" PRIMARY KEY ("UserAccountID","ReportID")
);

-- CreateTable
CREATE TABLE "public"."CabinClass" (
    "Class" VARCHAR(20) NOT NULL,

    CONSTRAINT "CabinClass_pkey" PRIMARY KEY ("Class")
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "SeatNo" VARCHAR(10) NOT NULL,
    "SeatType" TEXT NOT NULL,
    "AircraftRegNo" VARCHAR(20) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("SeatNo")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "UserAccountID" VARCHAR(50) NOT NULL,
    "AdminID" VARCHAR(50) NOT NULL,
    "AdminMessage" VARCHAR(100) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."Airline_Message" (
    "AirlineMessageID" VARCHAR(50) NOT NULL,
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "MessageText" TEXT NOT NULL,

    CONSTRAINT "Airline_Message_pkey" PRIMARY KEY ("AirlineMessageID")
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
    "IPAddress" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserAccountID")
);

-- CreateTable
CREATE TABLE "public"."User_Tel_No" (
    "TelNo" VARCHAR(20) NOT NULL,
    "UserAccountID" VARCHAR(50) NOT NULL,

    CONSTRAINT "User_Tel_No_pkey" PRIMARY KEY ("TelNo")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "ReportID" VARCHAR(50) NOT NULL,
    "ReportDescription" TEXT NOT NULL,
    "BookingID" TEXT NOT NULL,
    "Attachment" TEXT,
    "UserAccountID" VARCHAR(50) NOT NULL,
    "AdminAccountID" VARCHAR(50) NOT NULL,
    "ReportStatus" TEXT NOT NULL,
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
    "PurchaseID" VARCHAR(50) NOT NULL,
    "TicketID" VARCHAR(50) NOT NULL,
    "PaymentID" VARCHAR(50) NOT NULL,
    "UserAccountID" VARCHAR(50) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("PurchaseID")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "PaymentID" VARCHAR(50) NOT NULL,
    "PaymentDateTime" TIMESTAMP(3) NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "TransactionStatus" TEXT NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("PaymentID")
);

-- CreateTable
CREATE TABLE "public"."Airline_Tel_No" (
    "TelNo" VARCHAR(20) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,

    CONSTRAINT "Airline_Tel_No_pkey" PRIMARY KEY ("TelNo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_AdminID_key" ON "public"."Admin"("AdminID");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");
