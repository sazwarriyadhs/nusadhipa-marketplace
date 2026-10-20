import RouteDetailClient from "./RouteDetailClient";

export default async function RouteDetailPage({ 
  params 
}: { 
  params: Promise<{ routeId: string }> 
}) {
  const { routeId } = await params;
  return <RouteDetailClient routeId={routeId} />;
}
