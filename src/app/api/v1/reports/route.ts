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
  console.log("PASSED")

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
      adminAccountId: r.AdminAccountID,
      accountId: r.AccountID,
      telNo: r.TelNo,
      passengerName: r.PassengerName,
      creatorStatus: r.creator?.ReportStatus ?? null,
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
    paymentId,
    description,
    attachment,
    priority,
    adminAccountId,
    telNo,
    passengerName,
    accountId,
  } = body;

  if (!paymentId || !description || !adminAccountId || !accountId) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
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
        Attachment: attachment || null,
        UserAccountID: userAccountId,
        AdminAccountID: adminAccountId,
        AccountID: accountId,
        TelNo: telNo || "",
        PassengerName: passengerName || "",
      },
      include: { creator: true },
    });

    // Ensure report_To exists
    const existingRelation = await prisma.report_To.findUnique({
      where: {
        UserAccountID_AdminAccountID: {
          UserAccountID: userAccountId,
          AdminAccountID: adminAccountId,
        },
      },
    });

    if (!existingRelation) {
      await prisma.report_To.create({
        data: {
          UserAccountID: userAccountId,
          AdminAccountID: adminAccountId,
          ReportStatus: ReportStatusEnum.OPENED,
          // ReportPriority: (priority as ReportPriorityEnum) || ReportPriorityEnum.NORMAL,
        },
      });
    }

    const data = {
      id: report.ReportID,
      bookingID: report.PaymentID,
      description: report.ReportDescription,
      attachment: report.Attachment,
      status: ReportStatusEnum.OPENED,
      priority: (priority as ReportPriorityEnum) || ReportPriorityEnum.NORMAL,
      submittedAt: report.CreatedAt,
      updatedAt: report.UpdatedAt,
      userAccountId: report.UserAccountID,
      adminAccountId: report.AdminAccountID,
      accountId: report.AccountID,
      telNo: report.TelNo,
      passengerName: report.PassengerName,
      creatorStatus: report.creator?.ReportStatus ?? null,
    };

    return NextResponse.json({ success: true, data }, { status: 201 });
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
  const { userAccountId, status } = body;

  if (!userAccountId || !status) {
    return NextResponse.json(
      { success: false, message: "Missing required fields: userAccountId or status." },
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
    // Update only ReportStatus
    const existing = await prisma.report_To.findUnique({
      where: { UserAccountID_AdminAccountID: { UserAccountID: userAccountId, AdminAccountID: adminAccountId } },
    });

    if (existing) {
      await prisma.report_To.update({
        where: { UserAccountID_AdminAccountID: { UserAccountID: userAccountId, AdminAccountID: adminAccountId } },
        data: { ReportStatus: status as ReportStatusEnum },
      });
    } else {
      await prisma.report_To.create({
        data: {
          UserAccountID: userAccountId,
          AdminAccountID: adminAccountId,
          ReportStatus: status as ReportStatusEnum,
        },
      });
}

    return NextResponse.json(
      { success: true, message: "Report status updated successfully." },
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


