export const en = {
  resources: 'Resources',
  navbar: {
    brand: 'Rent-O-Infra',
    subBrand: "Researcher's View",
    links: {
      home: 'Home',
      bookings: 'Bookings',
      settings: 'Settings',
      resources: 'Resources',
    },
  },
  resourcesTable: {
    all: 'All',
    equipment: 'Equipment',
    service: 'Service',
    listed: 'Listed',
    unlisted: 'Unlisted',
    subscriptions: 'Subscriptions',
    name: 'Name',
    type: 'Type',
    timeSlotUnit: 'Time Slot Unit',
    pricePerUnit: 'Price Per Unit',
    status: 'Status',
    add: 'Add',
    addEquipment: 'Add an Equipment',
    addService: 'Add a Service',
    subscription: 'Subscription',
    per: 'per',
  },
  login: {
    hero: {
      headline:
        'Level up your experiments by experiencing premium equipments & services',
    },
    form: {
      labels: {
        username: 'User name or email address',
        password: 'Your password',
      },
      buttons: {
        google: 'Continue with Google',
        facebook: 'Continue with Facebook',
        apple: 'Continue with Apple',
        signIn: 'Sign in',
        hide: 'Hide',
        show: 'Show',
        signUp: 'Sign up',
      },
      links: {
        forgotPassword: 'Forget your password',
      },
      text: {
        or: 'OR',
        noAccount: "Don't have an acount?",
      },
    },
  },
  landingPage: {
    navbar: {
      logo: 'Rent-O-Infra',
      links: [
        { label: 'Explore Listings', href: '/listings' },
        { label: 'For Labs', href: '/labs' },
        { label: 'About', href: '#about' },
      ],
      actions: {
        login: 'Login',
        logout: 'Logout',
        partner: 'Partner with Us',
      },
    },
    hero: {
      title: {
        main: 'Access World-Class',
        accent: 'Research Infrastructure.',
      },
      description:
        'Rent equipment and book scientific services from top universities. No paperwork, just results.',
      search: {
        placeholder: 'Search equipment...',
        selectInstitution: 'Select Institution',
        institutions: {
          iit: 'IIT Delhi',
          mit: 'MIT',
          stanford: 'Stanford',
        },
      },
      stats: {
        active: 'Active',
        equip: 'Equip.',
        users: 'Users',
        rev: 'Rev.',
      },
    },
    howItWorks: {
      heading: 'From Hypothesis to Experiment in Minutes.',
      subheading:
        'A streamlined workflow designed for researchers who value their time.',
      steps: [
        {
          step: '01',
          title: 'Discovery',
          description: 'Search verified availability across 50+ universities.',
        },
        {
          step: '02',
          title: 'Comparison',
          description:
            'Compare technical specifications and pricing instantly.',
        },
        {
          step: '03',
          title: 'Booking',
          description: 'Book time slots with a standardized SLA.',
        },
        {
          step: '04',
          title: 'Execution',
          description: 'Coordinate with Lab Directors directly.',
        },
      ],
      previews: [
        {
          title: 'Search Results',
          items: [
            'Mass Spectrometer - IIT Delhi',
            'NMR 600MHz - Stanford',
            'Cryo-EM - MIT',
          ],
          status: 'Available',
        },
        {
          title: 'Equipment Specs',
          labels: {
            res: 'Resolution',
            rate: 'Rate',
            avail: 'Availability',
            lead: 'Lead Time',
          },
          values: {
            res: '0.1 nm',
            rate: '$180/hr',
            avail: 'High',
            lead: '24 hrs',
          },
        },
        {
          title: 'Request Access',
          date: 'Jan 15, 2026 • 9:00 AM',
          button: 'Confirm Booking',
        },
        {
          title: 'Direct Communication',
          roles: { director: 'Lab Director', user: 'You' },
          texts: {
            director: 'Instructions sent. See you Monday!',
            user: 'Perfect, samples are ready.',
          },
        },
      ],
    },
    dualValue: {
      heading: 'Built for Both Sides',
      subheading:
        'Whether you need access or want to share your facility, we make it seamless.',
      researcher: {
        title: 'For Researchers',
        description:
          'Access world-class equipment without the bureaucracy. Focus on discovery, not logistics.',
        button: 'Find Equipment',
        benefits: [
          'Access equipment from 50+ universities',
          'Transparent pricing with no hidden fees',
          'Instant compliance and documentation',
          'Direct communication with lab managers',
        ],
      },
      lab: {
        title: 'For Labs',
        description:
          'Turn idle equipment into revenue. Streamline operations with automated workflows.',
        button: 'List Your Lab',
        benefits: [
          'Monetize idle equipment capacity',
          'Automated billing and invoicing',
          'Vetted and verified researchers',
          'Full control over availability',
        ],
      },
    },
    footer: {
      cta: {
        heading: 'Ready to accelerate?',
        subheading:
          'Join hundreds of researchers and institutions already transforming how science gets done.',
        button: 'Get Started',
      },
      brand: 'Rent-O-Infra',
      links: [
        { label: 'Privacy Policy', href: 'privacyPolicy' },
        { label: 'Terms of Service', href: '/termsOfService' },
        { label: 'Support', href: '#Support' },
      ],
      copyright: 'All rights reserved.',
    },
    // src/lib/locales/en.ts
    contactModal: {
      title: 'Inquiry Form',
      successMessage: 'Inquiry submitted successfully!',
      submit: 'Submit Inquiry',
      confirm: {
        title: 'Confirm Submission',
        content: 'Are you sure you want to submit this inquiry?',
        ok: 'Yes, Submit',
        cancel: 'Cancel',
      },
      fields: {
        name: {
          label: 'Full Name',
          placeholder: 'John Doe',
          error: 'Please enter your name',
        },
        email: {
          label: 'Email Address',
          placeholder: 'email@example.com',
          errorRequired: 'Email is required',
          errorInvalid: 'Enter a valid email',
        },
        phone: {
          label: 'Phone Number',
          placeholder: 'Enter phone number',
          errorRequired: 'Phone number is required',
          errorInvalid: 'Invalid phone format',
          errorLength: 'Phone number must be exactly 10 digits', // Add this line
        },
        message: {
          label: 'Message Box',
          placeholder: 'Your message...',
          error: 'Please enter your message',
        },
      },
    },
  },
  table: {
    equipmentService: 'Equipment/ Service',
    dateBooking: 'Date of Booking',
    lab: 'Lab',
    timeBooking: 'Time of Booking/ Duration',
    paid: 'Amount Paid',
    status: 'Status',
    action: 'Action',
    paymentStatus: 'Payment Status',
    dateTimeBooking: 'Date/ Time of Booking',
    buttonReject: 'Reject',
    buttonApprove: 'Approve',
  },
  settingsPage: {
    team: 'Team',
    you: 'You',
    bannerAlt: 'Banner',
    logoAlt: 'Logo',
    profile: 'My Profile',
    personalInfo: 'Personal Info',
    email: 'Email',
    phone: 'Phone',
    university: 'University',
    degree: 'Degree',
    inbox: 'Inbox',
    selectChat: 'Select a chat to start messaging',
    typeMessage: 'Type your message',
  },

  privacyPolicy: {
    title: 'Privacy Policy',
    effectiveDate: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        content: [
          'Welcome to RENT O INFRA ("Company", "we", "our", "us"). We operate the website www.rent-o-infra.com (the "Platform"), a marketplace connecting Institutions (including but not limited to universities, colleges, private laboratories, and research centers) offering scientific equipment for rent ("Lessors") with Lab Researchers and other entities looking to rent such equipment ("Lessees").',
          'We value your trust and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of the Platform and the payment services provided by our partner, Razorpay.',
          'By accessing or using the Platform, you agree to be bound by the terms of this Privacy Policy. If you do not agree, please do not use or access our Platform.',
        ],
      },
      {
        id: 'data-collection',
        title: 'Information We Collect',
        content:
          'We collect information to provide our services, process transactions, and improve the user experience.',
        subSections: [
          {
            subtitle: 'A. Information You Give Us',
            description:
              'When you register for an account (as an Institution or Researcher), list equipment, or make a booking, we collect:',
            items: [
              'Identity Data: Name, job title, department, and government-issued identification.',
              'Contact Data: Email address, phone number, and physical billing/shipping address.',
              'Institutional Data: Name of the Institution, registration details, tax identification numbers (GSTIN/PAN).',
              'Profile Data: Username, password, equipment listings, rental history, and feedback.',
            ],
          },
          {
            subtitle: 'B. Information We Collect Automatically',
            description:
              'We use technology to collect data about how you use our platform:',
            items: [
              'Device & Log Data: IP address, browser type, operating system, and timestamps.',
              'Cookies: We use cookies to manage sessions and prevent fraud.',
            ],
          },
          {
            subtitle: 'C. Payment Information (Razorpay)',
            description: 'We use Razorpay to facilitate secure payments:',
            items: [
              'What We Do Not Store: We do not store complete card numbers, CVV, or UPI PINs.',
              'What We Do Collect: Transaction ID, Payment Method, Status, and Date for invoicing.',
            ],
          },
        ],
      },
      {
        id: 'usage',
        title: 'How We Use Your Information',
        content: 'We use the collected information for the following purposes:',
        items: [
          'Service Facilitation: To verify the identity of Institutions and Researchers, facilitate equipment bookings, and manage the rental lifecycle.',
          'Payment Processing: To process payments, refunds, and settlements via Razorpay.',
          'Communication: To send booking confirmations, invoices, technical notices, security alerts, and support messages.',
          'Security & Fraud Prevention: To detect and prevent fraudulent transactions, abuse of the Platform, and security incidents.',
          'Legal Compliance: To comply with applicable laws (such as GST regulations, KYC norms) and enforce our Terms and Conditions.',
        ],
      },
      {
        id: 'sharing',
        title: 'Sharing and Disclosure of Information',
        content:
          'We maintain strict confidentiality of your data. We do not sell your personal information. We disclose your information only in the following circumstances:',
        subSections: [
          {
            subtitle: 'A. Between Users (Institution and Researcher)',
            description:
              'Once a rental booking is confirmed, we share necessary contact and identification details of the Researcher with the Institution (and vice versa) to facilitate handover and communication.',
          },
          {
            subtitle: 'B. Third-Party Service Providers',
            description:
              'We share data with third-party vendors who perform services on our behalf:',
            items: [
              'Razorpay (Payment Processor): To process your payment securely using your Name, Contact Info, and Transaction Amount.',
              'Cloud Hosting & IT Services: To maintain the Platform’s infrastructure.',
              'SMS/Email Providers: To send transactional notifications.',
            ],
          },
          {
            subtitle: 'C. Legal Requirements',
            description:
              'We may disclose your information if required by law or in good faith belief to:',
            items: [
              'Respond to claims asserted against RENT O INFRA.',
              'Comply with legal process (e.g., subpoenas or warrants).',
              'Enforce and administer our agreements with users.',
              'Protect the rights, property, or safety of RENT O INFRA, its users, or the public.',
            ],
          },
        ],
      },
      {
        id: 'payment-security',
        title: 'Razorpay & Payment Security',
        content:
          'Your financial security is our priority. By using our Platform to make payments, you acknowledge and agree to the following:',
        items: [
          'Data Transfer: You authorize us to share your personal information with Razorpay to enable the payment transaction.',
          'Razorpay’s Privacy Policy: All financial information entered by you at the payment stage is processed directly by Razorpay according to their security standards (including PCI-DSS compliance).',
          'Liability: You acknowledge that RENT O INFRA is not responsible for any information intercepted during transmission to Razorpay or for security breaches occurring on their infrastructure.',
        ],
        externalLink: 'https://razorpay.com/privacy/',
      },
      {
        id: 'cookies',
        title: 'Cookies and Tracking Technologies',
        content:
          'We use cookies to analyze trends, administer the website, verify login status, and track users’ movements around the website.',
        items: [
          'Razorpay Cookies: Razorpay may place cookies on your device during the checkout process to identify your device, secure the transaction, and prevent fraud.',
          'Opt-Out: You can control the use of cookies at the individual browser level. If you reject cookies, you may still use our website, but features like payment processing may be limited.',
        ],
      },
      {
        id: 'retention',
        title: 'Data Retention',
        content: [
          'We retain your personal information for as long as is necessary to fulfill the purposes outlined in this Privacy Policy, including for satisfying any legal, accounting, or reporting requirements (e.g., maintaining transaction records for tax authorities for up to 8 years).',
          'If you request to delete your account, we will delete your personal data, except for data we are required to retain by law or for legitimate business purposes (such as fraud prevention).',
        ],
      },
      {
        id: 'security',
        title: 'Data Security',
        content:
          'We have implemented appropriate physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access to your information and to maintain data security.',
        items: [
          'Encryption: Secure Socket Layer (SSL) technology is used to encrypt data during transmission.',
          'Access Control: Access to personal information is restricted to employees and authorized personnel who need it to perform specific job functions.',
        ],
      },
      {
        id: 'rights',
        title: 'Your Rights',
        content:
          'As a user of RENT O INFRA, you have the right to manage your personal information as follows:',
        items: [
          'Access: Request a copy of the personal data we hold about you.',
          'Correction: Request correction of any incomplete or inaccurate data we have on record.',
          'Erasure: Request deletion of your personal data, subject to our legal retention requirements.',
          'Withdraw Consent: Withdraw your consent for data processing at any time without affecting prior lawfulness.',
        ],
        contactInfo: 'support@rent-o-infra.com', // Replace with your actual email
      },
      {
        id: 'third-party',
        title: 'Third-Party Links',
        content:
          "The Platform may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
      },
      {
        id: 'childrens-privacy',
        title: "Children's Privacy",
        content:
          'Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we take steps to remove that information from our servers.',
      },
      {
        id: 'changes',
        title: 'Changes to this Privacy Policy',
        content:
          "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
      },
      {
        id: 'grievance-officer',
        title: 'Grievance Officer',
        content:
          'In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of the Grievance Officer are provided below:',
        officerDetails: {
          name: 'Mohammed Mustafa Jafer',
          designation: 'Grievance Officer',
          entity: 'Lifestyle Plus AI Labs LLP',
          address:
            'No.47/1, 2nd cross, BHEL Layout, Jayanagar, Bangalore-560041',
          email: 'lplusailabs@gmail.com',
          phone: '+91 72040 94741',
          timing: 'Mon - Fri (10:00 AM - 6:00 PM)',
        },
        razorpayNote:
          'If you have any questions about this Privacy Policy or how we handle your data in relation to Razorpay, please contact us at the email provided above.',
      },
    ],
  },
  termsOfService: {
    title: 'Terms of Service',
    lastUpdated: 'January 14, 2026',
    sections: [
      { id: 'acceptance', title: 'Acceptance of Terms' },
      { id: 'user-obligations', title: 'User Obligations' },
      { id: 'bookings', title: 'Booking & Cancellations' },
      { id: 'payments', title: 'Payments & Fees' },
      { id: 'liability', title: 'Limitation of Liability' },
      { id: 'intellectual-property', title: 'Intellectual Property' },
      { id: 'termination', title: 'Termination' },
      { id: 'governing-law', title: 'Governing Law' },
    ],
  },
  aboutPage: {
    title: 'About Us',
    subtitle: 'Empowering Research. Optimizing Resources.',
    intro:
      'Welcome to RENT O INFRA, India’s premier online marketplace dedicated to democratizing access to scientific and laboratory infrastructure. We are bridging the gap between Institutions that possess world-class scientific equipment and the Researchers who need them to bring their innovations to life.',
    sections: [
      {
        title: 'Our Story',
        content: [
          'In the world of scientific research and development, a significant paradox exists. On one hand, premier educational institutions and private laboratories possess state-of-the-art equipment that often sits idle for days or weeks.',
          "RENT O INFRA was born to solve this inefficiency. We realized that science shouldn't be limited by ownership; it should be enabled by access. By creating a secure, transparent, and efficient sharing economy for scientific infrastructure, we are ensuring that valuable resources are utilized to their full potential.",
        ],
      },
      {
        title: 'Our Mission',
        content:
          'To accelerate scientific innovation by building a collaborative ecosystem where high-end research infrastructure is accessible, affordable, and efficiently utilized.',
      },
      {
        title: 'What We Do',
        content: 'RENT O INFRA is a specialized platform where:',
        items: [
          'Institutions (Lessors) can list their scientific equipment (Microscopes, Spectrometers, etc.) to generate revenue and recover maintenance costs.',
          'Researchers (Lessees) can browse, book, and use this equipment on a pay-per-use basis, eliminating massive upfront investments.',
        ],
      },
      {
        title: 'Why Choose RENT O INFRA?',
        items: [
          'Verified Network: We onboard verified Institutions and Researchers to ensure a safe environment.',
          'Seamless Booking: Hassle-free interface to check availability and book slots.',
          'Secure Payments: Partnered with Razorpay for encrypted, industry-standard financial security.',
          'Cost-Efficiency: Save millions in procurement while turning assets into revenue.',
        ],
      },
      {
        title: 'Our Commitment to Science',
        content:
          'We are more than just a rental platform; we are an enabler of the Indian R&D ecosystem. Whether you are a University looking to maximize asset utilization or a Researcher on the brink of a breakthrough, RENT O INFRA is your infrastructure partner.',
      },
    ],
    contactInfo: {
      title: 'Contact Us',
      description: 'Have questions or want to partner with us?',
      email: 'support@rentoinfra.com', // Update with actual email
      location: 'Bengaluru, India', // Update with actual city
    },
  },
};
