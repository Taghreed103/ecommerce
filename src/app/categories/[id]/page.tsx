import { Suspense } from "react";
import CategoryDetails from "./_components/CategoryDetails";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Category Details - Ecommerce App",
  description: "View category details and products",
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="text-center">Loading category...</div></div>}>
      <CategoryDetails categoryId={id} />
    </Suspense>
  );
}
