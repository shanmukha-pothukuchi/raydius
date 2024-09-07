import {
  Box,
  Calendar,
  Edit,
  LucideProps,
  Radius,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "~/components/component/BackButton";
import { PostType } from "~/components/posts";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const postTypeIcon: { [key in PostType]: React.ComponentType<LucideProps> } = {
  Room: Box,
  Event: Calendar,
  Business: ShoppingCart,
};

const Post = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.get({ postId: params.id });
  const session = await getServerAuthSession();

  const Icon = postTypeIcon[post?.type!];

  const isOwner = session?.user.id === post?.user.id;
  const isConnected =
    post?.connections.find((c) => c.userId === session?.user.id) !== undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/banner.jpg"
          alt="banner"
          fill={true}
          sizes="500px"
          className="-z-10 h-full w-full object-cover"
          priority={true}
        />
        <div className="p-6">
          <BackButton />
        </div>
        {isOwner && (
          <Button className="absolute bottom-0 right-0 z-10 m-3 space-x-2 rounded-full text-sm">
            <Edit className="h-[1em] w-[1em]" />
            <p>Edit</p>
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <div className="relative -mt-10 ml-8 h-40 min-w-48 overflow-hidden rounded-md ring-4 ring-white">
          <Image
            src="/logo.jpg"
            alt="logo"
            fill={true}
            sizes="200px"
            className="h-full w-full object-cover"
          />
          <div className="absolute flex items-center gap-1 rounded-br-lg bg-black px-2 py-1 text-sm text-white">
            <Icon className="h-[1.05em] w-[1.05em]" />
            {post?.type}
          </div>
        </div>
        <div className="w-full py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-nowrap text-2xl font-bold">{post?.name}</h1>
            <p className="flex items-center gap-1 rounded-full bg-black px-1.5 py-0.5 text-xs font-medium text-white">
              <Radius className="h-[1.05em] w-[1.05em]" />
              {post?.radius}m
            </p>
          </div>
          <Link
            href={`/user/${post?.user.id}`}
            className="text-nowrap font-semibold text-blue-800"
          >
            @{post?.user.name?.toLowerCase()}
          </Link>
          {
            <p className="line-clamp-2 w-5/6">
              {post?.description || "Description unavailable"}
            </p>
          }
        </div>
      </div>
      {!(isOwner || isConnected) && (
        <div className="grid grow place-items-center">
          <Button className="flex items-center gap-2 rounded-full text-base">
            <UserPlus className="h-[1.15em] w-[1.15em]" /> Join
          </Button>
        </div>
      )}
      {/* <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs> */}
    </div>
  );
};

export default Post;
