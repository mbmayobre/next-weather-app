import Weather from "./views/weather";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-fog bg-cover bg-fixed bg-top min-h-screen">
      <Weather />
    </main>
  );
}
