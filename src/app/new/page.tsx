"use client";

import BackButton from "~/components/component/BackButton";
import PostTypeSelect from "~/components/component/PostTypeSelect";
import { PostComponents, PostType } from "~/components/posts";
import { postTypeSignal } from "~/lib/signal";

const New = () => {
  const Form = PostComponents[postTypeSignal.value as PostType]?.Input;

  return (
    <div className="p-6">
      <div className="flex gap-4">
        <BackButton />
        <div className="mb-4 flex items-center space-x-2">
          <h1>New</h1>
          <PostTypeSelect variant="outline" includeAll={false} />
        </div>
      </div>
      {Form && <Form />}
    </div>
  );
};

export default New;
