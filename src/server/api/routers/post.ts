import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  businessHours,
  days,
  openTimes,
  posts,
  postType,
} from "~/server/db/schema";

export const zodPostType = z.enum(postType.enumValues);
const zodDayType = z.enum(days.enumValues);
export type DayType = z.infer<typeof zodDayType>;

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().max(255).optional(),
        location: z.object({
          longitude: z.number(),
          latitude: z.number(),
        }),
        type: zodPostType,
        radius: z.number().min(1).max(1000), // meters
        businessHours: z
          .record(
            zodDayType,
            z.object({
              startTime: z.date(),
              endTime: z.date(),
            }),
          )
          .optional(),
        openTime: z
          .object({
            start: z.date(),
            end: z.date(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = (
        await ctx.db
          .insert(posts)
          .values({
            name: input.name,
            description: input.description,
            type: input.type,
            radius: input.radius,
            location: {
              x: input.location.longitude,
              y: input.location.latitude,
            },
            userId: ctx.session.user.id,
          })
          .returning({ postId: posts.id })
      )[0]!;

      if (input.type == "Business" && input.businessHours != null)
        await ctx.db.insert(businessHours).values(
          Object.entries(input.businessHours).map(
            ([day, { startTime, endTime }]) => ({
              postId,
              day: day as DayType,
              startTime,
              endTime,
            }),
          ),
        );

      if (input.type == "Event" && input.openTime != null)
        await ctx.db.insert(openTimes).values({
          postId,
          startTime: input.openTime.start,
          endTime: input.openTime.end,
        });
    }),

  nearby: protectedProcedure
    .input(
      z.object({
        location: z.object({
          longitude: z.number(),
          latitude: z.number(),
        }),
        type: zodPostType,
      }),
    )
    .query(async ({ ctx, input }) => {
      const userLocation = sql`ST_SetSRID(ST_MakePoint(${input.location.longitude}, ${input.location.latitude}), 4326)`;
      return await ctx.db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.type, input.type),
            sql`ST_DWithin(${userLocation}, ${posts.location}, ${posts.radius})`,
          ),
        );
    }),

  get: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });
    }),
});
