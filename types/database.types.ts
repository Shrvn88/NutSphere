export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cart_items_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cart_items_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_slug: string
          product_image: string | null
          unit_price: number
          discount_percentage: number
          discounted_price: number
          quantity: number
          line_total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_slug: string
          product_image?: string | null
          unit_price: number
          discount_percentage: number
          discounted_price: number
          quantity: number
          line_total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_slug?: string
          product_image?: string | null
          unit_price?: number
          discount_percentage?: number
          discounted_price?: number
          quantity?: number
          line_total?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          shipping_address_line1: string
          shipping_address_line2: string | null
          shipping_city: string
          shipping_state: string
          shipping_postal_code: string
          shipping_country: string
          subtotal: number
          discount_amount: number
          shipping_cost: number
          tax_amount: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          customer_notes: string | null
          admin_notes: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          courier_name: string | null
          tracking_id: string | null
          tracking_url: string | null
          created_at: string
          updated_at: string
          confirmed_at: string | null
          shipped_at: string | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          shipping_address_line1: string
          shipping_address_line2?: string | null
          shipping_city: string
          shipping_state: string
          shipping_postal_code: string
          shipping_country: string
          subtotal: number
          discount_amount?: number
          shipping_cost?: number
          tax_amount?: number
          total_amount: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          customer_notes?: string | null
          admin_notes?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          courier_name?: string | null
          tracking_id?: string | null
          tracking_url?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          shipping_address_line1?: string
          shipping_address_line2?: string | null
          shipping_city?: string
          shipping_state?: string
          shipping_postal_code?: string
          shipping_country?: string
          subtotal?: number
          discount_amount?: number
          shipping_cost?: number
          tax_amount?: number
          total_amount?: number
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          customer_notes?: string | null
          admin_notes?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          courier_name?: string | null
          tracking_id?: string | null
          tracking_url?: string | null
          created_at?: string
          updated_at?: string
          confirmed_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          price: number
          discount_percentage: number
          images: string[]
          weight_grams: number | null
          stock_quantity: number
          is_active: boolean
          rating_average: number
          rating_count: number
          view_count: number
          search_vector: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          price: number
          discount_percentage?: number
          images?: string[]
          weight_grams?: number | null
          stock_quantity?: number
          is_active?: boolean
          rating_average?: number
          rating_count?: number
          view_count?: number
          search_vector?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          discount_percentage?: number
          images?: string[]
          weight_grams?: number | null
          stock_quantity?: number
          is_active?: boolean
          rating_average?: number
          rating_count?: number
          view_count?: number
          search_vector?: any | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          weight_grams: number | null
          price: number
          compare_at_price: number | null
          sku: string | null
          stock_quantity: number
          is_default: boolean
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          weight_grams?: number | null
          price: number
          compare_at_price?: number | null
          sku?: string | null
          stock_quantity?: number
          is_default?: boolean
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          weight_grams?: number | null
          price?: number
          compare_at_price?: number | null
          sku?: string | null
          stock_quantity?: number
          is_default?: boolean
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      generate_order_number: {
        Args: Record<string, never>
        Returns: string
      }
      increment_product_views: {
        Args: { product_id: string }
        Returns: void
      }
      increment_stock: {
        Args: { product_id: string; amount: number }
        Returns: void
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
