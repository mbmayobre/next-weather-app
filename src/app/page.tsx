'use client'

import { useState, useEffect } from 'react'
import Weather from "./weather/weather";
import type { Background } from "./service/dictionary";
import { bgClassMap } from './service/dictionary';

export default function Home() {
  const [bg, setBg] = useState<Background>('home')
  useEffect(() => {
    console.log(`Background changed to: ${bg}`);
  }, [bg])

  return (
    <main className={`flex flex-col items-center min-h-screen ${bgClassMap[bg]} p-4 bg-cover bg-fixed bg-center min-h-screen`}>
      <Weather onBackgroundChange={setBg} />
    </main>
  );
}
