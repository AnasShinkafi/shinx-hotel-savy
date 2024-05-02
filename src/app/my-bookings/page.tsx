import MyBookingsClient from "@/components/booking/MyBookingsClient";
import { getBookingsByHotelOwnerId } from "../../../actions/getBookingsByHotelOwnerId"
import { getBookingsByHotelUserId } from "../../../actions/getBookingsByUserId";

const MyBookings = async () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();
  const bookingsIHaveMade = await getBookingsByHotelUserId();
  return (
    <div className='flex flex-col gap-10'>
        {!!bookingsIHaveMade?.length && <div className="">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">Here are bookings you have made.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map(booking => <MyBookingsClient booking={booking} key={booking.id} />)}
          </div>
        </div> }
        {!!bookingsFromVisitors?.length && <div className="">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">Here are bookings visitors have made on your properties.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map(booking => <MyBookingsClient booking={booking} key={booking.id} />)}
          </div>
        </div> }
    </div>
  )
}

export default MyBookings