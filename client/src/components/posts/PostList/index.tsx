'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { postsService } from '@/services/posts';
import { PostCard } from '../PostCard';
import type { Post } from '@/services/posts/types';

interface PostListFilter {
  search: string;
  category: string;
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit: number;
}

export function PostList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category')?.toLowerCase() || '';

  const [filter, setFilter] = useState<PostListFilter>({
    search,
    category,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    page: 1,
    limit: 4,
  });

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      search,
      category,
      page: 1,
    }));
  }, [search, category]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', filter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await postsService.getPosts({
        search: filter.search,
        category: filter.category,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        limit: filter.limit,
        page: pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const metadata = lastPage.metadata;
      return metadata.currentPage < metadata.totalPages
        ? metadata.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const allPosts = data?.pages.flatMap((page) => page.data) || [];
  const totalPosts = data?.pages[0]?.metadata?.totalCount || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          Failed to load posts. Please try again.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          No posts found. Try adjusting your filters.
        </p>
        {(search || category) && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/')}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(search || category) && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {search && (
                <span>
                  Search: <strong>{search}</strong>
                </span>
              )}
              {search && category && <span> | </span>}
              {category && (
                <span>
                  Category: <strong>{category}</strong>
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            Clear
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm mb-8 text-muted-foreground">
          Showing {allPosts.length} of {totalPosts} posts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post: Post) => (
            <PostCard key={post?.id} post={post} />
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}>
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
