export type LeadStatus = 'New' | 'Qualified' | 'Contacted';
export type LeadSource = 'Website Chat' | 'Referral' | 'Direct Mail' | 'Organic Search' | 'Webinar';

export interface ActivityItem {
  id: string;
  message: string;
  date: string;
  isRecent: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials?: string;
  source: LeadSource;
  status: LeadStatus;
  date: string;
  title: string;
  phone: string;
  location: string;
  sourceDetail: string;
  activities: ActivityItem[];
}

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_tHT5kQ2Mi-Muzcyt9B9OyxdGLzSvmRgpfB0m2o99MUv7H5E5_sB5vxu8HLkYMlF8_dqzF08TBftFmdvnBx3UtjmMMKYBRGvgCTLoxd6ImHKB1SqL-rh3H7lVzyxC667bHquOSsvxClaX5UFMT2MHyXvEURNZIwWydqNSMhITXuYPtv7Apc3iy1AhiM3bJvVjHFjEQ-i_-1hc6IXrx7bywfkruaKchUpOon6J9XTbFIPLDbpLH9u7bMUsty21MvXgipilvwczkAo',
    source: 'Website Chat',
    status: 'New',
    date: 'Oct 24, 2:30 PM',
    title: 'VP of Marketing, TechCorp',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    sourceDetail: 'Website Chatbot',
    activities: [
      { id: 'a1', message: 'Status changed to New', date: 'Oct 24, 2:30 PM', isRecent: true },
      { id: 'a2', message: 'Bot transferred to Human', date: 'Oct 24, 2:25 PM', isRecent: false },
      { id: 'a3', message: 'Lead captured', date: 'Oct 24, 2:20 PM', isRecent: false },
    ]
  },
  {
    id: '2',
    name: 'Michael Chang',
    email: 'm.chang@innovate.io',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmhYXvIZJhefqKkkVTXWmxp11Stw61HL-uVCJKds5Gz7PR8hwdNYHQysfxPhc4OcQqMCJtdaVe2IXQpYcuT4iBnzMqcnMmP24kAVL5IvgCYobN8eejf_uiiIiqwBS4fJNHSsiAAlQaKQ3hKFw6b8HiU2nhGQyBzrrY-y2RVzb--E3U0ori6_CaEdMDtzP3OrYf1yUwCDTzFusdjuIlsAYEBXXPnMtrTt74whHviC6f0rYb1n1yTOIkyIDqWAmRwzf54UVJxI1kJCw',
    source: 'Referral',
    status: 'Qualified',
    date: 'Oct 23, 11:15 AM',
    title: 'Director of Sales, Innovate.io',
    phone: '+1 (555) 234-5678',
    location: 'Austin, TX',
    sourceDetail: 'Partner Referral',
    activities: [
      { id: 'a1', message: 'Status changed to Qualified', date: 'Oct 23, 11:15 AM', isRecent: true },
      { id: 'a2', message: 'Added to CRM', date: 'Oct 23, 10:00 AM', isRecent: false },
    ]
  },
  {
    id: '3',
    name: 'Elena Rostova',
    email: 'elena@designstudio.net',
    initials: 'EL',
    source: 'Direct Mail',
    status: 'Contacted',
    date: 'Oct 22, 4:45 PM',
    title: 'Lead Designer, DesignStudio',
    phone: '+44 20 7123 4567',
    location: 'London, UK',
    sourceDetail: 'Q3 Mailer Campaign',
    activities: [
      { id: 'a1', message: 'Outbound email sent', date: 'Oct 22, 4:45 PM', isRecent: true },
      { id: 'a2', message: 'Responded to mailer', date: 'Oct 21, 2:00 PM', isRecent: false },
    ]
  },
  {
    id: '4',
    name: 'David Wallace',
    email: 'd.wallace@paperco.com',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALK439jdpN-LCH_DlKaWGTZjAzfFT2PKlIEnUfolR1iDFsBhMKcpbmzbfew0O2CVjI5tbyRPRsSA1rGdF2XqpnPZI5jJdp2FFW6-zacyXNyM9OO3QuKFHPH7V1YmCzRRay1rFqONsWOtnwAEY_FFl2jxCrcekUU99rAaW88U9rrq27nz2Sx0eoWHpICplw6C96o671-HS7ySUM8aIy0IA2QXKNKuDCe5B0K2kXFiIFn-AwJJyWw0ljkyTYpfF1NgRUBBaMD3AJihA',
    source: 'Organic Search',
    status: 'New',
    date: 'Oct 22, 9:00 AM',
    title: 'CFO, PaperCo',
    phone: '+1 (555) 987-6543',
    location: 'Scranton, PA',
    sourceDetail: 'Google Search - Pricing Page',
    activities: [
      { id: 'a1', message: 'Signed up for trial', date: 'Oct 22, 9:00 AM', isRecent: true },
    ]
  },
  {
    id: '5',
    name: 'Aisha Jones',
    email: 'ajones@logistics.co',
    initials: 'AJ',
    source: 'Webinar',
    status: 'Qualified',
    date: 'Oct 21, 1:20 PM',
    title: 'Operations Manager, Logistics Co',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    sourceDetail: 'Q3 Supply Chain Webinar',
    activities: [
      { id: 'a1', message: 'Attended webinar', date: 'Oct 21, 1:20 PM', isRecent: true },
      { id: 'a2', message: 'Registered for webinar', date: 'Oct 15, 10:00 AM', isRecent: false },
    ]
  }
];
