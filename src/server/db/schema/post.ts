import {
  geometry,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const postType = pgEnum("post_type", ["Room", "Business", "Event"]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    type: postType("type").notNull(),
    radius: integer("radius").notNull(),
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .defaultNow()
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (t) => ({
    spatialIndex: index("post_spatial_index").using("gist", t.location),
    userIdIndex: index("post_user_id_index").on(t.userId),
  }),
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  connections: many(connections),
  ratings: many(ratings),
  businessHours: many(businessHours),
}));

export const connections = pgTable(
  "connections",
  {
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    postId: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
  },
  (t) => ({
    primaryKey: primaryKey({
      columns: [t.userId, t.postId],
    }),
    userIdIndex: index("connection_user_id_index").on(t.userId),
    postIdIndex: index("connection_post_id_index").on(t.postId),
  }),
);

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, { fields: [connections.userId], references: [users.id] }),
  post: one(posts, { fields: [connections.postId], references: [posts.id] }),
}));

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    rating: integer("rating").$type<1 | 2 | 3 | 4 | 5>().notNull(),
    comment: text("comment").notNull(),
    postId: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (t) => ({
    postIdIndex: index("rating_post_id_index").on(t.postId),
    uniquePostAndUser: unique("post_and_user").on(t.postId, t.userId),
  }),
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, { fields: [ratings.userId], references: [users.id] }),
  post: one(posts, { fields: [ratings.postId], references: [posts.id] }),
}));

export const days = pgEnum("days", [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

export const businessHours = pgTable(
  "business_hours",
  {
    day: days("day").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    postId: uuid("post_id")
      .references(() => posts.id)
      .notNull(),
  },
  (t) => ({
    primaryKey: primaryKey({
      columns: [t.postId, t.day, t.startTime, t.endTime],
    }),
    postIdIndex: index("post_id_index").on(t.postId),
  }),
);

export const businessHoursRelations = relations(businessHours, ({ one }) => ({
  post: one(posts, { fields: [businessHours.postId], references: [posts.id] }),
}));
