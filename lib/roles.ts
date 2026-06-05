export type RoleId = 'motion-designer' | 'visual-designer'

export interface Role {
  id: RoleId
  title: string
  type: string
  location: string
  summary: string
  description: string
  whatYoullDo: string[]
  lookingFor: string[]
  niceToHave: string
  whyAfterThought: string
}

export const roles: Role[] = [
  {
    id: 'motion-designer',
    title: 'Motion Graphic Designer',
    type: 'Full-time',
    location: 'Bangalore · Remote considered',
    summary: 'We need a motion designer who treats animation as a language. You\'ll own brand films, social content, and UI animation from brief to final render.',
    description: 'Motion at Afterthought isn\'t decoration — it\'s how brands move, breathe, and speak. We\'re looking for someone who understands that timing is everything, that a 12-frame ease can carry more feeling than a paragraph of copy, and that the best motion work feels inevitable rather than impressive.\n\nYou\'ll work across brand films, social content, title sequences, and UI animation — often from brief to final render with full creative ownership. We\'re small on purpose, which means you\'ll shape the work rather than execute someone else\'s vision.',
    whatYoullDo: [
      'Lead motion design across brand identity projects — from logo animations to full brand motion systems',
      'Concept and produce short-form brand films, social content, and explainer videos',
      'Build reusable motion templates and guidelines for client handoff',
      'Collaborate directly with visual designers to extend static identities into motion',
      'Occasionally present and explain motion rationale to clients',
      'Stay close to emerging tools and bring new techniques into the studio\'s practice',
    ],
    lookingFor: [
      '3+ years of professional motion design experience',
      'Strong command of After Effects; Cinema 4D or Blender a plus',
      'A reel that shows range — brand motion, not just Instagram loops',
      'Deep understanding of timing, easing, and motion principles at a craft level',
      'Ability to work from brand guidelines and extend them into motion systems',
      'Comfortable owning briefs end-to-end with minimal hand-holding',
    ],
    niceToHave: 'Experience with expressions or scripting in After Effects. Familiarity with Lottie/web animation exports. A background in traditional animation or film. Experience building motion guidelines as part of brand delivery.',
    whyAfterThought: 'You\'ll have genuine creative ownership from day one — no layers of approval, no watered-down briefs. The studio is intentionally small, which means your work defines the studio\'s output. We care about craft above everything else, and we hire accordingly.',
  },
  {
    id: 'visual-designer',
    title: 'Visual Designer',
    type: 'Full-time',
    location: 'Bangalore · Remote considered',
    summary: 'We need a visual designer who thinks in systems, not just screens. You\'ll lead brand identity work from initial concepts to complete guidelines.',
    description: 'Brand identity is the core of everything we do at Afterthought. When we take on a brand project, we\'re not making a logo — we\'re building a system that has to hold up across every touchpoint, scale from a business card to a billboard, and still feel considered in five years.\n\nWe\'re looking for a visual designer who thinks in systems, sweats the details, and finds genuine satisfaction in the rigour of brand work. You\'ll lead projects from first concepts through to complete guidelines — working closely with the founders, directly with clients, and in collaboration with our motion practice.',
    whatYoullDo: [
      'Lead visual identity projects from strategy to final delivery — logos, colour, type, and beyond',
      'Build comprehensive brand guidelines that are genuinely useful, not just beautiful PDFs',
      'Adapt identities across print, digital, environmental, and social touchpoints',
      'Present concepts and rationale directly to clients with confidence',
      'Collaborate with the motion practice to create cohesive brand experiences',
      'Contribute to internal studio standards and the way we talk about design',
    ],
    lookingFor: [
      '3+ years working on brand identity or visual design projects',
      'Proficiency in Figma and the Adobe suite (Illustrator, Photoshop, InDesign)',
      'A portfolio with at least one complete brand identity case study',
      'Strong typographic sensibility and a command of colour systems',
      'Ability to present and defend design decisions clearly to clients',
      'Detail-obsessed — you notice the kerning, always',
    ],
    niceToHave: 'Experience with naming or verbal identity work. Motion design basics for brand handoffs. Packaging and print production knowledge. A point of view on what brand design is for.',
    whyAfterThought: 'You\'ll work on complete brand projects — not just executions of someone else\'s system. The studio is two people, which means you\'ll have a real voice in how we work and what we take on. We\'re early enough that the person we hire will shape what Afterthought becomes.',
  },
]

export function getRoleById(id: string): Role | undefined {
  return roles.find(r => r.id === id)
}
