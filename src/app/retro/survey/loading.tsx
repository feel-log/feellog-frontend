import PageHeader from '@/shared/ui/PageHeader';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="회고하기" backHref="/retro" />
    </div>
  );
}
