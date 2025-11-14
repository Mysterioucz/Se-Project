/**
 * @jest-environment node
 */
import { GET } from "@/src/app/api/v1/airlines/route";
import prisma from "@/db";
import { NextResponse } from "next/server";
import { ErrorMessages } from "@/src/enums/ErrorMessages";

/*
How to run test:
pnpm exec jest --coverage src/tests/airlines-get.test.ts --collectCoverageFrom="src/app/api/v1/airlines/route.ts"
*/

jest.mock("@/db", () => ({
  airline: {
    findMany: jest.fn(),
  },
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({ body, status: options?.status })),
  },
}));

describe("GET /api/v1/airlines", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("return 200 and list of airlines (success path)", async () => {
    // Arrange
    (prisma.airline.findMany as jest.Mock).mockResolvedValue([
      { AirlineName: "Thai Airways" },
      { AirlineName: "Bangkok Airways" },
    ]);

    // Act
    const response = await GET();

    // Assert
    expect(prisma.airline.findMany).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: true,
        data: [
          { AirlineName: "Thai Airways" },
          { AirlineName: "Bangkok Airways" },
        ],
      },
      { status: 200 }
    );
    expect(response.status).toBe(200);
  });

  test("return 404 when no airlines found", async () => {
    // Arrange
    (prisma.airline.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const response = await GET();

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: false, message: ErrorMessages.NOT_FOUND },
      { status: 404 }
    );
    expect(response.status).toBe(404);
  });

  test("return 500 when prisma throws error", async () => {
    // Arrange
    (prisma.airline.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

    // Act
    const response = await GET();

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
    expect(response.status).toBe(500);
  });
});
