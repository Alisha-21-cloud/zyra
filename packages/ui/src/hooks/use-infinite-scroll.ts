import { useCallback, useEffect, useRef } from "react"

interface UseInfiniteScrollProps {
    status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage",
    loadMore: (numItems: number) => void;
    loadSize?: number;
    observerEnabled?: boolean;
}

export const useInfiniteScroll = ({
    status, 
    loadMore, 
    loadSize = 10, 
    observerEnabled = true }: UseInfiniteScrollProps) => {
    const topElementRef = useRef<HTMLDivElement>(null);

    const handleLoadMore = useCallback(() => {
        if (status === "CanLoadMore") {
            loadMore(loadSize);
        }

    }, [status, loadMore, loadSize]);

    useEffect(() => {
        const topElement = topElementRef.current;

        if (!(topElement && observerEnabled)) {
            return;
        } 

        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
                handleLoadMore();
            }
        },{
            threshold: 0.1,
        });

        observer.observe(topElement);

        return () => {
            observer.disconnect();
        }
    }, [handleLoadMore, observerEnabled]);

    return {
        topElementRef,
        handleLoadMore,
        canLoadMore: status === "CanLoadMore",
        isLoadingMore: status === "LoadingMore",
        isLoadingFirstPage: status === "LoadingFirstPage",
        isExhausted: status === "Exhausted",
    }
}
