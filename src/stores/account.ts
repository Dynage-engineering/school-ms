import { atom } from 'nanostores';
import { pb } from '@/services/backend/pocketbase'

export const isLoggedInStore = atom(pb.authStore.isValid);
