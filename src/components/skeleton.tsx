import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonLoader({
  height,
  width,
  count,
  className
}: {
  height: number;
  width: number;
  count: number;
  className: string
}) {
  return (
    <SkeletonTheme baseColor='#fff' highlightColor='#A6C5A7'>
      <p className="flex mb-2">
        <Skeleton count={count} height={height} width={width} containerClassName={className}/>
      </p>
    </SkeletonTheme>
  );
}
