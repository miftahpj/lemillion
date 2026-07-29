// types/database.ts
export interface Profile {
  id: string; created_at: string; updated_at: string
  name: string; tagline: string; bio: string; bio_extended: string
  avatar_url: string | null; signature_url: string | null; hero_image_url: string | null
  location: string; email: string; whatsapp: string | null
  github: string | null; linkedin: string | null; website: string | null
  years_experience: number; projects_count: number; certifications_count: number; clients_count: number
}

export interface Category {
  id: string; created_at: string
  name: string; slug: string; description: string | null
  sort_order: number; is_active: boolean
}

export interface Portfolio {
  id: string; created_at: string; updated_at: string
  title: string; slug: string | null; category_id: string | null
  description: string; story: string | null
  cover_url: string; image_url: string; gallery_urls: string[]
  tags: string[]; year: number
  is_featured: boolean; is_published: boolean; sort_order: number
  client: string | null; location: string | null
  role: string | null; tech_stack: string | null
  repo_url: string | null; demo_url: string | null
  categories?: Category | null
}

export interface Service {
  id: string; created_at: string; updated_at: string
  title: string; icon: string; description: string
  price_min: number; price_label: string; duration: string | null
  features: string[]; is_featured: boolean; is_active: boolean
  sort_order: number; cta_label: string
}

export interface Testimonial {
  id: string; created_at: string
  client_name: string; client_role: string; client_avatar: string | null
  quote: string; rating: number; is_featured: boolean; is_published: boolean; sort_order: number
}

export interface Award {
  id: string; created_at: string
  title: string; organization: string; year: number; description: string | null; sort_order: number
}

export interface Inquiry {
  id: string; created_at: string
  name: string; email: string; phone: string | null
  session_type: string | null; preferred_date: string | null
  budget_range: string | null; location_pref: string | null; message: string
  status: 'new' | 'read' | 'replied' | 'closed' | 'spam'
  notes: string | null; replied_at: string | null
}

export interface Availability {
  id: string; month: string; year_month: string
  status: 'open' | 'limited' | 'full'; notes: string | null
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
