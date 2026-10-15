// Contact details. TODO(launch): fill these in. While a value is null the page
// says "Shared at launch" instead of showing a made-up address or number.
export const CONTACT = {
  email: null, // e.g. 'hello@yourdomain.com'
  whatsapp: null, // digits only, with country code, e.g. '919800000000'
  instagram: null, // handle without @
  city: null, // where the studio is based
}

export const CHANNELS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    note: 'Quickest for questions while you plan',
    value: CONTACT.whatsapp && `+${CONTACT.whatsapp}`,
    href: CONTACT.whatsapp && `https://wa.me/${CONTACT.whatsapp}`,
  },
  {
    id: 'email',
    label: 'Email',
    note: 'For longer briefs and bespoke designs',
    value: CONTACT.email,
    href: CONTACT.email && `mailto:${CONTACT.email}`,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    note: 'New designs as they are made',
    value: CONTACT.instagram && `@${CONTACT.instagram}`,
    href: CONTACT.instagram && `https://instagram.com/${CONTACT.instagram}`,
  },
]

export const TOPICS = ['Starting an invitation', 'A bespoke design', 'Pricing', 'Something else']
