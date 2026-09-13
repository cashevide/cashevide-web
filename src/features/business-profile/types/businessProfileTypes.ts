// -------------------- shared shape --------------------
export type BusinessProfile = {
  user_id: number;
  business_name: string;
  logo: string | null;
  gst_number: string;
  vat_number: string;
  address: string;
  phone_number: string;
  business_email: string;
  website: string;
  currency: string;
};

// -------------------- retrieve --------------------
// GET /users/business-profile/me/
export type BusinessProfileResponse = BusinessProfile;
