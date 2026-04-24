export interface AssetRecord {
  date: string;
  amount: number;
  memo?: string;
}

export interface AssetCategory {
  id: string;
  label: string;
  color: string;
  total: number;
  records: AssetRecord[];
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: 'savings',
    label: '저축',
    color: '#13278a',
    total: 5400000,
    records: [
      { date: '4.20', amount: 50000 },
      { date: '4.17', amount: 20000 },
      { date: '4.16', amount: 50000 },
      { date: '4.15', amount: 3130000, memo: '월급/목돈 이체' },
      { date: '4.13', amount: 20000 },
      { date: '4.10', amount: 2130000, memo: '기존 저축 이동' },
    ],
  },
  {
    id: 'investment',
    label: '투자',
    color: '#F5A623',
    total: 6800000,
    records: [],
  },
  {
    id: 'insurance',
    label: '보험',
    color: '#4CAF50',
    total: 5000000,
    records: [],
  },
  {
    id: 'etc',
    label: '기타',
    color: '#9E9E9E',
    total: 1760000,
    records: [],
  },
];

export function getTotalAsset(): number {
  return ASSET_CATEGORIES.reduce((sum, c) => sum + c.total, 0);
}

export function getAssetCategory(id: string): AssetCategory | undefined {
  return ASSET_CATEGORIES.find((c) => c.id === id);
}
