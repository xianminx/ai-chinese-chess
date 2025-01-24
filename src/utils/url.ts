
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://chess.houkui.dev');

export const getAbsoluteUrl = (path: string) => {

  return `${baseUrl}${path}`;
} 