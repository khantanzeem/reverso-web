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

  const courses = [
    ["telecom-2g-5g", "Telecom Training (2G/3G/4G/5G)", "Get a career start in the telecommunication industry.", 0, "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80"],
    ["sip-voip-ims-volte", "SIP/VoIP & IMS/VoLTE Protocol Testing", "Become a highly paid protocol test engineer in top MNCs.", 0, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"],
    ["python-basic-to-advance", "Basic to Advance Python", "Add Python to your skillset and get a dream job in IT.", 0, "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"],
    ["campaign-development", "Campaign Development", "Become a UNICA-based campaign developer.", 0, "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80"],
    ["core-advance-java", "Core & Advance JAVA", "Train with Java and become a leading developer.", 0, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"],
    ["technical-skills-program", "Technical Skills Development Program", "The best program for a fresher to start a career.", 0, "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"],
  ];
  for (let i = 0; i < courses.length; i++) {
    const [slug, title, summary, price, image] = courses[i];
    await set("courses", slug, {
      slug, title, summary, price, image,
      categoryId: "online-live",
      description: `<p>${summary}</p><h2>What you'll learn</h2><ul><li>Fundamentals</li><li>Hands-on labs</li><li>Interview preparation</li></ul>`,
      published: true, order: i + 1,
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
