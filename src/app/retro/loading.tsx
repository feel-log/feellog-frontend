import PageHeader from '@/shared/ui/PageHeader';

export default function Loading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <PageHeader title="회고하기" backHref="/" />
    </div>
  );
}
