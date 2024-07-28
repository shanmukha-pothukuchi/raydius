import { signal } from "@preact/signals-react";
import { PostType } from "~/components/posts";

export const postTypeSignal = signal<"All" | PostType>("Room");
