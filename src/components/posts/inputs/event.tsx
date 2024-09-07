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
import { DateTimePicker } from "~/components/ui/time-picker";
import { useGeolocation } from "~/hooks/useGeolocation";
import { useUploadThing } from "~/lib/uploadthing";
import { api } from "~/trpc/react";

export default function EventInput() {
  const newPostQuery = api.post.create.useMutation();
  const newEventFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(15).max(255),
    radius: z.coerce.number().min(1).max(1000), // meters
    imageFile: z.any().refine((file) => file instanceof File, {
      message: "A file must be uploaded",
    }),
    startTime: z.date(),
    endTime: z.date(),
  });
  const form = useForm<z.infer<typeof newEventFormSchema>>({
    resolver: zodResolver(newEventFormSchema),
  });
  const location = useGeolocation();

  const { startUpload } = useUploadThing("imageUploader");
  const onSubmit: SubmitHandler<z.infer<typeof newEventFormSchema>> = async ({
    name,
    description,
    radius,
    imageFile,
    startTime,
    endTime,
  }) => {
    if (!location.loaded || location.error) return;

    let imageUrl = "";

    if (imageFile) {
      const uploadResponse = await startUpload([imageFile]);
      if (uploadResponse && uploadResponse[0]) {
        imageUrl = uploadResponse[0].url;
      }
    }

    await newPostQuery.mutate({
      name,
      description,
      type: "Event",
      radius,
      location: {
        longitude: location.coordinates?.longitude!,
        latitude: location.coordinates?.latitude!,
      },
      imageUrl,
      openTime: {
        start: startTime,
        end: endTime,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0] as File)} // Set file input
                  accept="image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Color Fest" {...field} />
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
                <Textarea
                  placeholder="Spring Fest in the Thurmont are where people from everywhere gather"
                  {...field}
                />
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
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Start Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="hour"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">End Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="hour"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
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
