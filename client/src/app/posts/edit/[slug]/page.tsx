import { PostForm } from '@/components/posts/PostForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Params = Promise<{ slug: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Update your post content, title, or category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm slug={slug} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}
