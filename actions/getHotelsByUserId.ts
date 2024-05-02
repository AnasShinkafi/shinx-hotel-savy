import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs";
import { hookPropertyMap } from "next/dist/server/require-hook";

export const getHotelsByUserId = async() => {
    try {
        const { userId } = auth();

        if(!userId) {
            throw new Error('Unauthorized');
        }

        const hotels = await prismadb.hotel.findMany({
            where: {
                userId, 
            },
            include: {
                rooms: true
            },
        });

        if(!hotels) return null;
        return hotels
    } catch (error: any) {
        throw new Error(error);
    }
};