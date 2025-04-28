'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { commentsService } from "@/services/comments-service"
// import { CommentForm } from "./comment-form"
// import { CommentItem } from "./comment-item"
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/hooks/use-auth';
import { commentsService } from '@/services/comment';
import { CommentForm } from '../CommentForm';
import { CommentItem } from '../CommentItem';

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [commentCount, setCommentCount] = useState(0);

  const {
    data: comments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['comments', postSlug],
    queryFn: async () => {
      const allComments = await commentsService.getCommentsByPostSlug(postSlug);
      return allComments;
    },
  });

  //   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
  //     queryKey: ["comments", postSlug],
  //     queryFn: ({ pageParam = 1 }) =>
  //       commentsService.getCommentsByPostSlug(postSlug, {
  //         page: pageParam,
  //         limit: 10,
  //         sortOrder: "DESC",
  //       }),
  //     getNextPageParam: (lastPage) => {
  //       const { currentPage, totalPages } = lastPage.metadata
  //       return currentPage < totalPages ? currentPage + 1 : undefined
  //     },
  //     onSuccess: (data) => {
  //       const totalCount = data.pages[0]?.metadata.totalCount || 0
  //       setCommentCount(totalCount)
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Error",
  //         description: "Failed to load comments. Please try again.",
  //         variant: "destructive",
  //       })
  //     },
  //   })

  const handleCommentAdded = () => {
    setCommentCount((prev) => prev + 1);
  };

  //   const comments = data?.pages.flatMap((page) => page.data) || []

  return (
    <div className="space-y-6" id="comments">
      <h2 className="text-2xl font-bold">
        Comments {commentCount > 0 && `(${commentCount})`}
      </h2>

      {user ? (
        <CommentForm postSlug={postSlug} onCommentAdded={handleCommentAdded} />
      ) : (
        <div className="bg-muted p-4 rounded-md text-center">
          <p className="text-muted-foreground">
            Please login to leave a comment.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            Failed to load comments. Please try again.
          </p>
          <Button variant="outline" className="mt-2" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : comments?.data.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments?.data.map((comment) => (
            <CommentItem
              key={comment.id}
              postSlug={postSlug}
              comment={comment}
            />
          ))}

          {/* {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}>
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Comments'
                )}
              </Button>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
