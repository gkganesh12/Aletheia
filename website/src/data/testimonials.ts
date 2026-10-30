export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "We needed an MVP in six weeks and Aletheia delivered a production-ready platform — clean architecture, scalable backend, deployed and working. Not throwaway code. The real thing.",
    author: "Rahul Deshmukh",
    role: "Founder",
    company: "RD Fitness",
  },
  {
    id: "testimonial-3",
    quote:
      "We were drowning in alerts from Sentry and Datadog. After Nirvana, alert noise dropped by 80%. Our engineers finally stopped ignoring notifications. It's genuinely changed how our team operates.",
    author: "Arjun Nair",
    role: "Engineering Lead",
    company: "Stackline Technologies",
  },
  {
    id: "testimonial-4",
    quote:
      "The scraping SDK just works. Three lines of code to get structured data from any URL. We integrated Inscrape into our data pipeline in under a day. Clean API, great error handling, async support out of the box.",
    author: "Priya Kulkarni",
    role: "Senior Data Engineer",
    company: "DataForge Analytics",
  },
  {
    id: "testimonial-5",
    quote:
      "What impressed me most was the speed without cutting corners. Full-stack app, AI integration, deployment — all shipped fast with code I could actually maintain and extend myself after handoff.",
    author: "Vikram Sharma",
    role: "CTO",
    company: "NexGen Solutions",
  },
];
