'use client'

export default function DeleteProductForm({
  productId,
  deleteProduct,
}: {
  productId: string
  deleteProduct: (formData: FormData) => Promise<void>
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={deleteProduct} className="inline" onSubmit={handleSubmit}>
      <input type="hidden" name="productId" value={productId} />
      <button 
        type="submit"
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Delete
      </button>
    </form>
  )
}

