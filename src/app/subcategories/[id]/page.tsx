import SubcategoryDetails from "./_components/SubcategoryDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { id } = await params;
  
  return <SubcategoryDetails subcategoryId={id} />;
}
