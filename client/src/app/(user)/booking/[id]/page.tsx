import React from 'react';
import BookingPage from '@/modules/user/booking/components/Booking';

export default async function page({ params }: { params: { id: string } }) {  
  return <BookingPage id={params.id} />;
}