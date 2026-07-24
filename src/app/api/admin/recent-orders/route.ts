import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { unauthorized } from '@/lib/apiErrors';

export async function GET(req: NextRequest) {
  try {
    if (!(await requireAdmin(req))) return unauthorized();

    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Recent orders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
