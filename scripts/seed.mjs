// Seeds Firestore with starter content adapted from the current site.
// Run once: `npm run seed`  (requires serviceAccount.json in the project root)
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccount.json", "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function set(coll, id, data) {
  await db.collection(coll).doc(id).set(data, { merge: true });
  console.log(`  ${coll}/${id}`);
}

async function run() {
  console.log("Seeding content…");

  await set("siteSettings", "global", {
    phone1: "+91-9620020759",
    phone2: "+91-7307048351",
    email: "info@reversosolutions.com",
    whatsapp: "7307048351",
    hours: "Mon–Fri: 09:00 – 17:00",
    address: "Bengaluru, Karnataka 560094",
    facebook: "https://www.facebook.com/ReversoSolution",
    instagram: "https://www.instagram.com/reverso_solutions/",
    youtube: "https://www.youtube.com/@reversosolutions7982",
    linkedin: "https://www.linkedin.com/company/reverso-solutions-pvt-ltd",
    // Toggle any homepage section on/off without touching code.
    sections: {
      hero: true,
      services: true,
      courses: true,
      staffing: true,
      testimonials: true,
    },
    // Toggle any header/mobile nav link on/off without touching code.
    nav: {
      about: true,
      services: true,
      courses: true,
      contact: true,
    },
  });

  await set("banners", "slide1", {
    image: "https://www.reversosolutions.com/reversosolutionsadmin/img/banner/202302251677320442slide1.jpg",
    heading: "Ready to begin your journey?",
    ctaText: "Learn more",
    ctaLink: "/about",
    order: 1,
    active: true,
  });
  await set("banners", "slide2", {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    heading: "Learn from industry experts",
    ctaText: "Explore courses",
    ctaLink: "/courses",
    order: 2,
    active: true,
  });
  await set("banners", "slide3", {
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    heading: "Get placed with top companies",
    ctaText: "Talk to us",
    ctaLink: "/contact",
    order: 3,
    active: true,
  });

  const services = [
    ["staffing-services", "Staffing Services", "A database of 10+ lakh candidates to match your hiring needs.", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"],
    ["web-solutions", "Web Solutions", "Responsive design, content strategy, graphic and logo design.", "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"],
    ["training-and-placement", "Training and Placement", "Job-oriented training with professionals from top MNCs.", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"],
  ];
  for (let i = 0; i < services.length; i++) {
    const [slug, title, excerpt, image] = services[i];
    await set("services", slug, {
      slug, title, excerpt, image, order: i + 1,
      bodyHtml: `<p>${excerpt}</p>`,
      active: true,
    });
  }

  const staffingSolutions = [
    [
      "career-counseling",
      "Career Counseling",
      "We help freshers and young professionals choose and plan the right career path, with guidance from people who've hired for it.",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    ],
    [
      "hire-on-contract",
      "Hire on Contract",
      "A ready bench of vetted, experienced professionals across sectors, available to join your payroll and start delivering fast.",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80",
    ],
    [
      "hire-an-expert",
      "Hire an Expert",
      "Need a specific skill set for a critical role? We source and screen niche experts so you only meet candidates worth interviewing.",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80",
    ],
  ];
  for (let i = 0; i < staffingSolutions.length; i++) {
    const [id, title, description, image] = staffingSolutions[i];
    await set("staffingSolutions", id, {
      title, description, image, order: i + 1, active: true,
    });
  }

  const PLACEMENT_MODULE = {
    title: "Career Support",
    items: [
      "Resume preparation by experts",
      "One-on-one live project explanation",
      "Two mock interviews",
      "Certificate of completion",
      "100% placement assistance",
    ],
  };

  const courses = [
    {
      slug: "telecom-2g-5g",
      title: "Telecom Training (2G/3G/4G/5G)",
      summary: "Get a career start in the telecommunication industry.",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
      price: 9999,
      mrp: 12999,
      duration: "30 days (5G: 12d · 4G: 12d · 2G/3G: 6d)",
      prerequisites: "No prior experience required — open to B.Tech, Diploma, ITI, B.Sc, MSc, BCA or MCA graduates",
      curriculum: [
        { title: "5G (NR – New Radio)", duration: "12 days", items: [
          "5G architecture and use cases",
          "Radio access technology fundamentals",
          "NR protocol stack",
          "Massive MIMO and beamforming",
        ]},
        { title: "4G (LTE)", duration: "12 days", items: [
          "LTE air interface and physical layer",
          "System architecture",
          "Call flows",
          "Industrial applications of LTE",
        ]},
        { title: "2G/3G (GSM/WCDMA)", duration: "6 days", items: [
          "GSM and WCDMA architectures",
          "Cell planning",
          "Handover mechanisms",
          "Frequency reuse",
        ]},
      ],
    },
    {
      slug: "sip-voip-ims-volte",
      title: "SIP/VoIP & IMS/VoLTE Protocol Testing",
      summary: "Become a highly paid protocol test engineer in top MNCs.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      price: 32000,
      duration: "90 days (SIP/VoIP: 35d · IMS/VoLTE: 40d · Tools & practicals: 15d)",
      prerequisites: "Any graduate or diploma from a recognized institution",
      curriculum: [
        { title: "SIP/VoIP Protocol Testing", duration: "35 days", items: [
          "SIP fundamentals, architecture, network elements",
          "Transactions and dialogs",
          "Call flows: hold, transfer, forwarding, conferencing",
          "Call management and pickup",
        ]},
        { title: "IMS/VoLTE Protocol Testing", duration: "40 days", items: [
          "IMS architecture and entities",
          "P-CSCF, I-CSCF, S-CSCF discovery mechanisms",
          "Application server assignment and preconditions",
          "IMS charging models",
          "Call flows: registration, VoLTE calls, IMS-to-PSTN, conferencing, SRVCC",
        ]},
        { title: "Hands-On Training", duration: "15 days", items: [
          "SIPp",
          "Wireshark",
          "JIRA",
          "Linux",
          "Reverso LAB practicals",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "python-basic-to-advance",
      title: "Basic to Advance Python",
      summary: "Add Python to your skillset and get a dream job in IT.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      price: 22000,
      mrp: 27500,
      duration: "90 days (Basic: 35d · Advanced: 40d · Placement: 15d)",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "Basic Python", duration: "35 days", items: [
          "Python fundamentals: print statements, comments, data structures, operators",
          "Program flow control: conditionals, loops, break/continue",
          "Functions and modules",
          "Exception handling and error management",
          "File handling operations",
          "Object-oriented programming: classes, inheritance, polymorphism",
          "Generators, iterators, and comprehensions",
          "Collections module",
        ]},
        { title: "Advanced Python", duration: "40 days", items: [
          "Database access and SQL operations",
          "Network programming and server-client architecture",
          "Date and time operations",
          "Functional programming: filters, maps, decorators",
          "Regular expressions",
          "Threading essentials",
          "API access and integration",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "campaign-development",
      title: "Campaign Development",
      summary: "Become a UNICA-based campaign developer.",
      image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
      price: 32000,
      duration: "90 days (Theory: 70d · Lab & practicals: 20d)",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "UNICA Fundamentals", duration: "70 days", items: [
          "UNICA architecture",
          "Campaign lifecycle, offers, and attributes",
          "The three process boxes (Blue, Red, Green) and their functions",
          "User variables and derived fields",
          "Macros and table structures",
          "Campaign and offer creation procedures",
          "Template and flowchart design",
          "Admin operations and SQL basics",
          "Post-campaign analysis",
        ]},
        { title: "Hands-On Practicals", duration: "20 days", items: [
          "Navigation and campaign building",
          "Flowchart creation and scheduling",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "core-advance-java",
      title: "Core & Advance JAVA",
      summary: "Train with Java and become a leading developer.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      price: 32000,
      duration: "120 days (Core: 30d · Advance: 35d · Career support: 20d)",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "Core JAVA", duration: "30 days", items: [
          "OOP concepts",
          "String handling",
          "Exception management",
          "Multithreading",
          "I/O operations",
          "JDBC database connectivity",
          "GUI development with Swing/AWT",
        ]},
        { title: "Advance JAVA", duration: "35 days", items: [
          "Servlets and JSP",
          "Design patterns",
          "Maven",
          "Struts2 framework",
          "EJB3",
          "JMS",
          "JPA persistence",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "technical-skills-program",
      title: "Technical Skills Development Program",
      summary: "The best program for a fresher to start a career.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      price: 12000,
      duration: "25 days training + 5 days placement support",
      prerequisites: "Any fresher graduate wanting to build technical skills for a good placement",
      curriculum: [
        { title: "Core Curriculum", duration: "25 days", items: [
          "Radio and cellular techniques overview",
          "Network generations (2G–5G)",
          "GSM, UMTS, LTE, and 5G architectures",
          "OFDMA air interface principles",
          "Evolved Packet Core operations",
          "Small cells and heterogeneous networks",
          "Self-organizing networks",
          "Linux commands and networking basics",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "industrial-training-telecom",
      title: "Industrial Training Certification in Telecom",
      summary: "6-week industrial training in telecommunication technology for B.Tech and B.E. students.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      price: 8000,
      duration: "25 days training + 5 days certification",
      prerequisites: "Any student seeking an industrial training certification",
      curriculum: [
        { title: "Core Curriculum", items: [
          "2G & 3G technologies: GSM, WCDMA — BTS, BSC, MSC, handover mechanisms",
          "4G (LTE) architecture and air interface specifications",
          "5G architecture, use cases, and spectrum information",
          "VoIP & VoLTE network architecture and protocols",
          "SIP protocol fundamentals",
          "Hands-on tower and BTS installation training",
        ]},
      ],
    },
    {
      slug: "selenium-java-automation",
      title: "Selenium with Java Automation",
      summary: "Become a qualified automation engineer with Selenium and Java.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      price: 32000,
      duration: "90 days (Main course: 75d · Career support: 15d)",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "Automation & Selenium Fundamentals", items: [
          "Automation testing concepts, advantages, disadvantages",
          "Selenium history, components, tool comparison",
        ]},
        { title: "Java Programming", items: [
          "Data types, control statements, functions, arrays",
          "OOP: classes, inheritance, exception handling, collections",
        ]},
        { title: "Selenium WebDriver", items: [
          "Page verification and navigation",
          "Dropdowns, alerts, iframes",
          "XPath and CSS locators",
        ]},
        { title: "Frameworks & Integration", items: [
          "TestNG configuration and execution",
          "Data-driven testing with Excel, parameterization",
          "Hybrid (keyword-driven) framework",
          "Database testing: MySQL, JDBC",
          "CI/CD: Jenkins, Git, GitHub",
          "Selenium Grid for distributed testing",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "devops",
      title: "DevOps",
      summary: "Master the tools and practices behind seamless dev-to-ops delivery.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
      price: 32000,
      mrp: 39999,
      duration: "150 days training + 30 days career support",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "Foundations", items: [
          "Introduction to DevOps",
          "OS concepts and Linux fundamentals",
          "Bash scripting",
        ]},
        { title: "Cloud & Infrastructure", items: [
          "Cloud computing & AWS with Terraform",
          "Cloud providers and IAM",
          "Services and APIs",
          "Serverless computing",
        ]},
        { title: "Delivery Pipeline", items: [
          "Version control with Git",
          "Containerization & orchestration: Docker & Kubernetes",
          "Configuration management with Ansible",
          "CI/CD pipelines with Jenkins",
        ]},
        { title: "Operations", items: [
          "Monitoring, logging & analytics with Prometheus",
          "Security & DevSecOps",
          "DevOps best practices",
        ]},
        PLACEMENT_MODULE,
      ],
    },
    {
      slug: "it-support-engineer",
      title: "IT Support Engineer",
      summary: "Build the technical support competencies today's digital workplaces need.",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
      price: 23000,
      duration: "75 days course + 15 days hands-on practice & interview prep",
      prerequisites: "Any graduate or diploma from a recognized university",
      curriculum: [
        { title: "IT Systems & Networking", items: [
          "IT systems and administration fundamentals",
          "Basic networking: IP addressing, DNS, DHCP, IPv4/IPv6",
          "Windows Server installation and Active Directory",
          "Network configuration and troubleshooting: routers, switches, VLANs",
        ]},
        { title: "Security & Operations", items: [
          "Security fundamentals: firewalls, encryption, threat identification",
          "Systems monitoring: ServiceNow, Jira, log analysis",
          "Troubleshooting techniques and disaster recovery",
        ]},
        { title: "Advanced Topics", items: [
          "Scripting basics: CMD and network scripting",
          "Automation tools and AI concepts",
          "Virtualization: VMware, Hyper-V",
          "Cloud services: AWS, Azure",
        ]},
        { title: "Career Support", duration: "15 days", items: [
          "Hands-on lab practice with real-world scenarios",
          "Interview preparation and resume coaching",
          "Voice and accent training",
        ]},
      ],
    },
  ];

  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    const moduleCount = (c.curriculum || []).length;
    await set("courses", c.slug, {
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      image: c.image,
      price: c.price,
      mrp: c.mrp ?? c.price,
      duration: c.duration,
      prerequisites: c.prerequisites,
      curriculum: c.curriculum || [],
      categoryId: "online-live",
      description: `<p>${c.summary} This program is spread across ${moduleCount} module${moduleCount === 1 ? "" : "s"}${c.duration ? ` over ${c.duration.toLowerCase()}` : ""}, combining structured theory with hands-on practice.</p>`,
      published: true,
      order: i + 1,
    });
  }

  const testimonials = [
    ["Md Touseef", "A collaborative learning environment — an excellent choice to advance your career.", "https://i.pravatar.cc/300?img=32"],
    ["Tripuresh Pandey", "Exceeded my expectations and gave me the tools to take my career forward.", "https://i.pravatar.cc/300?img=45"],
    ["Ravikash Virendra", "Detailed knowledge of protocol testing. Their own servers and lab for practicals.", "https://i.pravatar.cc/300?img=12"],
  ];
  for (let i = 0; i < testimonials.length; i++) {
    const [name, quote, photo] = testimonials[i];
    await set("testimonials", `t${i + 1}`, { name, quote, heading: "", photo, order: i + 1 });
  }

  await set("pages", "about", {
    slug: "about",
    title: "About Our Reverso Solutions",
    heroImage: "",
    seoTitle: "About Reverso Solutions",
    seoDescription: "Training, placement and web solutions for freshers and professionals.",
    videoUrl: "https://www.youtube.com/embed/01xgslnMsxo",
    bodyHtml: `
      <p class="lede">We are eager to give you the best education and style.</p>
      <p>A wise man always waits for great opportunities, but the problem is that it doesn't come easy all the way to you. Opportunities do not bang daily, but when it strikes, one should be aware and eager to grasp it. You should be prepared enough that no one else can snatch your share of the berry. This is the high time to open the window and see the outside world — maybe the day is knocking on your door.</p>
      <p>We, The Reverso Solutions, realized that the best opportunities are when you can truly help solve another's problem — in our case, helping you improve professionally. We are committed to providing you the opportunity that will help you build your career with limitless growth. We are dedicated to assisting freshers and telecom professionals with world-class training and placement facilities. The market is full of institutes providing such facilities, but at the same time, everyone is looking for a difference. We are proud to announce Reverso Solutions, known for its unique way of teaching that makes for better understanding among students. We have a great team built of highly experienced telecom (R&D engineers) professionals who understand current market requirements and help you fill the gap between industry requirements and your field of expertise.</p>
    `.trim(),
  });
  await set("pages", "privacy-policy", {
    slug: "privacy-policy",
    title: "Privacy Policy",
    heroImage: "",
    seoTitle: "Privacy Policy",
    seoDescription: "How we handle your data.",
    bodyHtml: "<p>Replace this with your privacy policy content.</p>",
  });

  console.log("Done. Remember to add yourself to /admins/{uid} to edit content.");
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
