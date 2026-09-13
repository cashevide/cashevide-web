export type PendingLegalDoc = {
  id: number;
  doc_type: string;
  version: string;
};

export type UserProfile = {
  user_id: number;
  email: string;
  username: string;
  full_name: string;
  profile_picture: string | null;
  phone_number: string;
  job_title: string;
  referral_code: string;
  referred_by: number | null;
  credit_points: number;
  has_pending_agreements: boolean;
  pending_legal_docs: PendingLegalDoc[];
  has_password: boolean;
};
