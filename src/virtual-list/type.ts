export interface ChatItem {
  key: string;
  role: 'agent' | 'user';
  text: string;
}