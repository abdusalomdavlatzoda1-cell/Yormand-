export type Locale = "tj" | "ru" | "en";

export interface Translation {
  locale: Locale;
  title?: string;
  fullName?: string;
  shortDescription?: string;
  fullDescription?: string;
  specialization?: string;
  biography?: string;
  education?: string;
  certifications?: string;
}

export interface Service {
  id: string;
  slug: string;
  category: string;
  icon?: string | null;
  image?: string | null;
  price?: number | null;
  priceVisible: boolean;
  duration?: string | null;
  featured: boolean;
  active: boolean;
  order: number;
  translations: Translation[];
}

export interface Doctor {
  id: string;
  slug: string;
  photo?: string | null;
  isPlaceholder: boolean;
  experience?: string | null;
  languages?: string | null;
  order: number;
  active: boolean;
  translations: Translation[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title?: string | null;
  description?: string | null;
  order: number;
  visible: boolean;
}

export interface BeforeAfterItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
  description?: string | null;
  published: boolean;
  order: number;
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  content: string;
  source?: string | null;
  approved: boolean;
  order: number;
}

export interface PriceItem {
  id: string;
  serviceId?: string | null;
  label: string;
  price?: number | null;
  currency: string;
  priceRange?: string | null;
  onConsultation: boolean;
  visible: boolean;
  order: number;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  serviceName?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  status: "NEW" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  internalNote?: string | null;
  createdAt: string;
}

export interface SiteSettings {
  clinicName: string;
  logo?: string;
  favicon?: string;
  phone: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
  address: string;
  workingHours: string;
  googleMapsLink?: string;
  yandexMapsLink?: string;
  landmark?: string;
}
