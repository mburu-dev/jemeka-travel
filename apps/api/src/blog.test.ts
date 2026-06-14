import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestDb, createTestCaller } from './test-utils';
import { blogPosts } from '@jemeka/db';

describe('Blog Router', () => {
  let db: any;
  let caller: any;

  beforeAll(async () => {
    db = await setupTestDb();
    
    await db.insert(blogPosts).values([
      {
        title: "Test Blog 1",
        slug: "test-blog-1",
        content: "Content 1",
        excerpt: "Excerpt 1",
        category: "news",
        isPublished: true,
      },
      {
        title: "Test Blog 2",
        slug: "test-blog-2",
        content: "Content 2",
        excerpt: "Excerpt 2",
        category: "tips",
        isPublished: true,
      },
      {
        title: "Unpublished Blog",
        slug: "unpublished-blog",
        content: "Draft",
        excerpt: "Draft",
        category: "news",
        isPublished: false,
      }
    ]);

    caller = await createTestCaller();
  });

  it('should list only published blogs', async () => {
    const blogs = await caller.blog.list();
    expect(blogs.length).toBe(2);
    expect(blogs.every((b: any) => b.isPublished)).toBe(true);
  });

  it('should filter blogs by category', async () => {
    const blogs = await caller.blog.list({ category: "news" });
    expect(blogs.length).toBe(1);
    expect(blogs[0].slug).toBe("test-blog-1");
  });

  it('should get blog by slug', async () => {
    const blog = await caller.blog.getBySlug({ slug: "test-blog-2" });
    expect(blog).toBeDefined();
    expect(blog?.title).toBe("Test Blog 2");
  });

  it('should return featured blogs (max 3 published)', async () => {
    const featured = await caller.blog.featured();
    expect(featured.length).toBeLessThanOrEqual(3);
    expect(featured.every((b: any) => b.isPublished)).toBe(true);
  });
});
