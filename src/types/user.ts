export interface UserPayload {
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_premium?: boolean;
  referrer_code?: number;
  wallet_address?: string;
}
