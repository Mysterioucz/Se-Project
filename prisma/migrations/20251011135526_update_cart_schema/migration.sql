-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "flightType" TEXT NOT NULL,
    "classType" TEXT NOT NULL,
    "UserAccountID" TEXT NOT NULL,
    "departFlightNo" TEXT NOT NULL,
    "departFlightDepartTime" TIMESTAMP(3) NOT NULL,
    "departFlightArrivalTime" TIMESTAMP(3) NOT NULL,
    "returnFlightNo" TEXT,
    "returnFlightDepartTime" TIMESTAMP(3),
    "returnFlightArrivalTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_UserAccountID_fkey" FOREIGN KEY ("UserAccountID") REFERENCES "User"("UserAccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_departFlightNo_departFlightDepartTime_departFlightArr_fkey" FOREIGN KEY ("departFlightNo", "departFlightDepartTime", "departFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_returnFlightNo_returnFlightDepartTime_returnFlightArr_fkey" FOREIGN KEY ("returnFlightNo", "returnFlightDepartTime", "returnFlightArrivalTime") REFERENCES "Flight"("FlightNo", "DepartTime", "ArrivalTime") ON DELETE SET NULL ON UPDATE CASCADE;
