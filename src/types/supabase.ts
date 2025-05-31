
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  ra?: string;
  class?: string;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythic';
  image_url?: string;
  available: boolean;
  copies_available?: number;
  event_id?: string;
  description?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface UserCard {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  acquired_at: string;
  card?: Card;
}

export interface Pack {
  id: string;
  name: string;
  available: boolean;
  limit_per_student: number;
  price: number;
  probability_common: number;
  probability_rare: number;
  probability_legendary: number;
  probability_mythic: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  bonus_multiplier: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  from_user_id: string;
  to_user_id: string;
  offered_cards: Record<string, number>;
  offered_coins: number;
  requested_cards: Record<string, number>;
  requested_coins: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface RewardLog {
  id: string;
  teacher_id: string;
  student_id: string;
  coins: number;
  reason: string;
  created_at: string;
}
