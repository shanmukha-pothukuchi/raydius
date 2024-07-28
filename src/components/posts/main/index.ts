import BusinessMain from "./business";
import EventMain from "./event";
import RoomMain from "./room";

export const Mains = {
  Room: RoomMain,
  Event: EventMain,
  Business: BusinessMain,
} as const;
