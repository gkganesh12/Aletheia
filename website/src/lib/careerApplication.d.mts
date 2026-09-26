export function referralFromLink(value?: string | null): string;
export function careerApplicationPayload(
  jobTitle: string,
  data: {
    name: string;
    email: string;
    message: string;
    phone?: string;
    portfolio?: string;
    referralCode?: string;
  },
): Record<string, string>;
