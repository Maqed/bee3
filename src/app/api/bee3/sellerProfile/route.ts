import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth';
import { getUserById } from '@/actions/users';
import { db } from "@/server/db";
import { AdTiers } from '@prisma/client';

export async function GET() {
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "must-be-logged-in" });
    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "must-be-logged-in" });


    var sellerProfile = db.sellerProfile.findUnique({ where: { userId: user.id }, include: { ads: true, tokensStorage: true } });

    return NextResponse.json({ sellerProfile });
}

export async function POST(request: Request) {
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "must-be-logged-in" });
    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "must-be-logged-in" });

    var sellerProfile = await db.sellerProfile.create({
        data: {
            user: {
                connect: { id: user.id }
            },
            tokensStorage: {
                createMany: {
                    data: [
                        {
                            tokenType: AdTiers.Free,
                            count: 20
                        },
                        {
                            tokenType: AdTiers.Pro,
                            count: 3
                        },
                        {
                            tokenType: AdTiers.Expert,
                            count: 1
                        }
                    ]
                }
            },
            ads: {

            }
        },
        include: {
            ads: true,
            tokensStorage: true
        }
    });

    return NextResponse.json({ sellerProfile });
}