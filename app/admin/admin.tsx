import { NetlifyCms } from "tropicalia/cms/netlify-cms";
import app from "app.json";
import { pages } from "app/url";
import { siteMetadata } from "./site-metadata/site-metadata";
import { homePage } from "./home-page/home-page";
import { blogPage } from "./blog-page/blog-page";
import { blogPost } from "./blog-post";

export const admin = pages.admin.page(() => {
  return (
    <NetlifyCms
      locale={app.lang}
      backend={{
        name: "git-gateway",
      }}
      collections={[siteMetadata, homePage, blogPage, blogPost.collection]}
    />
  );
});
