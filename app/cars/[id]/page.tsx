import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import CarModel from "@/models/Car";
import CarDetails from "@/components/CarDetails";
import RecentlyViewedTracker from "./RecentlyViewedTracker";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getCar(id: string) {
  try {
    await connectDB();
    const car = await CarModel.findById(id).lean();
    if (!car) return null;
    return JSON.parse(JSON.stringify(car));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) return { title: "Car Not Found" };

  return {
    title: `${car.title} - carKharedo`,
    description: car.description || `Buy ${car.title} at the best price`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) notFound();

  return (
    <>
      <RecentlyViewedTracker carId={car._id} />
      <CarDetails car={car} />
    </>
  );
}
