import { Wine } from '../Wine/interfaces';

export interface WineSaleHistory {
  id: number;
  wine: Wine;
  total: number;
  inventoryCountBefore: number;
  sales: Array<WineSale>;
  salesFormatted: Array<WineSale>;
  wineId: string;
  companyId?: string;
  dateReference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Filter {
  id?: string;
  wineId?: string;
  companyId?: string;
  productName?: string;
  dateReferenceStart?: string;
  dateReferenceEnd?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  pageNumber: 1,
  pageSize: 10
};

export interface WineSale {
  id: string;
  created_at: string;
  unit_count: number;
  user: {
    id: number;
    seo_name: string;
    alias: string;
    is_featured: boolean;
    is_premium: boolean;
    visibility: string;
    image: {
      location: string;
      variations: any;
    };
    background_image: {
      location: string;
      variations: {
        large: string;
        medium: string;
        small: string;
      };
    };
    bio: any;
    website: any;
    address: {
      title: any;
      name: any;
      street: any;
      street2: any;
      neighborhood: any;
      city: any;
      zip: any;
      state: string;
      country: string;
      company: any;
      phone: any;
      external_id: any;
      residential: any;
      vat_number: any;
      vat_code: any;
      addition: any;
    };
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    is_age_verified: true;
    external_accounts: {
      facebook: any;
      twitter: any;
      google: any;
    };
    fb_autofollow: boolean;
    registered_at: string;
    updated_at: string;
    profile_completed_at: string;
    has_merchants: boolean;
    has_wineries: boolean;
    language: string;
    purchase_order_count: number;
    is_blacklisted: boolean;
    trust_status: number;
    statistics: {
      followers_count: number;
      followings_count: number;
      ratings_count: number;
      ratings_sum: number;
      reviews_count: number;
      purchase_order_count: number;
      wishlist_count: number;
      activity_stories_count: number;
      user_vintages_count: number;
      price_range: {
        id: number;
        currency_code: string;
        level: number;
        from_amount: number;
        to_amount: number;
      };
    };
  };
}
