'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import VariantsEditor, { Variant } from './variants-editor'

interface ProductFormProps {
  product?: any
  categories: { id: string; name: string }[]
  variants?: Variant[]
  onSubmit: (formData: FormData) => Promise<void>
  isEdit?: boolean
}

export default function ProductForm({
  product,
  categories,
  variants: initialVariants = [],
  onSubmit,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images && Array.isArray(product.images) ? product.images : []
  )
  const [variants, setVariants] = useState<Variant[]>(initialVariants)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Update variants when initialVariants prop changes (on page navigation)
  useEffect(() => {
    setVariants(initialVariants)
  }, [initialVariants])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    // Add images as comma-separated string
    formData.set('images', imageUrls.join(', '))
    // Add variants as JSON string
    formData.set('variants', JSON.stringify(variants))

    startTransition(async () => {
      try {
        await onSubmit(formData)
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/products')
        }, 1000)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred'
        setError(message)
        console.error('Form submission error:', err)
      }
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError(null)

    const newUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload only image files')
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB')
        continue
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `product-images/${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          setUploadError(`Failed to upload ${file.name}: ${uploadError.message}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        newUrls.push(publicUrl)
      } catch (err) {
        console.error('Upload error:', err)
        setUploadError('Failed to upload image')
      }
    }

    if (newUrls.length > 0) {
      setImageUrls(prev => [...prev, ...newUrls])
    }

    setUploading(false)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const addManualUrl = () => {
    const url = prompt('Enter image URL:')
    if (url && url.startsWith('http')) {
      setImageUrls(prev => [...prev, url.trim()])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Success!</p>
          <p className="text-green-700 text-sm mt-1">
            Product {isEdit ? 'updated' : 'created'} successfully. Redirecting...
          </p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name || ''}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={product?.category_id || ''}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
        >
          <option value="">Select category</option>
          {(categories || []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product?.price || ''}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            id="discount_percentage"
            name="discount_percentage"
            type="number"
            min="0"
            max="100"
            defaultValue={product?.discount_percentage || '0'}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            defaultValue={product?.stock_quantity || '0'}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
            SKU (optional)
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={product?.sku || ''}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="weight_grams" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (grams, optional)
          </label>
          <input
            id="weight_grams"
            name="weight_grams"
            type="number"
            min="0"
            defaultValue={product?.weight_grams || ''}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        
        {/* Image Preview Grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{uploadError}</p>
          </div>
        )}

        {/* Upload Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* File Upload */}
          <label className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading || isPending}
              className="hidden"
            />
            {uploading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm text-gray-600">Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Upload Images</span>
              </>
            )}
          </label>

          {/* Add URL Manually */}
          <button
            type="button"
            onClick={addManualUrl}
            disabled={uploading || isPending}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm text-gray-600">Add URL</span>
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Upload images (max 5MB each) or add URLs manually. First image will be the main product image.
        </p>

        {/* Hidden input to store URLs for form submission */}
        <input type="hidden" name="images" value={imageUrls.join(', ')} />
      </div>

      {/* Product Variants Section */}
      <div className="border-t border-gray-200 pt-6">
        <VariantsEditor
          variants={variants}
          onChange={setVariants}
          disabled={isPending}
        />
        <p className="mt-2 text-xs text-gray-500">
          Add weight variants with different prices. If no variants are added, the base price above will be used.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description || ''}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
        />
      </div>

      <div className="flex items-center">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked={product?.is_active ?? true}
          disabled={isPending}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded disabled:opacity-50"
        />
        <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Processing...' : isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}
