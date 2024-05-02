import AddHotelForm from '@/components/hotel/AddHotelForm'
import React from 'react'
import { getHotelById } from '../../../../actions/getHotelById'
import { auth } from '@clerk/nextjs'

interface HotelPageProps {
    params: {
        hotelId: string
    }
}
const HotelId = async ({ params }: HotelPageProps) => {
    const hotel = await getHotelById(params.hotelId);
    const { userId } = auth();

    if(!userId) return <div className="">Not authenticated</div>
    
    if(hotel && hotel.userId !== userId) return <div className="">Access denied</div>
  return (
    <div className=''>
        <AddHotelForm hotel={hotel} />
    </div>
  )
}

export default HotelId