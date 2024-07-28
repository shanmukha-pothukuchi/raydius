import BusinessInput from "./business";
import EventInput from "./event";
import RoomInput from "./room";

export const Inputs = {
  Room: RoomInput,
  Event: EventInput,
  Business: BusinessInput,
} as const;
