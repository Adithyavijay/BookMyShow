// pages/seats/[id].tsx
'use client'
import { useSearchParams } from 'next/navigation';
import SeatSelection from '@/modules/user/seat-selection/components/SeatSelection';

const SeatsPage = ({ params }: { params: { showtimeId: string } }) => {
  
  const searchParams = useSearchParams();
  const quantity = searchParams.get('quantity');

  if (!quantity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <SeatSelection showtimeId={params.showtimeId} quantity={parseInt(quantity, 10)} />
    </div>
  );
};

export default SeatsPage;