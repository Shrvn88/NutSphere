'use client'

import { useState } from 'react'

export interface Variant {
  id?: string
  name: string
  weight_grams: number
  price: number
  compare_at_price?: number
  sku?: string
  stock_quantity: number
  is_default: boolean
  is_active: boolean
  display_order: number
}

interface VariantsEditorProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
  disabled?: boolean
}

const PRESET_WEIGHTS = [
  { name: '100g', grams: 100 },
  { name: '250g', grams: 250 },
  { name: '500g', grams: 500 },
  { name: '1kg', grams: 1000 },
]

export default function VariantsEditor({ variants, onChange, disabled }: VariantsEditorProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Variant>({
    name: '',
    weight_grams: 250,
    price: 0,
    compare_at_price: undefined,
    sku: '',
    stock_quantity: 0,
    is_default: false,
    is_active: true,
    display_order: variants.length,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      weight_grams: 250,
      price: 0,
      compare_at_price: undefined,
      sku: '',
      stock_quantity: 0,
      is_default: variants.length === 0,
      is_active: true,
      display_order: variants.length,
    })
    setEditingIndex(null)
    setShowForm(false)
  }

  const handleAddVariant = () => {
    if (!formData.name || formData.price <= 0) return

    const newVariant = { ...formData }
    
    // If this is set as default, remove default from others
    let updatedVariants = [...variants]
    if (newVariant.is_default) {
      updatedVariants = updatedVariants.map(v => ({ ...v, is_default: false }))
    }

    if (editingIndex !== null) {
      updatedVariants[editingIndex] = newVariant
    } else {
      updatedVariants.push(newVariant)
    }

    // Ensure at least one default
    if (!updatedVariants.some(v => v.is_default) && updatedVariants.length > 0) {
      updatedVariants[0].is_default = true
    }

    onChange(updatedVariants)
    resetForm()
  }

  const handleEditVariant = (index: number) => {
    setFormData(variants[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDeleteVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index)
    
    // Ensure at least one default
    if (!updatedVariants.some(v => v.is_default) && updatedVariants.length > 0) {
      updatedVariants[0].is_default = true
    }

    onChange(updatedVariants)
  }

  const handlePresetClick = (preset: { name: string; grams: number }) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      weight_grams: preset.grams,
    }))
  }

  const setAsDefault = (index: number) => {
    const updatedVariants = variants.map((v, i) => ({
      ...v,
      is_default: i === index,
    }))
    onChange(updatedVariants)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Variants (Weight Options)
        </label>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={disabled}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Variant
          </button>
        )}
      </div>

      {/* Existing Variants List */}
      {variants.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {variants.map((variant, index) => (
                <tr key={index} className={!variant.is_active ? 'opacity-50' : ''}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{variant.name}</div>
                    {variant.sku && <div className="text-xs text-gray-500">SKU: {variant.sku}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">₹{variant.price.toFixed(2)}</div>
                    {variant.compare_at_price && variant.compare_at_price > variant.price && (
                      <div className="text-xs text-gray-500 line-through">
                        ₹{variant.compare_at_price.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${variant.stock_quantity <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {variant.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {variant.is_default ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAsDefault(index)}
                        disabled={disabled}
                        className="text-xs text-gray-500 hover:text-green-600"
                      >
                        Set default
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleEditVariant(index)}
                      disabled={disabled}
                      className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(index)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Variant Form */}
      {showForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Variant' : 'Add New Variant'}
          </h4>

          {/* Preset Weight Buttons */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick select weight:</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_WEIGHTS.map((preset) => (
                <button
                  key={preset.grams}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    formData.name === preset.name
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., 250g, 500g, 1kg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                value={formData.weight_grams || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight_grams: parseInt(e.target.value) || 0 }))}
                placeholder="250"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value || '0') }))}
                placeholder="299.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.compare_at_price || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  compare_at_price: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="399.00 (original price)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU (optional)
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="ALM-250G"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Default variant</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleAddVariant}
              disabled={!formData.name || formData.price <= 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingIndex !== null ? 'Update Variant' : 'Add Variant'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {variants.length === 0 && !showForm && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 mb-2">No variants added yet</p>
          <p className="text-sm text-gray-400">Add weight variants like 250g, 500g, 1kg with different prices</p>
        </div>
      )}
    </div>
  )
}

