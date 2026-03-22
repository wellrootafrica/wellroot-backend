const mongoose = require('mongoose');
const Program = require('../models/Program');

const programs = [
  {
    title: "Learning Without Walls (LWW) & EduBox Project",
    slug: "learning-without-walls",
    subtitle: "Transforming Classrooms, Cultivating Young Minds",
    shortDescription: "The Learning Without Walls (LWW) and EduBox Project is WellRoot Africa's flagship education initiative, designed to break down barriers to quality learning in underserved schools.",
    fullDescription: "The Learning Without Walls (LWW) and EduBox Project is WellRoot Africa's flagship education initiative, designed to break down barriers to quality learning in underserved schools. Beyond supplying essential materials, this program promotes inclusive, child-centered education through modern, practical, and flexible approaches. We provide educational resources, Montessori and project-based learning materials, outdoor and experiential learning opportunities, life skills development, and school environment improvements.",
    category: "education",
    impact: {
      beneficiaries: 2500,
      locations: 25,
      yearStarted: 2025
    },
    keyComponents: [
      "Educational Resources Distribution",
      "Montessori and Project-Based Learning",
      "Outdoor and Experiential Learning",
      "Life Skills and Social-Emotional Development",
      "School Renovation and Learning Environment Improvement"
    ],
    featured: true,
    order: 1
  },
  {
    title: "NourishHope Project",
    slug: "nourish-hope",
    subtitle: "Fighting Hunger, Fueling Hope and Transforming Lives",
    shortDescription: "The NourishHope Project is WellRoot Africa's response to the critical challenges of food insecurity and malnutrition affecting children, families, and patients in underserved communities.",
    fullDescription: "The NourishHope Project is WellRoot Africa's response to the critical challenges of food insecurity and malnutrition affecting children, families, and patients in underserved communities. This program ensures that nutrition becomes a pillar of both educational success and community health. We provide nutrition support for children and families, establish meal centers at health facilities, create feeding support infrastructure, offer caregiver and community nutrition education, and run school feeding programs.",
    category: "nutrition",
    impact: {
      beneficiaries: 5000,
      locations: 30,
      yearStarted: 2025
    },
    keyComponents: [
      "Nutrition Support for Children and Families",
      "Meal Centers at Health Facilities",
      "Feeding Support Infrastructure",
      "Caregiver and Community Nutrition Education",
      "School Feeding Programs"
    ],
    featured: true,
    order: 2
  },
  {
    title: "FreshFlow Project",
    slug: "fresh-flow",
    subtitle: "Clean Water, Hygiene, and Dignity for All",
    shortDescription: "The FreshFlow Project tackles water and sanitation challenges by supporting schools and communities with WASH kits, menstrual hygiene supplies, and clean water access.",
    fullDescription: "The FreshFlow Project tackles water and sanitation challenges by supporting schools and communities with WASH (Water, Sanitation and Hygiene) kits, menstrual hygiene supplies for adolescent girls, handwashing stations, safe water containers, purification tools, and hygiene education campaigns. By improving access to water and sanitation, this program helps reduce disease outbreaks, increases girls' school attendance, and promotes healthy habits.",
    category: "water",
    impact: {
      beneficiaries: 3500,
      locations: 20,
      yearStarted: 2025
    },
    keyComponents: [
      "WASH (Water, Sanitation and Hygiene) kits",
      "Menstrual hygiene supplies for adolescent girls",
      "Handwashing stations",
      "Safe water containers and purification tools",
      "Hygiene education and behavioral change campaigns"
    ],
    featured: true,
    order: 3
  },
  {
    title: "MediBOX Project",
    slug: "medibox",
    subtitle: "Delivering Lifesaving Health Supplies to the Last Mile",
    shortDescription: "Rural and low-resource health centers often lack essential supplies. The MediBOX Project provides first aid kits, basic clinical equipment, and essential medicines.",
    fullDescription: "Rural and low-resource health centers often lack essential supplies. The MediBOX Project provides first aid kits, basic clinical equipment, infection prevention and control materials, essential medicines and medical consumables, menstrual health and personal care items, and maternal and child health supplies. This initiative ensures that both schools and community health centers can provide safe, quality care—especially during emergencies.",
    category: "health",
    impact: {
      beneficiaries: 1500,
      locations: 15,
      yearStarted: 2025
    },
    keyComponents: [
      "First aid kits and basic clinical equipment",
      "Infection prevention and control (IPC) materials",
      "Essential medicines and medical consumables",
      "Menstrual health and personal care items",
      "Maternal and child health supplies"
    ],
    featured: true,
    order: 4
  },
  {
    title: "Community Empowerment Program",
    slug: "community-empowerment",
    subtitle: "Sustainable Change Starts from Within",
    shortDescription: "Our programs are not just about giving—we empower communities to lead and sustain their own development through local leadership and capacity building.",
    fullDescription: "Our programs are not just about giving—we empower communities to lead and sustain their own development. Through this initiative, we engage local leaders, teachers, and caregivers, facilitate community ownership and leadership of projects, build local monitoring and accountability systems, offer capacity-building training for schools and health workers, and encourage youth involvement in solution-making. This ensures that every intervention has a long-lasting impact and builds community resilience from the ground up.",
    category: "empowerment",
    impact: {
      beneficiaries: 1000,
      locations: 12,
      yearStarted: 2025
    },
    keyComponents: [
      "Local leader and caregiver engagement",
      "Community ownership and leadership development",
      "Local monitoring and accountability systems",
      "Capacity-building training for schools and health workers",
      "Youth involvement in solution-making"
    ],
    featured: true,
    order: 5
  }
];

const seedDatabase = async () => {
  try {
    // Delete existing programs
    await Program.deleteMany();
    console.log('🗑️  Deleted existing programs');

    // Insert new programs
    const inserted = await Program.insertMany(programs);
    console.log(`✅ Inserted ${inserted.length} programs`);

    // Log the programs
    inserted.forEach(program => {
      console.log(`   - ${program.title} (${program.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
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
      seedDatabase();
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };