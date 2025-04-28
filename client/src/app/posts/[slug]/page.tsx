import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PostDetail } from '@/components/posts/PostDetail';
import { CommentSection } from '@/components/comments/CommentSection';
import { postsService } from '@/services/posts';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { slug } = await params;

    const post = await postsService.getPostBySlug(slug);
    return {
      title: post?.data.title,
      description: post?.data.content.slice(0, 160),
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

type Params = Promise<{ slug: string }>;

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <div className="space-y-8">
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail slug={slug} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<CommentSectionSkeleton />}>
            <CommentSection postSlug={slug} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function CommentSectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <div className="space-y-4 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
