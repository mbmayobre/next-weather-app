import Weather from "./components/weather";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <Weather />
    </main>
  );
}
