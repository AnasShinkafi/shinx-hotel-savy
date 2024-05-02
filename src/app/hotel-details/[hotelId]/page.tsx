import HotelDetailsClient from "@/components/hotel/HotelDetailsClient"
import { getHotelById } from "../../../../actions/getHotelById"
import { getBookings } from "../../../../actions/getBookings"

type Props = {
    params: {
        hotelId: string
    }
}

const page = async ({ params}: Props) => {
    const hotel = await getHotelById(params.hotelId);
    if(!hotel) return <div className="">Oops! Hotel with given Id not found.</div>
    const bookings = await getBookings(hotel.id);

  return (
    <div>
        <HotelDetailsClient hotel={hotel} bookings={bookings} />
    </div>
  )
}

export default page