"use client"
import React, { useEffect, useState } from 'react';
import useBookRoom from '../../../hooks/useBookRoom';
import { useStripe, useElements, AddressElement, PaymentElement } from '@stripe/react-stripe-js';
import { useToast } from '../ui/use-toast';
import { Separator } from '../ui/separator';
import moment from 'moment';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { Booking } from '@prisma/client';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';

type Props = {
  clientSecret: string,
  handleSetPaymentSuccess: (value: boolean) => void;
};

interface DateRangesType {
  startDate: Date,
  endDate: Date,
};

function hasOverlap(startDate: Date, endDate: Date, dateRanges: DateRangesType[]) {
  const targetInterval = { start: startOfDay(new Date(startDate)), end: endOfDay(new Date(endDate))};

  for(const range of dateRanges) {
    const rangeStart = startOfDay(new Date(startDate));
    const rangeEnd = endOfDay(new Date(endDate));

    if(
      isWithinInterval(targetInterval.start, {start: rangeStart, end: rangeEnd}) ||  isWithinInterval(targetInterval.start, {start: rangeStart, end: rangeEnd}) || (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ){
      return true;
    }
  };
  return false;
};

const RoomPaymentForm = ({ clientSecret, handleSetPaymentSuccess }: Props) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return
    }
    if (!clientSecret) {
      return
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    };

    try {
      // date overlap
      const  bookings = await axios.get(`/api/booking/${bookingRoomData.room.id}`)

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        }
      });

      const overlapFound = hasOverlap(bookingRoomData.startDate, bookingRoomData.endDate, roomBookingDates);

      if(overlapFound) {
        setIsLoading(false);
        return toast({
          variant: 'destructive',
          description: "Oops! Some of the days your are trying to book have already been reserved. Please go back an select different dates or rooms.!"
        });
      };
      
      stripe.confirmPayment({ elements, redirect: 'if_required' }).then((result: any) => {
        if (!result.error) {
          axios.patch(`/api/booking/${result.paymentIntent.id}`).then((res) => {
            toast({
              variant: 'success',
              description: "Room reserved!"
            });
            router.refresh();
            resetBookRoom();
            handleSetPaymentSuccess(true);
            setIsLoading(false);
          }).catch((error: any) => {
            toast({
              variant: 'destructive',
              description: "Something went wrong!"
            });
            setIsLoading(false)
          });
        } else {
          setIsLoading(false);
        };
      });
    } catch (error: any) {
      setIsLoading(false);
    }
  }

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate) return <div className="">Error: Missing reservation date...</div>

  const startDate = moment(bookingRoomData?.startDate).format("MMMM Do YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("MMMM Do YYYY");

  return (
    <form onSubmit={handleSubmit} id='payment-form'>
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement options={{
        mode: 'billing',
      }} />
      <h2 className="font-semibold mt-4 text-lg">Payment Information</h2>
      <PaymentElement id='payment-element' options={{ layout: 'tabs ' }} />
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
          <div className="">You will check-in on {startDate} at 5PM</div>
          <div className="">You will check-in on {endDate} at 5PM</div>
          {bookingRoomData?.breakFastIncluded && <div className="">You will be served breakFast each day at 8AM</div>}
        </div>

        <Separator />
        <div className="font-bold text-lg mb-4">
          {bookingRoomData?.breakFastIncluded && <div className="mb-2">BreakFast Price: ${bookingRoomData.room.breakFastPrice}</div>}
          Total Price: ${bookingRoomData?.totalPrice}
        </div>

        {isLoading && <Alert className=" bg-indigo-600 text-white">
          <Terminal className=" h-4 w-4 stroke-white" />
          <AlertTitle>Payment Processing...</AlertTitle>
          <AlertDescription>
            Your hotel was created successfully
            <div className="">Please stay on this page as we process your payment</div>
          </AlertDescription>
        </Alert>}

      </div>
      <Button disabled={isLoading}>{isLoading ? 'Processing Payment..' : "pay Now"}</Button>
    </form>
  )
}

export default RoomPaymentForm