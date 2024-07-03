"use client";

import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { createContext, useEffect, useRef } from "react";

type Props = { children: React.ReactNode };

const ws = new HubConnectionBuilder()
  .withUrl("http://localhost:8080/hubs/test")
  .build();

export const WebsocketContext = createContext(ws);

export default function WebsocketProvider(props: Props) {
  const { current: connection } = useRef(ws);

  useEffect(() => {
    const messageReceived = (data: any, data2: any) => {
      console.log(data, data2);
    };

    connection.on("messageReceived", messageReceived);
    if (connection.state === HubConnectionState.Disconnected)
      connection.start();

    console.log(connection);

    return () => {
      connection.off("messageReceived", messageReceived);
    };
  }, [connection]);

  return (
    <WebsocketContext.Provider value={connection}>
      {props.children}
    </WebsocketContext.Provider>
  );
}