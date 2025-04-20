import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

export const LoadingTextSwap = ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => {
  return (
    <div className="grid items-center justify-items-center">
      <div className={cn('col-start-1 row-start-1', isLoading ? 'invisible' : 'visible')}>{children}</div>
      <div className={cn('col-start-1 row-start-1', isLoading ? 'visible' : 'invisible')}>
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
};
