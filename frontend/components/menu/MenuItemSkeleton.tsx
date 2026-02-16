import { Skeleton } from '../ui/Skeleton';

export function MenuItemSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] w-full rounded-[30px] overflow-hidden">
                <Skeleton className="absolute inset-0 rounded-[30px]" />
                <Skeleton 
                    variant="circular" 
                    className="absolute top-3 left-3 w-6 h-6" 
                />
                <Skeleton 
                    variant="circular" 
                    className="absolute bottom-3 right-3 w-10 h-10" 
                />
            </div>
            <div className="px-1">
                <Skeleton variant="text" className="w-3/4 h-5 mb-1" />
                <Skeleton variant="text" className="w-full h-3 mb-1" />
                <Skeleton variant="text" className="w-1/2 h-3" />
            </div>
        </div>
    );
}
