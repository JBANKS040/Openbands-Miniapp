//import type { JWK } from "@/lib/types";
import { getJwtHeader, extractDomain, getGooglePublicKey } from "@/lib/google-jwt/GoogleJwt";

export async function generateZkJwtProof(email: string, idToken: string): Promise<{ proof: any, publicInputs: any }> {
  const domain = extractDomain(email);
  //const domain = email.split('@')[1];

  const jwtHeader = getJwtHeader(idToken);
  const jwtPubkey = await getGooglePublicKey(jwtHeader.kid);

  let proof: any;
  let publicInputs: any;

  return { proof, publicInputs }; // Placeholder for actual proof generation logic
}