import * as netlifyCmsUtils from "@egvelho/next-material/netlify-cms/utils";
import { slugify } from "@egvelho/next-material/utils/slugify";
import { pages, PostType } from "app/api";
import { env } from "app/env";

export { Blog as default } from "app/blog/blog";

const postsPath = "app/blog/posts";
const postsApiPath = "public/static-api/posts";
const postsByTagApiPath = "public/static-api/posts-by-tag";

export const getStaticProps = pages.blog.getStaticProps(
  async ({ tag } = {}) => {
    if (tag === undefined) {
      return writeChunksThenGetAllPosts();
    } else {
      return writePostsForTagThenGet(tag);
    }
  }
);

async function writeChunksThenGetAllPosts() {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.map(({ data: { tags } }) => tags).flat())];

  const postsChunks = await netlifyCmsUtils.chunkItems(posts, env().pagination);

  await netlifyCmsUtils.deleteFilesThenRecreateFolder(postsApiPath);
  await netlifyCmsUtils.writeChunksToFolder(postsApiPath, postsChunks);

  return {
    tags,
    postsLength: posts.length,
    posts: posts
      .slice(0, env().pagination)
      .map(({ data: { content, ...data }, slug }) => ({
        ...data,
        slug,
      })),
  };
}

async function writePostsForTagThenGet(initialTag: string) {
  const posts = await getAllPosts();
  const allTags = [...new Set(posts.map(({ data: { tags } }) => tags).flat())];

  const tagsMap = allTags.reduce((stack, tag) => {
    stack[slugify(tag)] = tag;
    return stack;
  }, {} as { [key: string]: string });

  const postsForTag = posts.filter(({ data: { tags } }) =>
    tags.includes(tagsMap[initialTag])
  );

  await netlifyCmsUtils.createFolderIfNotExists(postsByTagApiPath);
  await netlifyCmsUtils.writeItemsToFile(
    `${postsByTagApiPath}/${initialTag}.json`,
    postsForTag
  );

  const tags = [
    ...new Set(postsForTag.map(({ data: { tags } }) => tags).flat()),
  ];

  return {
    tags,
    initialTag: tagsMap[initialTag],
    postsLength: postsForTag.length,
    posts: postsForTag.map(({ data: { content, ...data }, slug }) => ({
      ...data,
      slug,
    })),
  };
}

async function getAllPosts() {
  const posts = await netlifyCmsUtils.getItems<PostType>(postsPath);
  const sortByMostRecentPosts = netlifyCmsUtils.sortByMostRecent<PostType>(
    ({ data: { publishDate } }) => new Date(publishDate ?? 0)
  );

  return posts.sort(sortByMostRecentPosts);
}

export const priority = pages.index.priority(0.5);
export const disallow = pages.index.disallow(false);
export const changeFrequency = pages.index.changeFrequency("daily");
export const getLastModificationDate = pages.index.getLastModificationDate(
  async () => new Date()
);
