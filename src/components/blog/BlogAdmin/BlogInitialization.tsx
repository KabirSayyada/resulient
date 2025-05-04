
import { InitializeBlogCategories } from '@/components/blog/InitializeBlogCategories';
import { InitializeBlogPosts } from '@/components/blog/InitializeBlogPosts';

export function BlogInitialization() {
  return (
    <div className="space-y-6">
      <InitializeBlogCategories />
      <InitializeBlogPosts />
    </div>
  );
}
