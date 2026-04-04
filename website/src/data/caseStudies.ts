export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "novacrest-ransomware",
    title: "Stopping a Nation-State Ransomware Campaign in Real Time",
    client: "NovaCrest Financial",
    industry: "Financial Services",
    challenge:
      "NovaCrest faced a sophisticated, multi-stage ransomware attack attributed to a nation-state APT group. Traditional EDR tools flagged the initial payload but failed to correlate lateral movement across 12,000 endpoints, leaving the SOC overwhelmed with fragmented alerts.",
    solution:
      "Nirvana's autonomous response engine was deployed alongside SwarmScope sensor agents across the full estate. The swarm detected lateral movement within 400 milliseconds, Nirvana isolated compromised segments and rolled back encrypted files — all without human intervention.",
    results: [
      "Mean-time-to-contain reduced from 4.2 hours to 2.8 minutes",
      "Zero data exfiltration confirmed via forensic analysis",
      "$14M estimated loss averted based on industry benchmarks",
      "SOC alert volume reduced by 87% through intelligent deduplication",
    ],
  },
  {
    id: "helios-dark-web",
    title: "Uncovering a Massive Credential Leak Before Exploitation",
    client: "Helios Health Systems",
    industry: "Healthcare",
    challenge:
      "Helios had no visibility into dark web marketplaces where patient data and employee credentials were being traded. A previous breach had gone undetected for nine months, resulting in regulatory penalties and reputational damage.",
    solution:
      "Inscrape was configured to monitor over 200 dark web forums, paste sites and Telegram channels for any mention of Helios assets. Entity resolution algorithms linked fragmented data points to build a comprehensive exposure map within days of deployment.",
    results: [
      "Discovered 34,000 compromised credentials within the first 72 hours",
      "Proactive password resets prevented any confirmed account takeover",
      "Ongoing monitoring reduced average exposure window from 9 months to under 48 hours",
      "Achieved full HIPAA breach-notification compliance ahead of audit cycle",
    ],
  },
  {
    id: "meridian-adversarial-ml",
    title: "Hardening Fraud Detection Models Against Adversarial Attack",
    client: "Meridian Commerce",
    industry: "E-Commerce & Fintech",
    challenge:
      "Meridian's ML-based fraud detection system was being systematically evaded by organised fraud rings using adversarial perturbation techniques. Chargebacks had increased 40% quarter-over-quarter despite model retraining efforts.",
    solution:
      "Aletheia AI's adversarial ML capabilities were used to conduct a full red-team assessment of the fraud models, identifying evasion vectors through gradient-based and black-box attack simulations. Adversarial training, input sanitisation and ensemble hardening were applied to make the models robust against known and novel attack classes.",
    results: [
      "Fraud evasion rate dropped from 23% to under 2%",
      "Chargeback volume decreased by 61% in the first quarter post-deployment",
      "Model robustness validated against MITRE ATLAS adversarial ML framework",
      "Ongoing red-team retainer ensures continuous model resilience",
    ],
  },
  {
    id: "atlas-zero-trust",
    title: "Achieving Full-Spectrum Visibility Across a Hybrid Infrastructure",
    client: "Atlas Logistics Group",
    industry: "Supply Chain & Logistics",
    challenge:
      "Atlas operated a sprawling hybrid infrastructure across 14 countries with significant shadow IT. The security team had no unified asset inventory and was blind to lateral movement between on-prem OT systems and cloud workloads.",
    solution:
      "SwarmScope agents were deployed across all network segments, cloud accounts and OT environments. The swarm-intelligence layer built a real-time asset graph, identified 340 previously unknown devices and established continuous zero-trust posture scoring for every asset.",
    results: [
      "Discovered 340 unmanaged devices including 28 internet-exposed OT controllers",
      "Reduced attack surface by 52% through micro-segmentation recommendations",
      "Achieved zero-trust maturity score of 4.1/5.0 within six months",
      "Unified visibility across AWS, Azure, on-prem and OT in a single dashboard",
    ],
  },
];
