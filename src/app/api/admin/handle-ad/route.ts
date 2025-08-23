import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/server/db";
import { AD_STATUS } from "@prisma/client";
import { ALLOWED_REJECTION_REASONS } from "@/consts/admin";
import { deleteDiscordMessage } from "@/server/discord";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "must-be-logged-in" }, { status: 401 });
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "unauthorized-admin-only" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { adId, adStatus, rejectedFor } = body;

    // Validate required fields
    if (!adId || !adStatus) {
      return NextResponse.json(
        { error: "ad-id-and-status-required" },
        { status: 400 },
      );
    }

    // Validate adStatus
    if (!Object.values(AD_STATUS).includes(adStatus)) {
      return NextResponse.json({ error: "invalid-ad-status" }, { status: 400 });
    }

    // If rejecting, rejectedFor is required and must be a valid reason
    if (adStatus === AD_STATUS.REJECTED) {
      if (!rejectedFor) {
        return NextResponse.json(
          { error: "rejected-for-required-when-rejecting" },
          { status: 400 },
        );
      }

      if (!ALLOWED_REJECTION_REASONS.includes(rejectedFor)) {
        return NextResponse.json(
          { error: "invalid-rejection-reason" },
          { status: 400 },
        );
      }
    }

    // Check if ad exists
    const existingAd = await db.ad.findUnique({
      where: { id: adId },
      select: {
        id: true,
        adStatus: true,
        title: true,
        discordMessageId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingAd) {
      return NextResponse.json({ error: "ad-not-found" }, { status: 404 });
    }

    // Update ad status
    const updatedAd = await db.ad.update({
      where: { id: adId },
      data: {
        adStatus,
        rejectedFor: adStatus === AD_STATUS.REJECTED ? rejectedFor : null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        adStatus: true,
        rejectedFor: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Refund 1 token if rejected
    if (adStatus === AD_STATUS.REJECTED && updatedAd.user?.id) {
      // Only refund for Free tokens (adjust if you want to support Pro/Expert)
      const tokenStore = await db.adTokenStore.findUnique({
        where: {
          userId_tokenType: {
            userId: updatedAd.user.id,
            tokenType: "Free",
          },
        },
        select: { count: true, initialCount: true },
      });
      if (tokenStore && tokenStore.count < tokenStore.initialCount) {
        await db.adTokenStore.update({
          where: {
            userId_tokenType: {
              userId: updatedAd.user.id,
              tokenType: "Free",
            },
          },
          data: {
            count: { increment: 1 },
          },
        });
      }
      // Optionally: add a comment/log here for auditing
    }

    // Delete Discord message if present
    if (existingAd.discordMessageId) {
      await deleteDiscordMessage(existingAd.discordMessageId);
    }

    return NextResponse.json({
      message: "ad-status-updated-successfully",
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad status:", error);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}
