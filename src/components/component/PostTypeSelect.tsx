import { useSignalEffect } from "@preact/signals-react";
import { PostType } from "~/components/posts";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { postTypeSignal } from "~/lib/signal";
import { postType } from "~/server/db/schema";

const PostTypeSelect = ({
  variant = "default",
  includeAll = true,
}: {
  variant?: "default" | "outline";
  includeAll?: boolean;
}) => {
  const options = includeAll
    ? ["All", ...postType.enumValues]
    : postType.enumValues;

  useSignalEffect(() => {
    if (!options.includes(postTypeSignal.value)) {
      postTypeSignal.value = options[0] as PostType;
    }
  });

  return (
    <Select
      value={postTypeSignal.value}
      onValueChange={(value: PostType) => (postTypeSignal.value = value)}
    >
      <Button asChild className="rounded-full" variant={variant}>
        <SelectTrigger className="w-fit gap-x-2">
          <SelectValue />
        </SelectTrigger>
      </Button>
      <SelectContent>
        {options.map((postType, i) => (
          <SelectItem key={i} value={postType}>
            {postType}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PostTypeSelect;
