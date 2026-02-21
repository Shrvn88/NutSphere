import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, images')
    .eq('slug', 'premium-almonds')
    .single()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug: Product Data</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-800">Error: {error.message}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {data?.images && data.images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Images:</h2>
          <div className="space-y-4">
            {data.images.map((img: string, idx: number) => (
              <div key={idx} className="border p-4">
                <p className="text-sm mb-2 break-all">{img}</p>
                <img src={img} alt={`Product ${idx + 1}`} className="max-w-md" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

