import type { SeedFormSpec, FieldOption } from './forms'

// Helper: turn a list of labels into FieldOption[]
function opts(labels: string[]): FieldOption[] {
  return labels.map(label => ({
    label,
    value: label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  }))
}

// ── Contact (site_role: contact, rendered at /contact) ─────────────────────────
export const CONTACT_FORM_SEED: SeedFormSpec = {
  title: 'Start a brief',
  slug: 'contact',
  description: 'Tell us about the thing you’re making. We reply within a week.',
  category: 'contact',
  site_role: 'contact',
  is_system: true,
  status: 'published',
  submit_label: 'Send the note',
  confirmation_message:
    'Got it — thank you. One of us will read it tomorrow morning over coffee, and write back within the week.',
  fields: [
    { type: 'short_text', label: 'Your name', required: true, placeholder: 'First & last' },
    { type: 'email', label: 'Email', required: true, placeholder: 'you@company.com' },
    { type: 'short_text', label: 'Company / project', placeholder: 'The thing you’re making' },
    {
      type: 'checkboxes',
      label: 'What might this be about?',
      description: 'Pick a few',
      options: opts(['Identity', 'Naming', 'Packaging', 'Digital & web', 'Editorial', 'Campaign', 'Not sure yet']),
    },
    {
      type: 'dropdown',
      label: 'Budget — a rough sense is fine',
      options: opts([
        'I’d rather discuss',
        'Under ₹15L / $20k',
        '₹15–40L / $20–50k',
        '₹40L–1Cr / $50–125k',
        'Above ₹1Cr / $125k',
        'Pro bono / cultural',
      ]),
    },
    {
      type: 'dropdown',
      label: 'When are you hoping to start?',
      options: opts([
        'Summer 2026 (we’re reading)',
        'Autumn 2026',
        'Winter 2026 / 27',
        'Whenever the right answer arrives',
      ]),
    },
    {
      type: 'paragraph',
      label: 'A paragraph or two. The brief, the question, the half-formed thing.',
      placeholder: 'No length minimum. Plain English is better than headings.',
    },
  ],
}

// ── Freelance (site_role: freelance, rendered at /careers/freelance) ───────────
export const FREELANCE_FORM_SEED: SeedFormSpec = {
  title: 'Join the freelance roster',
  slug: 'freelance',
  description: 'We read every application. If there’s a fit, we’ll reach out directly.',
  category: 'freelance',
  site_role: 'freelance',
  is_system: true,
  status: 'published',
  submit_label: 'Send application',
  confirmation_message: 'Got it. We’ll be in touch. We read every application — if there’s a fit, we’ll reach out directly.',
  fields: [
    { type: 'short_text', label: 'Name', required: true, placeholder: 'Anurag Gautam' },
    { type: 'email', label: 'Email', required: true, placeholder: 'you@studio.com' },
    {
      type: 'checkboxes',
      label: 'What you do',
      options: opts([
        'Brand Design', 'Motion & Animation', 'Strategy', 'Copywriting',
        'Web Development', 'Photography', 'Illustration', 'Other',
      ]),
    },
    { type: 'url', label: 'Portfolio or work link', placeholder: 'https://your-work.com' },
    {
      type: 'paragraph',
      label: 'A few words about your work',
      placeholder: 'What kind of briefs do you do your best work on?',
    },
  ],
}

export const SYSTEM_FORM_SEEDS: SeedFormSpec[] = [CONTACT_FORM_SEED, FREELANCE_FORM_SEED]

// ── Per-job application form (a fresh copy is created for each job) ─────────────
export function applicationFormSpec(jobTitle: string): SeedFormSpec {
  return {
    title: `Application — ${jobTitle}`,
    description: `Apply for the ${jobTitle} role. No cover letter needed — just fill this in honestly.`,
    category: 'application',
    is_system: false,
    status: 'published',
    submit_label: 'Send application',
    confirmation_message:
      'Application received. We’ll be in touch. We read every application personally — if there’s a fit, we’ll reach out directly.',
    fields: [
      { type: 'short_text', label: 'Full name', required: true, placeholder: 'Your name' },
      { type: 'email', label: 'Email', required: true, placeholder: 'you@email.com' },
      { type: 'url', label: 'Portfolio / work link', required: true, placeholder: 'https://your-work.com' },
      {
        type: 'dropdown',
        label: 'Years of experience',
        options: opts(['0–2 years', '2–5 years', '5+ years']),
      },
      {
        type: 'dropdown',
        label: 'Availability',
        options: opts(['Immediate', 'Within 1 month', '3+ months']),
      },
      {
        type: 'dropdown',
        label: 'Work type preference',
        options: opts(['Full-time', 'Contract / Freelance']),
      },
      {
        type: 'paragraph',
        label: 'Why Afterthought? What kind of work brings out your best?',
        placeholder: 'Keep it real — a few sentences is fine.',
      },
    ],
  }
}
