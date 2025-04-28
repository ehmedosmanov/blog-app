'use client';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/services/posts/types';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/posts/${post?.slug}`)}
      className="overflow-hidden cursor-pointer flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={post?.imageUrl || '/placeholder.svg?height=200&width=400'}
          alt={post?.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{post?.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post?.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <Link href={`/posts/${post?.slug}`} className="group">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-3">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {post.user?.name || 'Anonymous'}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
