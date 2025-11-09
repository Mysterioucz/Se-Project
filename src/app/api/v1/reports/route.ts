import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import type { Prisma } from "@prisma/client";

import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";

export async function GET(req: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  //Check authentication
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.AUTHENTICATION },
      { status: 401 }
    );
  }

  const adminAccountId = String(session.user.id);

  // verify only admin can access this route
  const admin = await prisma.admin.findUnique({
    where: { AdminAccountID: adminAccountId },
  });

  if (!admin) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.PERMISSION },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  //Optional filters
  const status = url.searchParams.get("status"); 
  const bookingId = url.searchParams.get("bookingId");

  const where: Prisma.ReportWhereInput = {};

  if (bookingId) {
    where.BookingID = bookingId;
  }

  if (status) {
    // filter by the Report_To relation (creator)
    where.creator = { ReportStatus: status };
  }

  try {
    const reports = await prisma.report.findMany({
      where,
      include: {
        creator: true, // Report_To (ReportStatus + link to user/admin)
      },
      orderBy: {
        ReportID: "desc", 
      },
    });

    const data = reports.map((r: (typeof reports)[number]) => ({
      id: r.ReportID,
      description: r.ReportDescription,
      bookingId: r.BookingID,
      attachment: r.Attachment,
      status: r.creator?.ReportStatus ?? null,
      userAccountId: r.UserAccountID,
      adminAccountId: r.AdminAccountID,
      accountId: r.AccountID,
      telNo: r.TelNo,
      passengerName: r.PassengerName,
    }));

    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("Error fetching reports:", err);
    return NextResponse.json(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
  }
}
