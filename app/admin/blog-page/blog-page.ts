import { collectionFiles } from "tropicalia/cms/collection";
import { blogMetadata } from "./blog-metadata";
import { blogStyle } from "./blog-style";

export const blogPage = collectionFiles({
  label: "Blog",
  collections: [blogMetadata, blogStyle],
});
