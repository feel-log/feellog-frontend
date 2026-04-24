import AssetDetailContent from '@/widgets/asset/AssetDetailContent';

interface AssetDetailPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { category } = await params;
  return <AssetDetailContent categoryId={category} />;
}
