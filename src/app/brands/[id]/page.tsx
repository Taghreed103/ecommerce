import { Suspense } from "react";
import BrandDetails from "./_components/BrandDetails";
import { Metadata } from "next";

interface BrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Brand Details - Ecommerce App",
  description: "View brand details and products",
};

export default async function BrandPage({ params }: BrandPageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center">Loading brand...</div>}>
        <BrandDetails brandId={id} />
      </Suspense>
    </div>
  );
}
