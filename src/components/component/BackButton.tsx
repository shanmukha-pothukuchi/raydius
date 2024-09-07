"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      className="z-10 space-x-2 rounded-full"
      onClick={() => router.push("/")}
    >
      <ArrowLeft className="h-[1.15em] w-[1.15em]" />
      <p>Back</p>
    </Button>
  );
};

export default BackButton;
