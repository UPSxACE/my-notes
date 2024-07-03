"use client";

import { WebsocketContext } from "@/context/websocket";
import { useContext } from "react";

export default function HubPage() {
  const connection = useContext(WebsocketContext);

  return (
    <div>
      HubPage
      <button
        onClick={() => {
          connection
            .invoke("newMessage", "ace", "This is a test!")
            .catch((err) => console.log(err));
        }}
      >
        SEND
      </button>
    </div>
  );
}
