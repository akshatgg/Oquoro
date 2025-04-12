import { cookies } from 'next/headers';
import { verifyJwt } from '../lib/jwt'; // use your custom verifyJwt function

export async function getUserIdFromToken(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const decoded = verifyJwt(token);
  return decoded?.id || null;
}
