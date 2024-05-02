import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params} : {params: { Id: string}}) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.Id) {
            return new NextResponse('Payment Intent Id is required', { status: 400 })
        }

        const booking = await prismadb.booking.update({
            where: {
                paymentIntentId: params.Id,
            },
            data: { paymentStatus: true },
        });
        return NextResponse.json(booking);
    } catch (error) {
        console.log('Error at /api/booking/Id UPDATE', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
};


export async function DELETE(req: Request, { params} : {params: { Id: string}}) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.Id) {
            return new NextResponse('Booking Id is required', { status: 400 })
        }

        const booking = await prismadb.booking.delete({
            where: {
                id: params.Id,
            },
        });
        return NextResponse.json(booking);
    } catch (error) {
        console.log('Error at /api/room/Id DELETE', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
};   

export async function GET(req: Request, { params} : {params: { Id: string}}) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.Id) {
            return new NextResponse('Hotel Id is required', { status: 400 })
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const bookings = await prismadb.booking.findMany({
            where: {
                paymentStatus: true,
                roomId: params.Id,
                endDate: {
                    gt: yesterday,
                },
            },
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.log('Error at /api/room/Id GET', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
};   