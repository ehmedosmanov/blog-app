import { PostForm } from "@/components/posts/PostForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>Update your post content, title, or category</CardDescription>
        </CardHeader>
        <CardContent>
          <PostForm slug={params.slug} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}
