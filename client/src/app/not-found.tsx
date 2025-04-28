'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />

      <h1 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h1>

      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Sorryyy page not found please try again
      </p>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>

        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
