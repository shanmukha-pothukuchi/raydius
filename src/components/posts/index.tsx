import { z } from "zod";
import { Inputs } from "./inputs";
import { Mains } from "./main";
import { Sidebars } from "./sidebar";
import { postType } from "~/server/db/schema";
import { zodPostType } from "~/server/api/routers/post";

export type PostProps = {};

export type RoomProps = PostProps & {};
export type EventProps = PostProps & {};
export type BusinessProps = PostProps & {};

export type PostType = z.infer<typeof zodPostType>;

export const PostComponents: {
  [key in PostType]: {
    Main: React.ComponentType<RoomProps | EventProps | BusinessProps>;
    Sidebar: React.ComponentType<RoomProps | EventProps | BusinessProps>;
    Input: React.ComponentType;
  };
} = {
  Room: {
    Main: Mains.Room,
    Sidebar: Sidebars.Room,
    Input: Inputs.Room,
  },
  Event: {
    Main: Mains.Event,
    Sidebar: Sidebars.Event,
    Input: Inputs.Event,
  },
  Business: {
    Main: Mains.Business,
    Sidebar: Sidebars.Business,
    Input: Inputs.Business,
  },
} as const;
