import { queryOptions } from '@tanstack/react-query';
import { getMasterDataApi } from '@/entities/master-data/api/master-data-api';

export const masterDataQueries = {
  all: () => ['master-data'] as const,
  data: (token: string) =>
    queryOptions({
      queryKey: [...masterDataQueries.all()],
      queryFn: () => getMasterDataApi(token),
      staleTime: 1000 * 60 * 60,
    }),
};
