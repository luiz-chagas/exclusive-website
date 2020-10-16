export interface ClientState {
  type: "queue" | "up" | "bye";
  position: number;
}
