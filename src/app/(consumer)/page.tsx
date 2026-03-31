import { ConsumerHero } from "@/components/consumer/ConsumerHero";
import { DealFeed, SerializedDeal } from "@/components/consumer/DealFeed";
import { getLiveDeals } from "@/lib/queries";

function serializeDeal(deal: Awaited<ReturnType<typeof getLiveDeals>>[number]): SerializedDeal {
  return {
    id: deal.id,
    startTime: deal.startTime.toISOString(),
    endTime: deal.endTime.toISOString(),
    price: deal.price,
    discountPercent: deal.discountPercent,
    status: deal.status,
    salon: {
      id: deal.salon.id,
      name: deal.salon.name,
      city: deal.salon.city,
      address: deal.salon.address,
      rating: deal.salon.rating,
      distanceKm: deal.salon.distanceKm,
    },
    service: {
      id: deal.service.id,
      name: deal.service.name,
      durationMin: deal.service.durationMin,
      basePrice: deal.service.basePrice,
    },
  };
}

export default async function HomePage() {
  const deals = await getLiveDeals();

  return (
    <main className="space-y-6">
      <ConsumerHero />
      <DealFeed deals={deals.map(serializeDeal)} />
    </main>
  );
}
