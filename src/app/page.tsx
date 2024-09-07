"use client";

import Link from "next/link";
import PostTypeSelect from "~/components/component/PostTypeSelect";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useGeolocation } from "~/hooks/useGeolocation";
import { postTypeSignal } from "~/lib/signal";
import { api } from "~/trpc/react";

export default function Home() {
  const { coordinates, loaded } = useGeolocation();

  const { data } = api.post.nearby.useQuery(
    {
      type: postTypeSignal.value,
      location: coordinates!,
    },
    { enabled: loaded },
  );

  return (
    <div className="p-6">
      <div className="flex gap-2">
        <Input className="rounded-full px-5" placeholder="Search" />
        <PostTypeSelect />
      </div>
      <div className="mt-2 flex gap-2">
        {data?.map((post) => (
          <Button key={post.id} asChild>
            <Link href={`/post/${post.id}`} >{post.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
