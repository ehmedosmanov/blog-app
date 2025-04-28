import { CategoryFilter } from '@/components/posts/CategoryFilter';
import { PostList } from '@/components/posts/PostList';
import { SearchBar } from '@/components/posts/SearchBar';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to the Blog
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover interesting articles and share your thoughts
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="sticky top-20 space-y-6">
            <SearchBar />
            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              }>
              <CategoryFilter />
            </Suspense>
          </div>
        </div>

        <div className="md:w-3/4">
          <Suspense
            fallback={
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            }>
            <PostList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
