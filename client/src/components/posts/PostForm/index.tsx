'use client';

import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ImagePlus } from 'lucide-react';
import { PostFormValues, postSchema } from '@/schemas/post';
import { postsService } from '@/services/posts';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/api/types';
import { Post } from '@/services/posts/types';
import { CATEGORIES } from '@/constants/posts';

interface PostFormProps {
  slug?: string;
  isEditing?: boolean;
}

export function PostForm({ slug, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      file: undefined,
    },
  });

  const { isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsService.getPostBySlug(slug || ''),
    enabled: isEditing && !!slug,
    onSuccess: (data: ApiResponse<Post>) => {
      form.reset({
        title: data.data.title,
        content: data.data.content,
        category: data.data.category,
      });
      if (data.data.imageUrl) {
        setImagePreview(data.data.imageUrl);
      }
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error('Operation failed, Please try again');
      router.push('/');
    },
  } as UseQueryOptions<ApiResponse<Post>, Error>);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => postsService.createPost(data),
    onSuccess: () => {
      toast.success('Post created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { slug: string; formData: FormData }) =>
      postsService.updatePost(data.slug, data.formData),
    onSuccess: () => {
      toast.success('Post updated successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push(`/posts/${slug}`);
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });

  const onSubmit = (data: PostFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);

    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0]);
    }

    if (isEditing && slug) {
      updateMutation.mutate({ slug, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingPost) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById('image-upload')?.click()
                      }
                      className="flex items-center gap-2">
                      <ImagePlus className="h-4 w-4" />
                      {isEditing ? 'Change Image' : 'Upload Image'}
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      {...fieldProps}
                    />
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          onChange(null);
                        }}>
                        Remove Image
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative h-[200px] w-full rounded-md overflow-hidden border">
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Recommended size: 1200x630px. Max size: 5MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEditing ? 'Update Post' : 'Create Post'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
