import AssetContent from '@/widgets/asset/AssetContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export default function AssetPage() {
  return <AuthGuard><AssetContent /></AuthGuard>;
}
