import prisma from "@/db";
import type { Prisma } from "@/src/generated/prisma";
import { ReportPriorityEnum, ReportStatusEnum } from "@/src/generated/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { ReportErrorType } from "@/src/enums/ReportErrorTypes";
import { nextAuthOptions } from "@/src/lib/auth";

/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: List reports (admin only)
 *     description: Retrieve reports optionally filtered by status and priority. Requires admin authentication via cookie session.
 *     tags:
 *       - Reports
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter by report status (e.g. OPEN, RESOLVED)
 *         required: false
 *         schema:
 *           type: string
 *       - name: priority
 *         in: query
 *         description: Filter by priority (NORMAL or HIGH)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       bookingID:
 *                         type: string
 *                       description:
 *                         type: string
 *                       attachment:
 *                         type: string
 *                       status:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       userAccountId:
 *                         type: string
 *                       telNo:
 *                         type: string
 *                       email:
 *                         type: string
 *                       passengerFirstName:
 *                         type: string
 *                       passengerLastName:
 *                         type: string
 *                       problemType:
 *                         type: string
 *             example:
 *               success: true
 *               data:
 *                 - id: "rep_550e8400-e29b-41d4-a716-446655440000"
 *                   bookingID: "pay_550e8400-e29b-41d4-a716-446655440000"
 *                   description: "Baggage missing"
 *                   attachment: "https://example.com/image.png"
 *                   status: "OPEN"
 *                   priority: "NORMAL"
 *                   submittedAt: "2025-11-15T10:00:00.000Z"
 *                   updatedAt: "2025-11-15T10:00:00.000Z"
 *                   userAccountId: "123e4567-e89b-12d3-a456-426614174000"
 *                   telNo: "+66812345678"
 *                   email: "user@example.com"
 *                   passengerFirstName: "John"
 *                   passengerLastName: "Doe"
 *                   problemType: "BAGGAGE_LOST"
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - admin access required
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Submit a new report (user)
 *     description: Create a new report for a booking. User must be authenticated via cookie session.
 *     tags:
 *       - Reports
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - paymentId
 *               - telno
 *               - email
 *               - passengerFirstName
 *               - passengerLastName
 *               - problemType
 *             properties:
 *               description:
 *                 type: string
 *               paymentId:
 *                 type: string
 *               attachment:
 *                 type: string
 *               telno:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               passengerFirstName:
 *                 type: string
 *               passengerLastName:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [NORMAL, HIGH]
 *               problemType:
 *                 type: string
     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - booking does not belong to user
 *       404:
 *         description: Booking not found
 *       409:
 *         description: Duplicate report for booking
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update report status (admin)
 *     description: Change the status of a report. Requires admin authentication.
 *     tags:
 *       - Reports
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportID
 *               - status
 *             properties:
 *               reportID:
 *                 type: string
 *               status:
 *                 type: string
 *                 description: One of the ReportStatusEnum values
     responses:
 *       200:
 *         description: Report status updated successfully
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin required
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */

export async function GET(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);

    //Check authentication
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 },
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
            { status: 403 },
        );
    }

    const url = new URL(req.url);
    //Optional filters
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority"); // "NORMAL" | "HIGH"

    const where: Prisma.ReportWhereInput = {};

    if (
        status &&
        Object.values(ReportStatusEnum).includes(status as ReportStatusEnum)
    ) {
        where.Status = status as ReportStatusEnum;
    }

    if (
        priority &&
        Object.values(ReportPriorityEnum).includes(
            priority as ReportPriorityEnum,
        )
    ) {
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
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    } catch (err: unknown) {
        console.error("Error fetching reports:", err);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 },
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
        problemType,
    } = body;
    console.log(email);

    if (
        !description ||
        !paymentId ||
        !telno ||
        !email ||
        !passengerFirstName ||
        !passengerLastName ||
        !problemType
    ) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.MISSING_PARAMETER },
            { status: 400 },
        );
    }

    try {
        // Check if a report already exists for this PaymentID
        const existingReport = await prisma.report.findUnique({
            where: { PaymentID: paymentId },
        });

        if (existingReport) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A report has already been submitted for this booking ID. Please contact support if you need to update your existing report.",
                    errorCode: ReportErrorType.DUPLICATE_REPORT,
                },
                { status: 409 }, // 409 Conflict
            );
        }

        // Verify that the payment/booking exists
        const payment = await prisma.payment.findUnique({
            where: { PaymentID: paymentId },
        });

        if (!payment) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The booking ID you entered does not exist. Please check your booking ID and try again.",
                    errorCode: ReportErrorType.INVALID_BOOKING_ID,
                },
                { status: 404 },
            );
        }

        // Verify that the payment belongs to the user by checking Purchase records
        const userPurchase = await prisma.purchase.findFirst({
            where: {
                PaymentID: paymentId,
                UserAccountID: userAccountId,
            },
        });

        if (!userPurchase) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This booking ID does not belong to your account. Please verify the booking ID.",
                    errorCode: ReportErrorType.UNAUTHORIZED_BOOKING,
                },
                { status: 403 },
            );
        }

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
                Priority:
                    (priority as ReportPriorityEnum) ||
                    ReportPriorityEnum.NORMAL,
            },
        });

        return NextResponse.json(
            { success: true, data: report },
            { status: 201 },
        );
    } catch (err: unknown) {
        console.error("Error creating report:", err);

        // Handle Prisma-specific errors
        if (err && typeof err === "object" && "code" in err) {
            const prismaError = err as { code: string };
            if (prismaError.code === "P2002") {
                // Unique constraint violation
                return NextResponse.json(
                    {
                        success: false,
                        message: "A report already exists for this booking ID.",
                        errorCode: ReportErrorType.DUPLICATE_REPORT,
                    },
                    { status: 409 },
                );
            } else if (prismaError.code === "P2003") {
                // Foreign key constraint violation
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid booking ID or user account.",
                        errorCode: ReportErrorType.INVALID_REFERENCE,
                    },
                    { status: 400 },
                );
            } else if (prismaError.code === "P2025") {
                // Record not found
                return NextResponse.json(
                    {
                        success: false,
                        message: "The booking ID does not exist in our system.",
                        errorCode: ReportErrorType.BOOKING_NOT_FOUND,
                    },
                    { status: 404 },
                );
            }
        }

        // Generic error
        return NextResponse.json(
            {
                success: false,
                message:
                    "An error occurred while submitting your report. Please try again later.",
                errorCode: ReportErrorType.SERVER_ERROR,
            },
            { status: 500 },
        );
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);

    // Authentication
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 },
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
            { status: 403 },
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
            { status: 400 },
        );
    }

    if (!Object.values(ReportStatusEnum).includes(status as ReportStatusEnum)) {
        return NextResponse.json(
            { success: false, message: "Invalid status value." },
            { status: 400 },
        );
    }

    try {
        const report = await prisma.report.findUnique({
            where: { ReportID: reportID },
        });

        if (!report) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.NOT_FOUND },
                { status: 404 },
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
                data: updatedReport,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("Error updating report status:", err);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
