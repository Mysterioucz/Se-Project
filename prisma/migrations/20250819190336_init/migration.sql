-- CreateTable
CREATE TABLE "public"."Flight" (
    "FlightNo" VARCHAR(10) NOT NULL,
    "Schedule" TIMESTAMP(3) NOT NULL,
    "ArrivalAirportID" CHAR(3) NOT NULL,
    "DepartureAirportID" CHAR(3) NOT NULL,
    "AirlineName" VARCHAR(100) NOT NULL,
    "AircraftRegNo" VARCHAR(20) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("FlightNo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flight_ArrivalAirportID_key" ON "public"."Flight"("ArrivalAirportID");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_DepartureAirportID_key" ON "public"."Flight"("DepartureAirportID");
