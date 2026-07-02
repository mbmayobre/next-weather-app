'use client'

import { useState } from 'react'
import Weather from "./weather/weather";
import type { Background } from "./service/dictionary";
import { bgClassMap } from './service/dictionary';

export default function Home() {
  const [bg, setBg] = useState<Background>('home')

  return (
    <main className={`flex flex-col items-center min-h-screen ${bgClassMap[bg]} p-4 bg-cover bg-fixed bg-center min-h-screen`}>
      <Weather onBackgroundChange={setBg} />
    </main>
  );
}
