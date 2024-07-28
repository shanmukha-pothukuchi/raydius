import { UploadCloud } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function Upload() {
  return (
    <Card className="flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed border-zinc-200 p-10 dark:border-zinc-800">
      <UploadCloud className="h-16 w-16 text-zinc-500 dark:text-zinc-400" />
      <Button variant="outline">Select Files</Button>
    </Card>
  );
}
