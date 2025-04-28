'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Heart, Edit, Trash2, User, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/hooks/use-auth';
import type { Comment } from '@/services/comment/types';
import { commentsService } from '@/services/comment';
import toast from 'react-hot-toast';
import {
  type CommentLike,
  commentLikesService,
} from '@/services/comment-likes';
import { CommentForm } from '../CommentForm';

interface CommentItemProps {
  comment: Comment;
  postSlug: string;
}

type LikeResult = CommentLike | void;

export function CommentItem({ comment, postSlug }: CommentItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => commentsService.deleteComment(comment.id),
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['comments', postSlug],
      });
    },
    onError: () => {
      toast.error('Failed when deleting comment');
    },
  });

  const likeMutation = useMutation<
    LikeResult,
    Error,
    { currentlyLiked: boolean }
  >({
    mutationFn: async ({ currentlyLiked }): Promise<LikeResult> => {
      if (currentlyLiked) {
        await commentLikesService.unlikeComment(comment.id);
        return;
      } else {
        return commentLikesService.likeComment(comment.id);
      }
    },
    onMutate: ({ currentlyLiked }) => {
      setIsLiked(!currentlyLiked);
      setLikeCount(currentlyLiked ? likeCount - 1 : likeCount + 1);
    },
    onError: (error, variables) => {
      const { currentlyLiked } = variables;
      setIsLiked(currentlyLiked);
      setLikeCount(currentlyLiked ? likeCount : likeCount - 1);
      toast.error('Error when liking or disliking the comment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', postSlug],
      });
    },
  });

  const handleLikeClick = () => {
    if (!user) {
      toast.error('Please login for liking comment');
      return;
    }

    likeMutation.mutate({ currentlyLiked: isLiked });
  };

  const isAuthor = user?.id === comment.user?.id;
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <CommentForm
          postSlug={comment.post?.id.toString() || ''}
          commentId={comment.id}
          initialContent={comment.content}
          isEditing={true}
          onCommentAdded={() =>
            queryClient.invalidateQueries({ queryKey: ['comment', postSlug] })
          }
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your comment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <p className="text-sm">{comment.content}</p>
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs flex items-center gap-1"
          onClick={handleLikeClick}>
          <Heart
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
          />
          <span>{likeCount}</span>
        </Button>
      </div>
    </div>
  );
}
