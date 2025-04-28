'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { formatDistanceToNow, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { postsService } from '@/services/posts';
import toast from 'react-hot-toast';

interface PostDetailProps {
  slug: string;
}

export function PostDetail({ slug }: PostDetailProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsService.getPostBySlug(slug),
  });

  const deleteMutation = useMutation({
    mutationFn: () => postsService.deletePost(slug),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      router.push('/');
    },
    onError: () => {
      toast.error('Delete post failed. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !post?.data) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }


  const postData = post && post.data

  const isAuthor = user?.id === postData.user?.id;

  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{postData.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {isValid(new Date(postData.createdAt))
                ? formatDistanceToNow(new Date(postData.createdAt), {
                    addSuffix: true,
                  })
                : 'Not Data'}
            </span>
          </div>
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/posts/edit/${postData.slug}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post and all associated comments.
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
        <h1 className="text-3xl md:text-4xl font-bold">{postData.title}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium">
              {postData.user?.name || 'Anonymous'}
            </span>
          </div>
        </div>
      </div>

      {postData.imageUrl && (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src={postData.imageUrl || '/placeholder.svg'}
            alt={postData.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {postData.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
