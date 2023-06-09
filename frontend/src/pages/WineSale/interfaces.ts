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
  code?: string;
  sale?: string;
  productName?: string;
  saleDateStart?: string;
  saleDateEnd?: string;
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

export interface SaleVivino {
  id: string;
  workflow: 1;
  status: string;
  order_type: string;
  currency_code: string;
  external_id: any;
  items_shipping_sum: number;
  shipping_tax: number;
  items_tax_sum: number;
  items_total_sum: number;
  items_units_sum: number;
  bottles_per_size: {
    '1': number;
  };
  refunded_sum: number;
  coupon_discount_sum: number;
  coupon_discount_tax: number;
  coupon_code: string;
  order_discount: number;
  discounts: any;
  cancellation_type_id: any;
  merchant_sla_expired: boolean;
  source: string;
  options: {
    allows_vintage_changes: string;
    express_shipping: boolean;
    temperature_control: boolean;
  };
  user: {
    id: 9957554;
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
      zip: string;
      state: any;
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
      facebook: {
        id: string;
        user_name: any;
        first_name: string;
        last_name: string;
      };
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
    purchase_order_count: 2;
    is_blacklisted: boolean;
    trust_status: 0;
    statistics: {
      followers_count: 0;
      followings_count: 0;
      ratings_count: 32;
      ratings_sum: 121.5;
      reviews_count: 15;
      purchase_order_count: 2;
      wishlist_count: 9;
      activity_stories_count: 0;
      user_vintages_count: 927;
      price_range: {
        id: 110;
        currency_code: string;
        level: 2;
        from_amount: 50;
        to_amount: 200;
      };
    };
  };

  can_update_shipping_address: boolean;
  shipping_address_id: 10563146;
  shipping: {
    address: {
      title: any;
      name: string;
      street: string;
      street2: string;
      neighborhood: string;
      city: string;
      zip: string;
      state: string;
      country: string;
      company: any;
      phone: string;
      external_id: any;
      residential: any;
      vat_number: string;
      vat_code: any;
      addition: string;
    };
    full_address: {
      addition: string;
      city: string;
      country: string;
      email: string;
      full_name: string;
      neighborhood: string;
      phone: string;
      social_security_number: string;
      state: string;
      street: string;
      street_number: string;
      zip: string;
    };
    email: string;
  };
  billing: {
    address: {
      title: any;
      name: string;
      street: string;
      street2: string;
      neighborhood: string;
      city: string;
      zip: string;
      state: string;
      country: string;
      company: any;
      phone: string;
      external_id: any;
      residential: any;
      vat_number: string;
      vat_code: any;
      addition: string;
    };
    full_address: {
      addition: string;
      city: string;
      country: string;
      full_name: string;
      neighborhood: string;
      phone: string;
      social_security_number: string;
      state: string;
      street: string;
      street_number: string;
      zip: string;
    };
    customer_id: string;
  };
  items: [
    {
      id: 13862802;
      description: string;
      image: {
        location: string;
        variations: any;
      };
      unit_count: 2;
      unit_price: 99.8;
      item_tax_pct: 0;
      sku: string;
      tax_amount: 0;
      total_amount: 199.6;
      'price-listing': {
        id: string;
        merchant: {
          id: 29242;
          name: string;
          seo_name: string;
          legal_name: any;
          description: string;
          country: string;
          state: any;
          status: 3;
          image: {
            location: string;
            variations: {
              large_square: string;
              medium_square: string;
              small_square: string;
            };
          };
          shipping_estimate: any;
          impressum_url: any;
          tos_url: any;
          vc_clearing_system: 0;
          hidden: boolean;
        };
        price: {
          id: 32723026;
          vintage_id: 167736036;
          amount: 99.8;
          discount_from_price: any;
          currency: string;
          bottle_type_id: 1;
          bottle_quantity: 1;
          quantity_is_minimum: boolean;
          inventory_count: 28;
          sku: string;
          url: string;
          visibility: 1;
        };
      };
      vintage: {
        id: 167736036;
        seo_name: string;
        year: string;
        name: string;
        statistics: {
          status: string;
          ratings_count: number;
          ratings_average: number;
          labels_count: number;
          reviews_count: number;
        };
        organic_certification_id: any;
        certified_biodynamic: any;
        image: {
          location: string;
          variations: {
            bottle_large: string;
            bottle_medium: string;
            bottle_medium_square: string;
            bottle_small: string;
            bottle_small_square: string;
            label: string;
            label_large: string;
            label_medium: string;
            label_medium_square: string;
            label_small_square: string;
            large: string;
            medium: string;
            medium_square: string;
            small_square: string;
          };
        };
        wine: {
          id: number;
          name: string;
          seo_name: string;
          type_id: number;
          vintage_type: number;
          is_natural: boolean;
          region: {
            id: number;
            name: string;
            name_en: string;
            seo_name: string;
            country: string;
            parent_id: number;
            background_image: {
              location: string;
              variations: {
                large: string;
                medium: string;
              };
            };
            class: {
              id: 1;
              country_code: string;
              abbreviation: string;
              description: string;
            };
            statistics: {
              wineries_count: number;
              wines_count: number;
              sub_regions_count: number;
              parent_regions_count: number;
            };
          };
          review_status: number;
          winery: {
            id: number;
            name: string;
            seo_name: string;
            status: 0;
            review_status: string;
            background_image: any;
            statistics: {
              ratings_count: number;
              ratings_average: number;
              labels_count: number;
              wines_count: number;
            };
          };
        };
      };
      seen_vintage_id: number;
      bottle_count: number;
      coupon_discount_sum: number;
    }
  ];
  note: string;
  note_holding_state: any;
  automated_approval_checks: {
    validations: {
      mismatch: {
        name: string;
        passed: true;
        fail_reasons: any;
      };
      odd_bottle_size: {
        name: string;
        passed: true;
        fail_reasons: any;
      };
      stock_deficiency: {
        name: string;
        passed: true;
        fail_reasons: any;
      };
      vintage_matching: {
        name: string;
        passed: true;
        fail_reasons: any;
      };
    };
    executed_at: string;
  };
  shipping_instructions: any;
  sla: {
    type: string;
    expires_at: string;
  };
  preferred_delivery_date: any;
  expected_shipping_date: string;
  documents: any;
  cancelled_at: any;
  authorized_at: string;
  confirmed_at: string;
  shipped_at: any;
  created_at: string;
  refunded_at: any;
  captured_at: any;
  tokens: {
    Confirmed: string;
    Holding: string;
    'Request Cancellation': string;
    'Request Weather Hold': string;
    Shipped: string;
  };
  merchant: {
    id: number;
    name: string;
    seo_name: string;
    legal_name: any;
    description: string;
    country: string;
    state: any;
    status: number;
    image: {
      location: string;
      variations: {
        large_square: string;
        medium_square: string;
        small_square: string;
      };
    };
    shipping_estimate: any;
    impressum_url: any;
    tos_url: any;
    payment_options: {
      methods: [
        {
          id: number;
          name: string;
          capabilities: [
            {
              id: string;
              status: string;
              object: string;
              account: string;
              requested: true;
              requested_at: number;
              requirements: {
                current_deadline: number;
                currently_due: any;
                disabled_reason: string;
                errors: any;
                eventually_due: any;
                past_due: any;
                pending_verification: any;
              };
            },
            {
              id: string;
              status: string;
              object: string;
              account: string;
              requested: true;
              requested_at: number;
              requirements: {
                current_deadline: number;
                currently_due: any;
                disabled_reason: string;
                errors: any;
                eventually_due: any;
                past_due: any;
                pending_verification: any;
              };
            },
            {
              id: string;
              status: string;
              object: string;
              account: string;
              requested: true;
              requested_at: number;
              requirements: {
                current_deadline: number;
                currently_due: any;
                disabled_reason: string;
                errors: any;
                eventually_due: any;
                past_due: any;
                pending_verification: any;
              };
            }
          ];
        }
      ];
    };
    invoicing_settings: {
      reconciliation_method: string;
      stripe_charge: string;
      subsidiary_id: number;
    };
    vc_clearing_system: number;
    hidden: boolean;
    qa_instructions: string;
    commission_rate: number;
  };
  commission_rate: number;
  gift_message: any;
  shipping_tax_included: true;
  items_tax_included: true;
  shipping_tax_pct: number;
  compensation_shipping_sum_tax_included: number;
  payment_method: string;
  payment_provider: string;
  carrier: {
    service_name: string;
    carrier_service_system_id: string;
    service_type: string;
    quote_id: any;
    carrier_service_external_id: any;
    promised_delivery_date_from: string;
    promised_delivery_date_to: string;
    shipping_quote: number;
    name: string;
    description: string;
    service_description: string;
  };
  pickup_location_id: string;
  pickup_location_details: any;
  discount_tax: number;
  discount_ex_tax: number;
  discount_inc_tax: number;
  shipping_cost_ex_tax: number;
  shipping_cost_inc_tax: number;
  subtotal_ex_tax: number;
  subtotal_inc_tax: number;
  total_discount_tax: number;
  total_discount_ex_tax: number;
  total_discount_inc_tax: number;
  total_tax: number;
  total_ex_tax: number;
  total_inc_tax: number;
  tracking_number: any;
  tracking_url: any;
  signed_by: any;
  scheduled_delivery_date: any;
  shipping_external_id: any;
  shipping_provider_id: number;
  dispatched_at: any;
  delivered_at: any;
  free_order: any;
}
