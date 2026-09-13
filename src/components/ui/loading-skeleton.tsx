import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";

interface LoadingSkeletonProps {
  className?: string;
}

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton = ({ className, style }: SkeletonProps) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} style={style} />
);

export const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => (
  <div className={cn("space-y-4", className)}>
    <Skeleton className="h-8 w-3/4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  </div>
);

export const CardLoadingSkeleton = ({ className }: LoadingSkeletonProps) => (
  <Card className={cn("", className)}>
    <CardHeader>
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardContent>
  </Card>
);

export const TableLoadingSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-3">
    {/* Table header */}
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
    {/* Table rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const ChartLoadingSkeleton = ({ className }: LoadingSkeletonProps) => (
  <Card className={cn("", className)}>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
    </CardHeader>
    <CardContent>
      <div className="h-64 w-full flex items-end justify-between px-4 pb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-6" 
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

export { Skeleton };