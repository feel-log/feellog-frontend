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
    id: 'salary',
    label: '급여',
    color: '#13278A',
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
    id: 'allowance',
    label: '용돈',
    color: '#FFDB72',
    total: 6800000,
    records: [],
  },
  {
    id: 'side',
    label: '부수입',
    color: '#58E1B6',
    total: 5000000,
    records: [],
  },
  {
    id: 'bonus',
    label: '상여금',
    color: '#FF8C19',
    total: 1760000,
    records: [],
  },
  {
    id: 'finance',
    label: '금융 수입',
    color: '#64A2FF',
    total: 0,
    records: [],
  },
  {
    id: 'etc',
    label: '기타',
    color: '#CACDD2',
    total: 0,
    records: [],
  },
];

export function getTotalAsset(): number {
  return ASSET_CATEGORIES.reduce((sum, c) => sum + c.total, 0);
}

export function getAssetCategory(id: string): AssetCategory | undefined {
  return ASSET_CATEGORIES.find((c) => c.id === id);
}
