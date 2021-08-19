import { slugify } from "tropicalia/utils/slugify";
import * as collectionUtils from "tropicalia/cms/collection-utils";
import { pages } from "app/url";
import paths from "app/admin/paths.json";
import type { BlogPost } from "app/admin/blog-post";

export {
  default,
  getStaticProps,
  changeFrequency,
  disallow,
  getLastModificationDate,
  priority,
} from "./index";

export const getStaticPaths = pages.blog.getStaticPaths(async () => {
  const postsPath = await collectionUtils.useCollectionFolder(paths.posts);
  const posts = await collectionUtils.getCollectionFolder<BlogPost>(postsPath);
  const tags = [...new Set(posts.map(({ data: { tags } }) => tags).flat())];

  return tags.map((tag) => ({ tag: slugify(tag) }));
});