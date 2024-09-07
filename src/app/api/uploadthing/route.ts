import { createRouteHandler } from "uploadthing/next";

import { imageFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: imageFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
