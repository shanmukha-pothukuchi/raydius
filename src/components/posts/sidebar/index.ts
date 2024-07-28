import BusinessSidebar from "./business";
import EventSidebar from "./event";
import RoomSidebar from "./room";

export const Sidebars = {
  Room: RoomSidebar,
  Event: EventSidebar,
  Business: BusinessSidebar,
} as const;
