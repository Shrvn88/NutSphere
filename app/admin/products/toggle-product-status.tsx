'use client'

export default function ToggleProductStatus({
  productId,
  isActive,
  toggleStatus,
}: {
  productId: string
  isActive: boolean
  toggleStatus: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={toggleStatus} className="inline">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="newStatus" value={isActive ? 'false' : 'true'} />
      <button 
        type="submit"
        className={`text-sm font-medium ${
          isActive 
            ? 'text-orange-600 hover:text-orange-800' 
            : 'text-green-600 hover:text-green-800'
        }`}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </form>
  )
}
