import { env } from "app/env";
import { generateAssets } from "@egvelho/next-meta/utils/generate-assets";
import { generateSitemap } from "@egvelho/next-meta/utils/generate-sitemap";
import { resizeImageAssets } from "@egvelho/next-meta/utils/resize-image-assets";

export async function scripts() {
  const loadedEnv = env();
  const outPath = "public";

  if (loadedEnv.nodeEnv === "production" || loadedEnv.runScriptsInDevelopment) {
    await Promise.all([
      loadedEnv.generateAssetsOnBuild
        ? generateAssets({ appPath: "app.json", outPath })
        : undefined,
      loadedEnv.resizeImageAssetsOnBuild
        ? resizeImageAssets({
            paths: [".next/static/images", "public/images"],
            size: 640,
          })
        : undefined,
      generateSitemap({
        mapPathToImport: (path) => import(`pages/${path}`),
        outPath,
      }),
    ]);
  }
}
