import { AxiosInstance } from 'axios';

export async function deleteMessages(
  apiTelegram: AxiosInstance,
  chat_id: number,
  message_ids: number[],
) {
  try {
    await apiTelegram.post('/deleteMessages', {
      chat_id,
      message_ids,
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
  }
}
