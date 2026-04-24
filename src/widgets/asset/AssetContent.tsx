'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/shared/ui/Footer';
import { ASSET_CATEGORIES, getTotalAsset } from '@/shared/constants/assetData';

export default function AssetContent() {
  const router = useRouter();
  const totalAsset = getTotalAsset();

  return (
    <div className="min-h-screen flex flex-col pb-32 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-bold">자산</h1>
        <button
          onClick={() => router.push('/record?type=asset')}
          className="flex items-center justify-center p-2 cursor-pointer text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Image src="/svg/icon_plus_black.svg" alt="add" width={24} height={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {/* Total Asset Section */}
        <div className="mb-8 border-b border-gray-200">
          <p className="mb-2 text-sm text-gray-600">총 자산</p>
          <h2 className="pb-4 text-2xl font-bold text-gray-800">
            {totalAsset.toLocaleString()}원
          </h2>
        </div>

        {/* Asset Categories or Empty State */}
        {totalAsset === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="mb-2 text-lg font-medium text-gray-800">아직 등록된 자산이 없어요</h3>
            <p className="text-sm text-gray-500">자산을 등록하고 한눈에 관리해보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ASSET_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(`/asset/${category.id}`)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900">{category.label}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{category.total.toLocaleString()}원</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
