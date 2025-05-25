import CardGrid from "../components/CardGrid";
import { mockCards } from "../mocks/cards";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Coleção de Cartas
        </h1>
        <CardGrid cards={mockCards} />
      </div>
    </main>
  );
}
