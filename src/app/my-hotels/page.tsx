import React from 'react'
import { getHotelsByUserId } from '../../../actions/getHotelsByUserId'
import HotelList from '@/components/hotel/HotelList'

const MyHotel = async () => {
    const hotels = await getHotelsByUserId();

    if(!hotels) return <div className="">No hotels found!</div>
    return (
        <div className="">
            <div className='text-2xl font-semibold'>Here are your Properties</div>
            <HotelList hotels={hotels} />
        </div>
    )
}

export default MyHotel