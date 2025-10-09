import Vapi from "@vapi-ai/web";

const vapiToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.warn("NEXT_PUBLIC_VAPI_WEB_TOKEN is not set. VAPI functionality will be disabled.");
}

export const vapi = vapiToken ? new Vapi(vapiToken) : null;
