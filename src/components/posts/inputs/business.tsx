"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useState } from "react";
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
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { TimePicker } from "~/components/ui/time-picker";
import { useGeolocation } from "~/hooks/useGeolocation";
import { cn } from "~/lib/utils";
import { DayType } from "~/server/api/routers/post";
import { days } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function BusinessInput() {
  const newPostQuery = api.post.create.useMutation();
  const newBusinessFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(15).max(255),
    radius: z.coerce.number().min(1).max(1000), // meters
    businessHours: z.record(
      z.enum(days.enumValues),
      z.object({
        startTime: z.date(),
        endTime: z.date(),
      }),
    ),
  });
  const form = useForm<z.infer<typeof newBusinessFormSchema>>({
    resolver: zodResolver(newBusinessFormSchema),
  });
  const location = useGeolocation();

  const onSubmit: SubmitHandler<
    z.infer<typeof newBusinessFormSchema>
  > = async ({ name, description, radius, businessHours }) => {
    if (location.loaded && !location.error)
      await newPostQuery.mutate({
        name,
        description,
        type: "Business",
        radius,
        location: {
          latitude: location.coordinates?.latitude!,
          longitude: location.coordinates?.longitude!,
        },
        businessHours,
      });
  };

  const [checked, setChecked] = useState<{ [key in DayType]?: boolean }>(() => {
    const result: { [key in DayType]?: boolean } = {};
    for (const day of days.enumValues) {
      result[day] = false;
    }
    return result;
  });

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
          name="businessHours"
          render={() => {
            return (
              <FormItem>
                <FormLabel>Business Hours</FormLabel>
                <FormControl>
                  <div className="rounded-md border border-input">
                    {days.enumValues.map((day, i) => {
                      return (
                        <Fragment key={i}>
                          <div
                            className={`p-3 ${!checked[day] && cn("py-5")} text-sm`}
                          >
                            <span className="flex items-center gap-1">
                              <Switch
                                className="scale-75"
                                onCheckedChange={(c) =>
                                  setChecked((prev) => {
                                    if (c == false) {
                                      form.setValue(
                                        `businessHours.${day}`,
                                        undefined,
                                      );
                                    }
                                    return { ...prev, [day]: c };
                                  })
                                }
                                id={`toggle-${day}`}
                              />
                              <Label
                                className={`space-x-2 ${!checked[day] && cn("text-muted-foreground")}`}
                                htmlFor={`toggle-${day}`}
                              >
                                <span>{day}</span>
                                {!checked[day] && <span>(closed)</span>}
                              </Label>
                              {checked[day] && (
                                <div className="ml-auto flex items-center gap-2">
                                  <span className="w-auto">
                                    {
                                      <TimePicker
                                        onChange={({ hour, minute }) => {
                                          const time = new Date(
                                            0,
                                            0,
                                            0,
                                            hour,
                                            minute,
                                          );
                                          form.setValue(
                                            `businessHours.${day}.startTime`,
                                            time,
                                          );
                                        }}
                                      />
                                    }
                                  </span>
                                  <span>to</span>
                                  <span className="w-auto">
                                    {
                                      <TimePicker
                                        onChange={({ hour, minute }) => {
                                          const time = new Date(
                                            0,
                                            0,
                                            0,
                                            hour,
                                            minute,
                                          );
                                          form.setValue(
                                            `businessHours.${day}.endTime`,
                                            time,
                                          );
                                        }}
                                      />
                                    }
                                  </span>
                                </div>
                              )}
                            </span>
                          </div>
                          {i !== days.enumValues.length - 1 && <hr />}
                        </Fragment>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
          onClick={() => console.log(form.getValues())}
        >
          Create
        </Button>
      </form>
    </Form>
  );
}
