import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false
});

export default async function IndexPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <MapComponent />
    </main>
  );
}
