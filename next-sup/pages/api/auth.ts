// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../services/supabase"


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //res.status(200).json({ name: 'John Doe' })
  return supabase.auth.api.setAuthCookie(req, res);
}
