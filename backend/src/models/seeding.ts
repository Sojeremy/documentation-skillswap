import { prisma } from './index.ts';
import * as argon2 from 'argon2';
import {
  dayInAWeek,
  Time,
  Prisma,
} from '../../prisma/generated/prisma/client.ts';

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.refreshToken.deleteMany();
  await prisma.message.deleteMany();
  await prisma.userHasConversation.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.userHasAvailable.deleteMany();
  await prisma.available.deleteMany();
  await prisma.userHasInterest.deleteMany();
  await prisma.userHasSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.category.deleteMany();
  await prisma.role.deleteMany();

  // ============================================
  // 1. ROLES
  // ============================================
  console.log('📝 Creating roles...');
  const memberRole = await prisma.role.create({
    data: {
      name: 'Membre',
    },
  });
  console.log('✅ Roles created');

  // ============================================
  // 2. CATEGORIES
  // ============================================
  console.log('📝 Creating categories...');
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Développement Web', slug: 'dev-web' },
      { name: 'Design', slug: 'design' },
      { name: 'Marketing', slug: 'marketing' },
      { name: 'Langues', slug: 'langues' },
      { name: 'Cuisine', slug: 'cuisine' },
      { name: 'Sport', slug: 'sport' },
      { name: 'Musique', slug: 'musique' },
      { name: 'Bricolage', slug: 'bricolage' },
    ],
  });

  const allCategories = await prisma.category.findMany();
  console.log(`✅ ${categories.count} categories created`);

  // ============================================
  // 3. SKILLS
  // ============================================
  console.log('📝 Creating skills...');
  const skillsData = [
    { name: 'JavaScript', categoryId: allCategories[0].id },
    { name: 'React', categoryId: allCategories[0].id },
    { name: 'Node.js', categoryId: allCategories[0].id },
    { name: 'TypeScript', categoryId: allCategories[0].id },
    { name: 'Python', categoryId: allCategories[0].id },

    { name: 'Figma', categoryId: allCategories[1].id },
    { name: 'Photoshop', categoryId: allCategories[1].id },
    { name: 'Illustrator', categoryId: allCategories[1].id },
    { name: 'UI/UX Design', categoryId: allCategories[1].id },

    { name: 'SEO', categoryId: allCategories[2].id },
    { name: 'Social Media', categoryId: allCategories[2].id },
    { name: 'Content Marketing', categoryId: allCategories[2].id },

    { name: 'Anglais', categoryId: allCategories[3].id },
    { name: 'Espagnol', categoryId: allCategories[3].id },
    { name: 'Allemand', categoryId: allCategories[3].id },
    { name: 'Japonais', categoryId: allCategories[3].id },

    { name: 'Cuisine Française', categoryId: allCategories[4].id },
    { name: 'Pâtisserie', categoryId: allCategories[4].id },
    { name: 'Cuisine Italienne', categoryId: allCategories[4].id },

    { name: 'Yoga', categoryId: allCategories[5].id },
    { name: 'Musculation', categoryId: allCategories[5].id },
    { name: 'Course à pied', categoryId: allCategories[5].id },

    { name: 'Guitare', categoryId: allCategories[6].id },
    { name: 'Piano', categoryId: allCategories[6].id },
    { name: 'Chant', categoryId: allCategories[6].id },

    { name: 'Menuiserie', categoryId: allCategories[7].id },
    { name: 'Électricité', categoryId: allCategories[7].id },
    { name: 'Plomberie', categoryId: allCategories[7].id },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }

  const allSkills = await prisma.skill.findMany();
  console.log(`✅ ${allSkills.length} skills created`);

  // ============================================
  // 4. AVAILABLE (Créneaux standards)
  // ============================================
  console.log('📝 Creating standard availabilities...');
  const availabilitySlots: Prisma.AvailableCreateManyInput[] = [];
  const days: dayInAWeek[] = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];
  const timeSlots: Time[] = ['Morning', 'Afternoon'];

  for (const day of days) {
    for (const timeSlot of timeSlots) {
      availabilitySlots.push({ day, timeSlot });
    }
  }

  await prisma.available.createMany({
    data: availabilitySlots,
  });

  const allAvailabilities = await prisma.available.findMany();
  console.log(`✅ ${allAvailabilities.length} availability slots created`);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - 1 role created`);
  console.log(`   - ${categories.count} categories created`);
  console.log(`   - ${allSkills.length} skills created`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
