import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => (
  <div className="bg-card border border-border overflow-hidden">
    <Skeleton className="aspect-[4/3] rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4 rounded-none" />
      <Skeleton className="h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-1/2 rounded-none" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-10 flex-1 rounded-none" />
        <Skeleton className="h-10 flex-1 rounded-none" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
