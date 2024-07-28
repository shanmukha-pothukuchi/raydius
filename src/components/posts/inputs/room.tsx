"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useGeolocation } from "~/hooks/useGeolocation";
import { api } from "~/trpc/react";

export default function RoomInput() {
  const newPostQuery = api.post.create.useMutation();
  const newRoomFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(15).max(255),
    radius: z.coerce.number().min(1).max(1000), // meters
  });
  const form = useForm<z.infer<typeof newRoomFormSchema>>({
    resolver: zodResolver(newRoomFormSchema),
  });
  const location = useGeolocation();

  const onSubmit: SubmitHandler<z.infer<typeof newRoomFormSchema>> = async ({
    name,
    description,
    radius,
  }) => {
    console.log("submitting data");
    if (location.loaded && !location.error)
      await newPostQuery.mutate({
        name,
        description,
        type: "Room",
        radius,
        location: {
          latitude: location.coordinates?.latitude!,
          longitude: location.coordinates?.longitude!,
        },
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Bearden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Afterschool tutoring" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radius</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Create
        </Button>
      </form>
    </Form>
  );
}
