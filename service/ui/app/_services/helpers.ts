import { toast } from 'react-toastify';
import { TypeOptions } from 'react-toastify/dist/types';

/**
 * Notify the user with a toast message
 * @param message
 * @param type
 */
export function notify(message: string, type: TypeOptions = 'success') {
  return toast(message, {
    hideProgressBar: true,
    autoClose: 5000,
    type,
    position: 'top-right',
  });
}
