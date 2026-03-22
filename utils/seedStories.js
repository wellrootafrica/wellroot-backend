const mongoose = require('mongoose');
const Story = require('../models/Story');

const stories = [
  {
    title: "Empowering 500 Children Through Education in Volta Region",
    slug: "empowering-children-volta-region",
    category: "education",
    location: "Volta Region, Ghana",
    date: "March 2026",
    summary: "How our Learning Without Walls program transformed education for 500 children in rural communities.",
    fullStory: "In the remote villages of the Volta Region, children previously had to walk over 5 kilometers to reach the nearest school. Through our Learning Without Walls program, we established three community learning centers, provided educational materials, and trained 15 local teachers. Today, 500 children now have access to quality education within their communities. Attendance rates have increased by 85%, and early reading scores have improved by 60%.",
    impact: {
      children: 500,
      teachers: 15,
      communities: 8
    },
    testimonial: {
      quote: "My daughter can now read and write. She dreams of becoming a teacher. Thank you, WellRoot Africa!",
      name: "Akua Mensah",
      role: "Mother of two, Volta Region"
    },
    featured: true,
    status: "published"
  },
  {
    title: "FreshFlow Project Brings Clean Water to 10 Communities",
    slug: "freshflow-clean-water",
    category: "water",
    location: "Northern Region, Ghana",
    date: "February 2026",
    summary: "Installing boreholes and sanitation facilities transformed health outcomes for over 2,000 people.",
    fullStory: "In the Northern Region, communities relied on contaminated dam water, leading to frequent waterborne diseases. The FreshFlow Project installed 5 boreholes with hand pumps, built 20 latrines, and conducted hygiene education workshops. Waterborne diseases have decreased by 70%, and girls' school attendance has increased since they no longer spend hours fetching water.",
    impact: {
      beneficiaries: 2000,
      boreholes: 5,
      latrines: 20
    },
    testimonial: {
      quote: "We no longer fear drinking water. Our children are healthier, and we have more time to farm.",
      name: "Chief Ibrahim",
      role: "Community Leader, Northern Region"
    },
    featured: true,
    status: "published"
  },
  {
    title: "NourishHope Project Ends Malnutrition in 50 Schools",
    slug: "nourishhope-ends-malnutrition",
    category: "nutrition",
    location: "Central Region, Ghana",
    date: "January 2026",
    summary: "School feeding program reaches 3,000 children daily with nutritious meals.",
    fullStory: "Malnutrition rates were alarmingly high in 50 schools across the Central Region, affecting children's ability to learn and grow. The NourishHope Project established kitchen facilities, trained cooks, and provides daily nutritious meals to 3,000 children. School enrollment has increased by 40%, and teachers report improved concentration and performance.",
    impact: {
      children: 3000,
      schools: 50,
      meals: 450000
    },
    testimonial: {
      quote: "Before, many children came to school hungry. Now they have energy to learn and play.",
      name: "Madam Esi",
      role: "Head Teacher, Central Region"
    },
    featured: true,
    status: "published"
  },
  {
    title: "MediBOX Project Saves Lives in Remote Clinics",
    slug: "medibox-saves-lives",
    category: "health",
    location: "Upper East Region, Ghana",
    date: "December 2025",
    summary: "Essential medical supplies reach 15 rural clinics serving 25,000 people.",
    fullStory: "Rural clinics in the Upper East Region operated without basic supplies like gloves, bandages, and essential medicines. The MediBOX Project delivered 25 medical kits to 15 clinics, serving a population of 25,000. Maternal health outcomes have improved, and clinics can now treat common illnesses that previously required long journeys to distant hospitals.",
    impact: {
      clinics: 15,
      beneficiaries: 25000,
      kits: 25
    },
    testimonial: {
      quote: "We delivered a healthy baby using supplies from WellRoot Africa. We are forever grateful.",
      name: "Nurse Adwoa",
      role: "Midwife, Upper East Region"
    },
    featured: true,
    status: "published"
  },
  {
    title: "Community Empowerment: Women Lead Sustainable Farming",
    slug: "women-lead-farming",
    category: "empowerment",
    location: "Ashanti Region, Ghana",
    date: "November 2025",
    summary: "Training 200 women in sustainable agriculture transforms local economy.",
    fullStory: "In the Ashanti Region, 200 women received training in sustainable farming techniques, received seeds and tools, and formed cooperatives. They now grow vegetables year-round, feeding their families and selling surplus at local markets. The initiative has created economic independence and improved nutrition for over 1,000 people.",
    impact: {
      women: 200,
      families: 1000,
      cooperatives: 5
    },
    testimonial: {
      quote: "I can now pay my children's school fees from my farm proceeds. I am proud to be a farmer.",
      name: "Adjoa",
      role: "Farmer, Ashanti Region"
    },
    featured: true,
    status: "published"
  }
];

const seedStories = async () => {
  try {
    // Delete existing stories
    await Story.deleteMany();
    console.log('🗑️  Deleted existing stories');

    // Insert new stories
    const inserted = await Story.insertMany(stories);
    console.log(`✅ Inserted ${inserted.length} stories`);

    // Log the stories
    inserted.forEach(story => {
      console.log(`   - ${story.title} (${story.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding stories:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  const dotenv = require('dotenv');
  dotenv.config();
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      seedStories();
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { seedStories };