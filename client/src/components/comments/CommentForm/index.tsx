'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { commentsService } from '@/services/comment';
import toast from 'react-hot-toast';
import { commentSchema } from '@/schemas/comment';

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postSlug: string;
  commentId?: number;
  initialContent?: string;
  isEditing?: boolean;
  onCommentAdded?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  postSlug,
  commentId,
  initialContent = '',
  isEditing = false,
  onCommentAdded,
  onCancel,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      commentsService.createComment({
        content: data.content,
        postSlug: postSlug,
      }),
    onSuccess: () => {
      form.reset({ content: '' });
      toast.success('Comment added successfully');
      queryClient.invalidateQueries({ queryKey: ['comments', postSlug] });
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error('Failed when adding comment please try again');
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; content: string }) =>
      commentsService.updateComment(data.id, { content: data.content }),
    onSuccess: () => {
      toast.success('Comment updated successfully');
      if (onCommentAdded) {
        onCommentAdded();
      }
      if (onCancel) {
        onCancel();
      }
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error('Failed when updating comment please try again');
      setIsSubmitting(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'],
      });
    },
  });

  const onSubmit = (values: CommentFormValues) => {
    setIsSubmitting(true);
    if (isEditing && commentId) {
      updateMutation.mutate({ id: commentId, content: values.content });
    } else {
      createMutation.mutate({ content: values.content });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your comment here..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {isEditing && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Posting...'}
              </>
            ) : (
              <>{isEditing ? 'Update Comment' : 'Post Comment'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
