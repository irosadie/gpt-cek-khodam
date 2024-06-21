"use client";
import { OpenAI } from "openai-streams";
import { useState } from "react";
import { env } from "$/configs/env";

export default function Home() {
  const [response, setResponse] = useState("");
  const [name, setName] = useState("")

  const hitEndpoint = async (name: string) => {
    setResponse("")
    const stream = await OpenAI(
      "chat",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Kamu adalah dukun ecek2 yang akan menjawab khodam orang berdasarkan nama, khodam adalah legenda dan mitos indonesia, kamu menjawab secara profesional. deskripsikan bentuk dan kekuatannya, kalo namanya mengandung nama/ arti yng mirip dengan makhluk mitologi lebih bagus, lugas langsung to the point, berdasarkan arti nama dan khodam.",
          },
          {
            role: "user",
            content: name,
          },
        ],
      },
      {
        apiKey: env.openAiKey,
      }
    );

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      setResponse((prev) => prev + chunk);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      <nav className="py-4 shadow sticky top-0 bg-gray-400">
        <ul className="max-w-screen-tablet m-auto">
          <li className="font-bold text-white px-4">
            CEK QODHAM
          </li>
        </ul>
      </nav>
      <div className="m-auto bg-white shadow max-w-screen-tablet w-full flex-1">
        <div className="pt-8 px-4 w-full space-y-2">
          <div>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="h-10 py-0.5 border border-gray-400 rounded w-full px-4 uppercase"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button onClick={() => setName("")}
              className="bg-red-400 py-2 px-4 text-white rounded disabled:bg-red-200 disabled:cursor-not-allowed"
              disabled={!!!name}
            >
              RESET
            </button>
            <button
              onClick={() => hitEndpoint(name)}
              className="bg-green-400 py-2 px-4 text-white rounded disabled:bg-green-200 disabled:cursor-not-allowed"
              disabled={!!!name}
            >
              KIRIM
            </button>
          </div>

          <div className="pt-4">
            <div className="w-max-full relative">
              <div className="absolute rounded-full px-2 py-0.5 bg-slate-400 text-white -top-1.5 text-xs left-3">Hasil Qodam dari Nama Kamu</div>
              <div className="bg-gray-50 mt-4 p-4 max-h-[420px] overflow-y-auto border border-gray-400 rounded px-4 py-8 text-sm">
                {response || 'Masukan nama dulu, lalu "Kirim"'}
              </div>
            </div>
            <p className="text-xs text-red-400 mt-2">note: cek qodam/ khodam ini hanya bersifat fantasi saja, jgn dipercaya!</p>
          </div>
        </div>
      </div>
    </main>
  );
}
