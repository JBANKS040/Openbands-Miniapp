//import type { JWK } from "@/lib/types";
import { extractDomain } from "@/lib/google-jwt/GoogleJwt";

export async function generateZkJwtProof(email: string, idToken: string): Promise<{ proof: any, publicInputs: any }> {
  const domain = extractDomain(email);
  //const domain = email.split('@')[1];
  
  let proof: any;
  let publicInputs: any;

  return { proof, publicInputs }; // Placeholder for actual proof generation logic
}