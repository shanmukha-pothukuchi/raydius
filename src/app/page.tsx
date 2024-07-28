"use client";

import PostTypeSelect from "~/components/component/PostTypeSelect";
import { Input } from "~/components/ui/input";

export default function Home() {
  return (
    <>
      <div className="flex gap-2">
        <Input className="rounded-full px-5" placeholder="Search" />
        <PostTypeSelect />
      </div>
    </>
  );
}
