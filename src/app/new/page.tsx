"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PostTypeSelect from "~/components/component/PostTypeSelect";
import { PostComponents, PostType } from "~/components/posts";
import { Button } from "~/components/ui/button";
import { postTypeSignal } from "~/lib/signal";

const New = () => {
  const Form = PostComponents[postTypeSignal.value as PostType].Input;

  const router = useRouter();

  return (
    <div>
      <div className="flex gap-4">
        <Button
          className="mb-5 space-x-2 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-[1.15em] w-[1.15em]" />
          <p>Back</p>
        </Button>
        <div className="mb-4 flex items-center space-x-2">
          <h1>New</h1>
          <PostTypeSelect variant="outline" includeAll={false} />
        </div>
      </div>
      <Form />
    </div>
  );
};

export default New;
