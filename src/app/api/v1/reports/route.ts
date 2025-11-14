import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import type {Prisma} from "@/src/generated/prisma";
import { ReportStatusEnum, ReportPriorityEnum } from "@/src/generated/prisma";

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

  //Authorization: verify only admin can access this route
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
  const priority = url.searchParams.get("priority"); // "NORMAL" | "HIGH"

  const where: Prisma.ReportWhereInput = {};

  if (status && Object.values(ReportStatusEnum).includes(status as ReportStatusEnum)) {
    where.Status = status as ReportStatusEnum;  
  }

  if (priority && Object.values(ReportPriorityEnum).includes(priority as ReportPriorityEnum)) {
    where.Priority = priority as ReportPriorityEnum;
  }

  try {
    const reports = await prisma.report.findMany({
      where,
      orderBy: {
        CreatedAt: "desc", 
      },
    });

    const data = reports.map((r: (typeof reports)[number]) => ({
      id: r.ReportID,
      bookingID: r.PaymentID,
      description: r.ReportDescription,
      attachment: r.Attachment,
      status: r.Status,
      priority: r.Priority,
      submittedAt: r.CreatedAt,
      updatedAt: r.UpdatedAt,
      userAccountId: r.UserAccountID,
      telNo: r.TelNo,
      email: r.Email,
      passengerFirstName: r.PassengerFirstName,
      passengerLastName: r.PassengerLastName,
      problemType: r.ProblemType,
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

export async function POST(req: NextRequest) {
  const session = await getServerSession(nextAuthOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.AUTHENTICATION },
      { status: 401 }
    );
  }

  const userAccountId = String(session.user.id);
  const body = await req.json();
  const {
    description,
    paymentId,
    attachment,
    telno,
    email,
    passengerFirstName,
    passengerLastName,
    priority,
    problemType
  } = body;
  console.log(email)

  if (
    !description || !paymentId || !telno || !email || !passengerFirstName || !passengerLastName
    || !problemType
  ) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.MISSING_PARAMETER },
      { status: 400 }
    );
  }

  try {
    // Create report
    const report = await prisma.report.create({
      data: {
        ReportID: crypto.randomUUID(),
        ReportDescription: description,
        PaymentID: paymentId,
        Attachment: attachment || "",
        UserAccountID: userAccountId,
        TelNo: telno,
        Email: email,
        PassengerFirstName: passengerFirstName,
        PassengerLastName: passengerLastName,
        ProblemType: problemType,
        Priority: (priority as ReportPriorityEnum) || ReportPriorityEnum.NORMAL,
      },
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (err) {
    console.error("Error creating report:", err);
    return NextResponse.json(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  // Authentication
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.AUTHENTICATION },
      { status: 401 }
    );
  }

  const adminAccountId = String(session.user.id);

  // Verify admin
  const admin = await prisma.admin.findUnique({
    where: { AdminAccountID: adminAccountId },
  });
  if (!admin) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.PERMISSION },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { reportID, status } = body as {
    reportID: string;
    status: ReportStatusEnum;
  };

  if (!reportID || !status) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.MISSING_PARAMETER },
      { status: 400 }
    );
  }

  if (!Object.values(ReportStatusEnum).includes(status as ReportStatusEnum)) {
    return NextResponse.json(
      { success: false, message: "Invalid status value." },
      { status: 400 }
    );
  }

  try {
    const report = await prisma.report.findUnique({
      where: { ReportID: reportID },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, message: ErrorMessages.NOT_FOUND },
        { status: 404 }
      );
    }

    const updatedReport = await prisma.report.update({
      where: { ReportID: reportID },
      data: { Status: status },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Report status updated successfully.",
        data: updatedReport
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating report status:", err);
    return NextResponse.json(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
  }
}