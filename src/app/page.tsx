'use client'

/**
 * Home page — the "/" route.
 *
 * Its only job is to own the full-page background and render the app.
 *
 * Why the background lives here and not in <Weather>: the background belongs to
 * <main>, which is rendered by this component, but only <Weather> knows what
 * the weather is. So this component owns the state and passes the setter down
 * (`onBackgroundChange`); Weather calls it whenever new weather arrives. That is
 * the standard React "lifting state up" pattern — state sits at the lowest
 * common ancestor of everyone who needs it.
 *
 * This is a Client Component ('use client' above) because it uses useState.
 */
import { useState } from 'react'
import Weather from "./weather/weather";
import type { Background } from "./service/dictionary";
import { bgClassMap } from './service/dictionary';

export default function Home() {
  // 'home' is the neutral background shown before any search happens.
  const [bg, setBg] = useState<Background>('home')

  return (
    // bgClassMap turns the Background union value into a literal Tailwind class
    // (e.g. 'cloudy' -> 'bg-cloudy'). See the note in service/dictionary.ts for
    // why we cannot just write `bg-${bg}` here.
    <main className={`flex flex-col items-center min-h-screen ${bgClassMap[bg]} p-4 bg-cover bg-fixed bg-center min-h-screen`}>
      <Weather onBackgroundChange={setBg} />
    </main>
  );
}
