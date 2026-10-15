// Design styles for the template gallery.
//
// These are previews of design directions, not a launched catalogue: the page
// says so, and nothing here claims sales, popularity or counts.
// TODO(launch): replace with the real launch set.

export const OCCASION_OPTIONS = ['Wedding', 'Birthday', 'Griha Pravesh', 'Baby shower', 'Anniversary', 'Pooja & festivals']
export const TRADITION_OPTIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'For everyone']
export const STYLE_OPTIONS = ['Royal', 'Traditional', 'Floral', 'Minimal', 'Modern']
export const COLOUR_OPTIONS = [
  ['royal', 'Maroon'],
  ['forest', 'Green'],
  ['gold', 'Gold'],
  ['ivory', 'Ivory'],
  ['blush', 'Blush'],
]
export const SORT_OPTIONS = [
  ['featured', 'Featured'],
  ['az', 'Name, A–Z'],
  ['za', 'Name, Z–A'],
]

export const TEMPLATES = [
  { id: 'rajwada', name: 'Rajwada', occasions: ['Wedding', 'Anniversary'], tradition: 'Hindu', style: 'Royal', theme: 'royal', motif: 'arch', eyebrow: 'Together with their families', title: 'Ananya & Kabir', featured: true },
  { id: 'marigold', name: 'Marigold', occasions: ['Birthday', 'Griha Pravesh'], tradition: 'For everyone', style: 'Traditional', theme: 'gold', motif: 'toran', eyebrow: 'Join us to celebrate', title: 'Aarav turns 5', featured: true },
  { id: 'mehendi', name: 'Mehendi garden', occasions: ['Wedding', 'Baby shower'], tradition: 'Hindu', style: 'Floral', theme: 'forest', motif: 'arch', eyebrow: 'Mehendi evening', title: 'Ishita & Dev', featured: true },
  { id: 'ivory', name: 'Ivory letterpress', occasions: ['Wedding', 'Anniversary', 'Pooja & festivals'], tradition: 'For everyone', style: 'Minimal', theme: 'ivory', motif: 'frame', eyebrow: 'Save the date', title: 'Riya & Arjun', featured: true },
  { id: 'noor', name: 'Noor', occasions: ['Wedding'], tradition: 'Muslim', style: 'Royal', theme: 'forest', motif: 'arch', eyebrow: 'Nikah ceremony', title: 'Zoya & Imran', featured: true },
  { id: 'anand', name: 'Anand', occasions: ['Wedding'], tradition: 'Sikh', style: 'Traditional', theme: 'gold', motif: 'frame', eyebrow: 'Anand Karaj', title: 'Simran & Harjot', featured: true },
  { id: 'rose', name: 'Rose dawn', occasions: ['Baby shower', 'Birthday'], tradition: 'For everyone', style: 'Floral', theme: 'blush', motif: 'sun', eyebrow: 'Godh Bharai', title: 'For Priya', featured: true },
  { id: 'vows', name: 'Ivory vows', occasions: ['Wedding', 'Anniversary'], tradition: 'Christian', style: 'Minimal', theme: 'ivory', motif: 'arch', eyebrow: 'Together with their families', title: 'Anna & Joel', featured: true },
  { id: 'diya', name: 'Diya night', occasions: ['Pooja & festivals', 'Griha Pravesh'], tradition: 'Hindu', style: 'Traditional', theme: 'royal', motif: 'sun', eyebrow: 'Diwali Milan', title: 'Lights & sweets' },
  { id: 'kesar', name: 'Kesar', occasions: ['Wedding', 'Pooja & festivals'], tradition: 'Jain', style: 'Traditional', theme: 'gold', motif: 'arch', eyebrow: 'Shubh Vivah', title: 'Jinal & Parth' },
  { id: 'jubilee', name: 'Golden jubilee', occasions: ['Anniversary', 'Birthday'], tradition: 'For everyone', style: 'Royal', theme: 'gold', motif: 'frame', eyebrow: '25 years together', title: 'Sunita & Rajesh' },
  { id: 'aangan', name: 'Aangan', occasions: ['Griha Pravesh', 'Pooja & festivals'], tradition: 'Hindu', style: 'Traditional', theme: 'ivory', motif: 'toran', eyebrow: 'Our new home', title: 'The Iyers' },
  { id: 'chaand', name: 'Chaand raat', occasions: ['Pooja & festivals'], tradition: 'Muslim', style: 'Minimal', theme: 'royal', motif: 'frame', eyebrow: 'Eid Milan', title: 'At the Qureshis' },
  { id: 'lohri', name: 'Lohri fire', occasions: ['Pooja & festivals', 'Birthday'], tradition: 'Sikh', style: 'Modern', theme: 'royal', motif: 'sun', eyebrow: 'Lohri di raat', title: 'Bonfire & bhangra' },
  { id: 'evergreen', name: 'Evergreen', occasions: ['Pooja & festivals'], tradition: 'Christian', style: 'Modern', theme: 'forest', motif: 'toran', eyebrow: 'Christmas evening', title: 'Carols at ours' },
  { id: 'confetti', name: 'Confetti', occasions: ['Birthday'], tradition: 'For everyone', style: 'Modern', theme: 'blush', motif: 'frame', eyebrow: 'Thirty, finally', title: 'Kabir turns 30' },
  { id: 'naamkaran', name: 'Naamkaran', occasions: ['Baby shower'], tradition: 'Hindu', style: 'Floral', theme: 'blush', motif: 'toran', eyebrow: 'Naming ceremony', title: 'Welcoming our girl' },
  { id: 'brunch', name: 'Little brunch', occasions: ['Baby shower', 'Birthday'], tradition: 'For everyone', style: 'Minimal', theme: 'ivory', motif: 'sun', eyebrow: 'Baby shower brunch', title: 'Little one soon' },
]

export const FEATURED = TEMPLATES.filter((t) => t.featured)
