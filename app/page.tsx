"use client";

import { Actions } from "@/components/sections/actions";
import { DownloadActions } from "@/components/sections/downloadactions";
import { FileGrid } from "@/components/sections/filegrid";
import { FileInputBox } from "@/components/sections/fileinputbox";
import { Header } from "@/components/sections/header";
import { Info } from "@/components/sections/info";

import { DataConnection, Peer } from "peerjs";
import { useEffect, useState } from "react";

export default function Home() {
  const [peer, setPeer] = useState<Peer>();
  const [files, setFiles] = useState<(FileList | null)[]>([]);
  const [connection, setConnection] = useState<DataConnection>();
  const [userId, setUserId] = useState<string>();

  // initializes current user
  const createSession = () => {
    const p = new Peer();
    setPeer(p);
    p?.on("error", (e) => {
      console.log("We encountered an error", e.name, e.message);
    });

    p?.on("connection", (conn) => {
      console.log("got a connection from ", conn.peer);
      setConnection(conn);
    });

    setUserId(p.id);
    console.log(p.id);
  };

  // runs when the connection changes to update the event listeners
  useEffect(() => {
    if (connection) {
      connection.on("data", (data) => {
        console.log(data);
      });
    }
  }, [connection]);

  // send the files to the other user whenever new files is uploaded
  useEffect(() => {
    if (connection) {
      connection.send(files);
    }
  }, [files]);

  function connectToPeer(id: string) {
    const conn = peer?.connect(id);
    conn?.on("open", () => {
      console.log("connected to", id);
      setConnection(conn);
    });
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* heading section */}
      <Header />

      {/* buttons */}
      <Actions joinSession={connectToPeer} createSession={createSession} />

      {/* information tab */}
      <Info content={userId} />
      <FileInputBox setFiles={setFiles} />

      <DownloadActions />

      <div className="flex content-center justify-center mt-8">
        <FileGrid />
      </div>
    </section>
  );
}
