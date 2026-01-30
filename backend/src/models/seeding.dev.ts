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
  // 4. USERS
  // ============================================
  console.log('📝 Creating users...');
  const hashedPassword = await argon2.hash('password123');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstname: 'Alice',
        lastname: 'Dupont',
        email: 'alice.dupont@example.com',
        password: hashedPassword,
        address: '12 Rue de la Paix',
        postalCode: 75001,
        city: 'Paris',
        age: 28,
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        description: 'Développeuse web passionnée par React et TypeScript',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Bob',
        lastname: 'Martin',
        email: 'bob.martin@example.com',
        password: hashedPassword,
        address: '45 Avenue des Champs',
        postalCode: 69002,
        city: 'Lyon',
        age: 32,
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        description: 'Designer UI/UX et formateur Figma',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Claire',
        lastname: 'Leroux',
        email: 'claire.leroux@example.com',
        password: hashedPassword,
        address: '78 Boulevard Victor Hugo',
        postalCode: 33000,
        city: 'Bordeaux',
        age: 25,
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        description: 'Professeure de langues (Anglais, Espagnol)',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'David',
        lastname: 'Rousseau',
        email: 'david.rousseau@example.com',
        password: hashedPassword,
        address: '23 Rue du Commerce',
        postalCode: 44000,
        city: 'Nantes',
        age: 35,
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        description: 'Chef cuisinier et passionné de pâtisserie',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Emma',
        lastname: 'Bernard',
        email: 'emma.bernard@example.com',
        password: hashedPassword,
        address: '56 Rue Saint-Jean',
        postalCode: 31000,
        city: 'Toulouse',
        age: 29,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        description: 'Coach sportif spécialisée en yoga et musculation',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'François',
        lastname: 'Petit',
        email: 'francois.petit@example.com',
        password: hashedPassword,
        address: '89 Avenue de la République',
        postalCode: 13001,
        city: 'Marseille',
        age: 40,
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        description: 'Musicien professionnel et professeur de guitare',
        roleId: memberRole.id,
      },
    }),
    // Nouveaux utilisateurs
    prisma.user.create({
      data: {
        firstname: 'Gabrielle',
        lastname: 'Moreau',
        email: 'gabrielle.moreau@example.com',
        password: hashedPassword,
        address: '15 Rue des Lilas',
        postalCode: 59000,
        city: 'Lille',
        age: 27,
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        description: 'Développeuse full-stack spécialisée en Python et Node.js',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Hugo',
        lastname: 'Lefevre',
        email: 'hugo.lefevre@example.com',
        password: hashedPassword,
        address: '28 Avenue Jean Jaurès',
        postalCode: 67000,
        city: 'Strasbourg',
        age: 31,
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        description: 'Expert SEO et marketing digital',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Isabelle',
        lastname: 'Garcia',
        email: 'isabelle.garcia@example.com',
        password: hashedPassword,
        address: '42 Rue de la Liberté',
        postalCode: 21000,
        city: 'Dijon',
        age: 34,
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        description: 'Professeure de piano et théorie musicale',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Julien',
        lastname: 'Blanc',
        email: 'julien.blanc@example.com',
        password: hashedPassword,
        address: '67 Boulevard Gambetta',
        postalCode: 34000,
        city: 'Montpellier',
        age: 26,
        avatarUrl: 'https://i.pravatar.cc/150?img=10',
        description: 'Coach en course à pied et préparation marathon',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Karine',
        lastname: 'Duval',
        email: 'karine.duval@example.com',
        password: hashedPassword,
        address: '3 Place du Marché',
        postalCode: 35000,
        city: 'Rennes',
        age: 38,
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
        description: 'Artisan menuisière et formatrice en bricolage',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Lucas',
        lastname: 'Renard',
        email: 'lucas.renard@example.com',
        password: hashedPassword,
        address: '91 Rue du Port',
        postalCode: 44200,
        city: 'Nantes',
        age: 24,
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        description: 'Étudiant en japonais et passionné de culture asiatique',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Marie',
        lastname: 'Chevalier',
        email: 'marie.chevalier@example.com',
        password: hashedPassword,
        address: '18 Allée des Roses',
        postalCode: 6000,
        city: 'Nice',
        age: 33,
        avatarUrl: 'https://i.pravatar.cc/150?img=13',
        description: 'Graphiste freelance experte Illustrator et Photoshop',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Nicolas',
        lastname: 'Perrin',
        email: 'nicolas.perrin@example.com',
        password: hashedPassword,
        address: '54 Rue Pasteur',
        postalCode: 38000,
        city: 'Grenoble',
        age: 29,
        avatarUrl: 'https://i.pravatar.cc/150?img=14',
        description: 'Chef cuisinier spécialisé en cuisine italienne',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Ophélie',
        lastname: 'Simon',
        email: 'ophelie.simon@example.com',
        password: hashedPassword,
        address: '7 Rue des Écoles',
        postalCode: 29200,
        city: 'Brest',
        age: 30,
        avatarUrl: 'https://i.pravatar.cc/150?img=15',
        description: 'Professeure de chant et coach vocal',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Pierre',
        lastname: 'Lambert',
        email: 'pierre.lambert@example.com',
        password: hashedPassword,
        address: '33 Avenue Foch',
        postalCode: 57000,
        city: 'Metz',
        age: 45,
        avatarUrl: 'https://i.pravatar.cc/150?img=16',
        description: 'Électricien professionnel et formateur',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Quentin',
        lastname: 'Faure',
        email: 'quentin.faure@example.com',
        password: hashedPassword,
        address: '22 Rue Victor Hugo',
        postalCode: 76600,
        city: 'Le Havre',
        age: 28,
        avatarUrl: 'https://i.pravatar.cc/150?img=17',
        description: 'Développeur JavaScript et formateur React',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Rachel',
        lastname: 'Meyer',
        email: 'rachel.meyer@example.com',
        password: hashedPassword,
        address: '11 Rue de Verdun',
        postalCode: 51100,
        city: 'Reims',
        age: 36,
        avatarUrl: 'https://i.pravatar.cc/150?img=18',
        description: "Professeure d'allemand et traductrice",
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Sébastien',
        lastname: 'Roux',
        email: 'sebastien.roux@example.com',
        password: hashedPassword,
        address: '45 Boulevard de la Mer',
        postalCode: 17000,
        city: 'La Rochelle',
        age: 42,
        avatarUrl: 'https://i.pravatar.cc/150?img=19',
        description: 'Plombier expert et bricoleur passionné',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Tiffany',
        lastname: 'Girard',
        email: 'tiffany.girard@example.com',
        password: hashedPassword,
        address: '8 Place Bellecour',
        postalCode: 69002,
        city: 'Lyon',
        age: 25,
        avatarUrl: 'https://i.pravatar.cc/150?img=20',
        description: 'Community manager et experte social media',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Ugo',
        lastname: 'Marchand',
        email: 'ugo.marchand@example.com',
        password: hashedPassword,
        address: '19 Rue de la Gare',
        postalCode: 80000,
        city: 'Amiens',
        age: 23,
        avatarUrl: 'https://i.pravatar.cc/150?img=21',
        description: 'Étudiant en design UI/UX et passionné de Figma',
        roleId: memberRole.id,
      },
    }),
    // ---- 20 profils supplémentaires (sans messages/conversations) ----
    prisma.user.create({
      data: {
        firstname: 'Valérie',
        lastname: 'Fontaine',
        email: 'valerie.fontaine@example.com',
        password: hashedPassword,
        address: '5 Rue des Acacias',
        postalCode: 49000,
        city: 'Angers',
        age: 31,
        avatarUrl: 'https://i.pravatar.cc/150?img=22',
        description: 'Développeuse Python et passionnée de data science',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'William',
        lastname: 'Garnier',
        email: 'william.garnier@example.com',
        password: hashedPassword,
        address: '14 Place de la Mairie',
        postalCode: 63000,
        city: 'Clermont-Ferrand',
        age: 27,
        avatarUrl: 'https://i.pravatar.cc/150?img=23',
        description: 'Guitariste et compositeur amateur',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Xénia',
        lastname: 'Morel',
        email: 'xenia.morel@example.com',
        password: hashedPassword,
        address: '30 Rue du Château',
        postalCode: 37000,
        city: 'Tours',
        age: 29,
        avatarUrl: 'https://i.pravatar.cc/150?img=24',
        description: 'Coach de yoga et méditation, certifiée depuis 5 ans',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Yann',
        lastname: 'Lefebvre',
        email: 'yann.lefebvre@example.com',
        password: hashedPassword,
        address: '62 Avenue de Bretagne',
        postalCode: 22000,
        city: 'Saint-Brieuc',
        age: 34,
        avatarUrl: 'https://i.pravatar.cc/150?img=25',
        description: 'Expert en SEO et content marketing freelance',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Zoé',
        lastname: 'Bourgeois',
        email: 'zoe.bourgeois@example.com',
        password: hashedPassword,
        address: '9 Rue de la Fontaine',
        postalCode: 10000,
        city: 'Troyes',
        age: 22,
        avatarUrl: 'https://i.pravatar.cc/150?img=26',
        description: 'Étudiante en pâtisserie et cuisine du monde',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Antoine',
        lastname: 'Vasseur',
        email: 'antoine.vasseur@example.com',
        password: hashedPassword,
        address: '41 Boulevard Pasteur',
        postalCode: 14000,
        city: 'Caen',
        age: 38,
        avatarUrl: 'https://i.pravatar.cc/150?img=27',
        description:
          'Menuisier ébéniste et passionné de restauration de meubles',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Béatrice',
        lastname: 'Colin',
        email: 'beatrice.colin@example.com',
        password: hashedPassword,
        address: '17 Rue Jean Moulin',
        postalCode: 30000,
        city: 'Nîmes',
        age: 41,
        avatarUrl: 'https://i.pravatar.cc/150?img=28',
        description: 'Professeure de piano classique et jazz',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Cyril',
        lastname: 'Lemoine',
        email: 'cyril.lemoine@example.com',
        password: hashedPassword,
        address: '53 Avenue du Général de Gaulle',
        postalCode: 87000,
        city: 'Limoges',
        age: 26,
        avatarUrl: 'https://i.pravatar.cc/150?img=29',
        description: 'Développeur React/Node.js et formateur JavaScript',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Diane',
        lastname: 'Marchal',
        email: 'diane.marchal@example.com',
        password: hashedPassword,
        address: '26 Rue des Vignes',
        postalCode: 51000,
        city: 'Châlons-en-Champagne',
        age: 33,
        avatarUrl: 'https://i.pravatar.cc/150?img=30',
        description: 'Illustratrice freelance spécialisée en dessin numérique',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Éric',
        lastname: 'Barbier',
        email: 'eric.barbier@example.com',
        password: hashedPassword,
        address: '38 Rue du Moulin',
        postalCode: 25000,
        city: 'Besançon',
        age: 44,
        avatarUrl: 'https://i.pravatar.cc/150?img=31',
        description: 'Plombier chauffagiste et bricoleur touche-à-tout',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Fanny',
        lastname: 'Guillot',
        email: 'fanny.guillot@example.com',
        password: hashedPassword,
        address: '71 Rue de la République',
        postalCode: 42000,
        city: 'Saint-Étienne',
        age: 28,
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
        description: 'Professeure de japonais et traductrice manga',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Grégoire',
        lastname: 'Pons',
        email: 'gregoire.pons@example.com',
        password: hashedPassword,
        address: '12 Place du Forum',
        postalCode: 13200,
        city: 'Arles',
        age: 30,
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        description: 'Coach musculation et nutrition sportive',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Hélène',
        lastname: 'Navarro',
        email: 'helene.navarro@example.com',
        password: hashedPassword,
        address: '4 Allée des Platanes',
        postalCode: 66000,
        city: 'Perpignan',
        age: 35,
        avatarUrl: 'https://i.pravatar.cc/150?img=34',
        description: 'Professeure bilingue espagnol-français et traductrice',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Ivan',
        lastname: 'Dupuis',
        email: 'ivan.dupuis@example.com',
        password: hashedPassword,
        address: '88 Rue de la Gare',
        postalCode: 54000,
        city: 'Nancy',
        age: 39,
        avatarUrl: 'https://i.pravatar.cc/150?img=35',
        description:
          'Chef cuisinier spécialisé en cuisine française traditionnelle',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Julie',
        lastname: 'Berger',
        email: 'julie.berger@example.com',
        password: hashedPassword,
        address: '21 Rue Nationale',
        postalCode: 62100,
        city: 'Calais',
        age: 24,
        avatarUrl: 'https://i.pravatar.cc/150?img=36',
        description: 'Community manager et experte en stratégie digitale',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Kevin',
        lastname: 'Rolland',
        email: 'kevin.rolland@example.com',
        password: hashedPassword,
        address: '56 Avenue de Savoie',
        postalCode: 73000,
        city: 'Chambéry',
        age: 32,
        avatarUrl: 'https://i.pravatar.cc/150?img=37',
        description: 'Coach de course à pied et trail, préparateur physique',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Léa',
        lastname: 'Picard',
        email: 'lea.picard@example.com',
        password: hashedPassword,
        address: '33 Rue des Carmes',
        postalCode: 45000,
        city: 'Orléans',
        age: 27,
        avatarUrl: 'https://i.pravatar.cc/150?img=38',
        description: 'Designer UI/UX et illustratrice sur Figma et Photoshop',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Mathieu',
        lastname: 'Giraud',
        email: 'mathieu.giraud@example.com',
        password: hashedPassword,
        address: '47 Boulevard Voltaire',
        postalCode: 90000,
        city: 'Belfort',
        age: 36,
        avatarUrl: 'https://i.pravatar.cc/150?img=39',
        description: 'Électricien industriel et formateur en domotique',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Nadia',
        lastname: 'Lemaire',
        email: 'nadia.lemaire@example.com',
        password: hashedPassword,
        address: '15 Rue de la Paix',
        postalCode: 64000,
        city: 'Pau',
        age: 30,
        avatarUrl: 'https://i.pravatar.cc/150?img=40',
        description: 'Chanteuse lyrique et professeure de technique vocale',
        roleId: memberRole.id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Olivier',
        lastname: 'Caron',
        email: 'olivier.caron@example.com',
        password: hashedPassword,
        address: '29 Rue du Faubourg',
        postalCode: 2000,
        city: 'Laon',
        age: 43,
        avatarUrl: 'https://i.pravatar.cc/150?img=41',
        description: 'Professeur de TypeScript et architecte logiciel',
        roleId: memberRole.id,
      },
    }),
  ]);
  console.log(`✅ ${users.length} users created`);

  // ============================================
  // 5. USER HAS SKILL (Compétences possédées)
  // ============================================
  console.log('📝 Linking users with their skills...');
  await prisma.userHasSkill.createMany({
    data: [
      // Alice - Dev Web
      { userId: users[0].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[0].id, skillId: allSkills[1].id }, // React
      { userId: users[0].id, skillId: allSkills[3].id }, // TypeScript

      // Bob - Design
      { userId: users[1].id, skillId: allSkills[5].id }, // Figma
      { userId: users[1].id, skillId: allSkills[6].id }, // Photoshop
      { userId: users[1].id, skillId: allSkills[8].id }, // UI/UX Design

      // Claire - Langues
      { userId: users[2].id, skillId: allSkills[12].id }, // Anglais
      { userId: users[2].id, skillId: allSkills[13].id }, // Espagnol

      // David - Cuisine
      { userId: users[3].id, skillId: allSkills[16].id }, // Cuisine Française
      { userId: users[3].id, skillId: allSkills[17].id }, // Pâtisserie
      { userId: users[3].id, skillId: allSkills[18].id }, // Cuisine Italienne

      // Emma - Sport
      { userId: users[4].id, skillId: allSkills[19].id }, // Yoga
      { userId: users[4].id, skillId: allSkills[20].id }, // Musculation
      { userId: users[4].id, skillId: allSkills[21].id }, // Course à pied

      // François - Musique
      { userId: users[5].id, skillId: allSkills[22].id }, // Guitare
      { userId: users[5].id, skillId: allSkills[23].id }, // Piano

      // Gabrielle - Dev Web
      { userId: users[6].id, skillId: allSkills[4].id }, // Python
      { userId: users[6].id, skillId: allSkills[2].id }, // Node.js
      { userId: users[6].id, skillId: allSkills[3].id }, // TypeScript

      // Hugo - Marketing
      { userId: users[7].id, skillId: allSkills[9].id }, // SEO
      { userId: users[7].id, skillId: allSkills[10].id }, // Social Media
      { userId: users[7].id, skillId: allSkills[11].id }, // Content Marketing

      // Isabelle - Musique
      { userId: users[8].id, skillId: allSkills[23].id }, // Piano
      { userId: users[8].id, skillId: allSkills[24].id }, // Chant

      // Julien - Sport
      { userId: users[9].id, skillId: allSkills[21].id }, // Course à pied
      { userId: users[9].id, skillId: allSkills[20].id }, // Musculation

      // Karine - Bricolage
      { userId: users[10].id, skillId: allSkills[25].id }, // Menuiserie
      { userId: users[10].id, skillId: allSkills[26].id }, // Électricité

      // Lucas - Langues
      { userId: users[11].id, skillId: allSkills[15].id }, // Japonais
      { userId: users[11].id, skillId: allSkills[12].id }, // Anglais

      // Marie - Design
      { userId: users[12].id, skillId: allSkills[7].id }, // Illustrator
      { userId: users[12].id, skillId: allSkills[6].id }, // Photoshop
      { userId: users[12].id, skillId: allSkills[8].id }, // UI/UX Design

      // Nicolas - Cuisine
      { userId: users[13].id, skillId: allSkills[18].id }, // Cuisine Italienne
      { userId: users[13].id, skillId: allSkills[16].id }, // Cuisine Française

      // Ophélie - Musique
      { userId: users[14].id, skillId: allSkills[24].id }, // Chant
      { userId: users[14].id, skillId: allSkills[23].id }, // Piano

      // Pierre - Bricolage
      { userId: users[15].id, skillId: allSkills[26].id }, // Électricité
      { userId: users[15].id, skillId: allSkills[27].id }, // Plomberie

      // Quentin - Dev Web
      { userId: users[16].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[16].id, skillId: allSkills[1].id }, // React
      { userId: users[16].id, skillId: allSkills[2].id }, // Node.js

      // Rachel - Langues
      { userId: users[17].id, skillId: allSkills[14].id }, // Allemand
      { userId: users[17].id, skillId: allSkills[12].id }, // Anglais

      // Sébastien - Bricolage
      { userId: users[18].id, skillId: allSkills[27].id }, // Plomberie
      { userId: users[18].id, skillId: allSkills[25].id }, // Menuiserie

      // Tiffany - Marketing
      { userId: users[19].id, skillId: allSkills[10].id }, // Social Media
      { userId: users[19].id, skillId: allSkills[11].id }, // Content Marketing

      // Ugo - Design
      { userId: users[20].id, skillId: allSkills[5].id }, // Figma
      { userId: users[20].id, skillId: allSkills[8].id }, // UI/UX Design

      // Valérie - Dev Web
      { userId: users[21].id, skillId: allSkills[4].id }, // Python
      { userId: users[21].id, skillId: allSkills[3].id }, // TypeScript

      // William - Musique
      { userId: users[22].id, skillId: allSkills[22].id }, // Guitare
      { userId: users[22].id, skillId: allSkills[24].id }, // Chant

      // Xénia - Sport
      { userId: users[23].id, skillId: allSkills[19].id }, // Yoga
      { userId: users[23].id, skillId: allSkills[20].id }, // Musculation

      // Yann - Marketing
      { userId: users[24].id, skillId: allSkills[9].id }, // SEO
      { userId: users[24].id, skillId: allSkills[11].id }, // Content Marketing

      // Zoé - Cuisine
      { userId: users[25].id, skillId: allSkills[17].id }, // Pâtisserie
      { userId: users[25].id, skillId: allSkills[18].id }, // Cuisine Italienne

      // Antoine - Bricolage
      { userId: users[26].id, skillId: allSkills[25].id }, // Menuiserie
      { userId: users[26].id, skillId: allSkills[27].id }, // Plomberie

      // Béatrice - Musique
      { userId: users[27].id, skillId: allSkills[23].id }, // Piano
      { userId: users[27].id, skillId: allSkills[24].id }, // Chant

      // Cyril - Dev Web
      { userId: users[28].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[28].id, skillId: allSkills[1].id }, // React
      { userId: users[28].id, skillId: allSkills[2].id }, // Node.js

      // Diane - Design
      { userId: users[29].id, skillId: allSkills[7].id }, // Illustrator
      { userId: users[29].id, skillId: allSkills[6].id }, // Photoshop

      // Éric - Bricolage
      { userId: users[30].id, skillId: allSkills[27].id }, // Plomberie
      { userId: users[30].id, skillId: allSkills[26].id }, // Électricité

      // Fanny - Langues
      { userId: users[31].id, skillId: allSkills[15].id }, // Japonais
      { userId: users[31].id, skillId: allSkills[12].id }, // Anglais

      // Grégoire - Sport
      { userId: users[32].id, skillId: allSkills[20].id }, // Musculation
      { userId: users[32].id, skillId: allSkills[21].id }, // Course à pied

      // Hélène - Langues
      { userId: users[33].id, skillId: allSkills[13].id }, // Espagnol
      { userId: users[33].id, skillId: allSkills[12].id }, // Anglais

      // Ivan - Cuisine
      { userId: users[34].id, skillId: allSkills[16].id }, // Cuisine Française
      { userId: users[34].id, skillId: allSkills[17].id }, // Pâtisserie

      // Julie - Marketing
      { userId: users[35].id, skillId: allSkills[10].id }, // Social Media
      { userId: users[35].id, skillId: allSkills[11].id }, // Content Marketing

      // Kevin - Sport
      { userId: users[36].id, skillId: allSkills[21].id }, // Course à pied
      { userId: users[36].id, skillId: allSkills[20].id }, // Musculation

      // Léa - Design
      { userId: users[37].id, skillId: allSkills[5].id }, // Figma
      { userId: users[37].id, skillId: allSkills[6].id }, // Photoshop
      { userId: users[37].id, skillId: allSkills[8].id }, // UI/UX Design

      // Mathieu - Bricolage
      { userId: users[38].id, skillId: allSkills[26].id }, // Électricité
      { userId: users[38].id, skillId: allSkills[25].id }, // Menuiserie

      // Nadia - Musique
      { userId: users[39].id, skillId: allSkills[24].id }, // Chant
      { userId: users[39].id, skillId: allSkills[23].id }, // Piano

      // Olivier - Dev Web
      { userId: users[40].id, skillId: allSkills[3].id }, // TypeScript
      { userId: users[40].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[40].id, skillId: allSkills[1].id }, // React
    ],
  });
  console.log('✅ User skills linked');

  // ============================================
  // 6. USER HAS INTEREST (Compétences recherchées)
  // ============================================
  console.log('📝 Linking users with their interests...');
  await prisma.userHasInterest.createMany({
    data: [
      // Alice veut apprendre
      { userId: users[0].id, skillId: allSkills[5].id }, // Figma
      { userId: users[0].id, skillId: allSkills[12].id }, // Anglais

      // Bob veut apprendre
      { userId: users[1].id, skillId: allSkills[1].id }, // React
      { userId: users[1].id, skillId: allSkills[22].id }, // Guitare

      // Claire veut apprendre
      { userId: users[2].id, skillId: allSkills[17].id }, // Pâtisserie
      { userId: users[2].id, skillId: allSkills[19].id }, // Yoga

      // David veut apprendre
      { userId: users[3].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[3].id, skillId: allSkills[14].id }, // Allemand

      // Emma veut apprendre
      { userId: users[4].id, skillId: allSkills[23].id }, // Piano
      { userId: users[4].id, skillId: allSkills[16].id }, // Cuisine Française

      // François veut apprendre
      { userId: users[5].id, skillId: allSkills[25].id }, // Menuiserie
      { userId: users[5].id, skillId: allSkills[10].id }, // Social Media

      // Gabrielle veut apprendre
      { userId: users[6].id, skillId: allSkills[5].id }, // Figma
      { userId: users[6].id, skillId: allSkills[19].id }, // Yoga

      // Hugo veut apprendre
      { userId: users[7].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[7].id, skillId: allSkills[22].id }, // Guitare

      // Isabelle veut apprendre
      { userId: users[8].id, skillId: allSkills[12].id }, // Anglais
      { userId: users[8].id, skillId: allSkills[17].id }, // Pâtisserie

      // Julien veut apprendre
      { userId: users[9].id, skillId: allSkills[16].id }, // Cuisine Française
      { userId: users[9].id, skillId: allSkills[15].id }, // Japonais

      // Karine veut apprendre
      { userId: users[10].id, skillId: allSkills[1].id }, // React
      { userId: users[10].id, skillId: allSkills[23].id }, // Piano

      // Lucas veut apprendre
      { userId: users[11].id, skillId: allSkills[24].id }, // Chant
      { userId: users[11].id, skillId: allSkills[8].id }, // UI/UX Design

      // Marie veut apprendre
      { userId: users[12].id, skillId: allSkills[9].id }, // SEO
      { userId: users[12].id, skillId: allSkills[19].id }, // Yoga

      // Nicolas veut apprendre
      { userId: users[13].id, skillId: allSkills[10].id }, // Social Media
      { userId: users[13].id, skillId: allSkills[12].id }, // Anglais

      // Ophélie veut apprendre
      { userId: users[14].id, skillId: allSkills[5].id }, // Figma
      { userId: users[14].id, skillId: allSkills[20].id }, // Musculation

      // Pierre veut apprendre
      { userId: users[15].id, skillId: allSkills[4].id }, // Python
      { userId: users[15].id, skillId: allSkills[18].id }, // Cuisine Italienne

      // Quentin veut apprendre
      { userId: users[16].id, skillId: allSkills[8].id }, // UI/UX Design
      { userId: users[16].id, skillId: allSkills[22].id }, // Guitare

      // Rachel veut apprendre
      { userId: users[17].id, skillId: allSkills[17].id }, // Pâtisserie
      { userId: users[17].id, skillId: allSkills[21].id }, // Course à pied

      // Sébastien veut apprendre
      { userId: users[18].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[18].id, skillId: allSkills[13].id }, // Espagnol

      // Tiffany veut apprendre
      { userId: users[19].id, skillId: allSkills[6].id }, // Photoshop
      { userId: users[19].id, skillId: allSkills[24].id }, // Chant

      // Ugo veut apprendre
      { userId: users[20].id, skillId: allSkills[1].id }, // React
      { userId: users[20].id, skillId: allSkills[14].id }, // Allemand

      // Valérie veut apprendre
      { userId: users[21].id, skillId: allSkills[5].id }, // Figma
      { userId: users[21].id, skillId: allSkills[19].id }, // Yoga

      // William veut apprendre
      { userId: users[22].id, skillId: allSkills[0].id }, // JavaScript
      { userId: users[22].id, skillId: allSkills[16].id }, // Cuisine Française

      // Xénia veut apprendre
      { userId: users[23].id, skillId: allSkills[23].id }, // Piano
      { userId: users[23].id, skillId: allSkills[17].id }, // Pâtisserie

      // Yann veut apprendre
      { userId: users[24].id, skillId: allSkills[1].id }, // React
      { userId: users[24].id, skillId: allSkills[22].id }, // Guitare

      // Zoé veut apprendre
      { userId: users[25].id, skillId: allSkills[15].id }, // Japonais
      { userId: users[25].id, skillId: allSkills[19].id }, // Yoga

      // Antoine veut apprendre
      { userId: users[26].id, skillId: allSkills[23].id }, // Piano
      { userId: users[26].id, skillId: allSkills[4].id }, // Python

      // Béatrice veut apprendre
      { userId: users[27].id, skillId: allSkills[16].id }, // Cuisine Française
      { userId: users[27].id, skillId: allSkills[19].id }, // Yoga

      // Cyril veut apprendre
      { userId: users[28].id, skillId: allSkills[8].id }, // UI/UX Design
      { userId: users[28].id, skillId: allSkills[22].id }, // Guitare

      // Diane veut apprendre
      { userId: users[29].id, skillId: allSkills[1].id }, // React
      { userId: users[29].id, skillId: allSkills[24].id }, // Chant

      // Éric veut apprendre
      { userId: users[30].id, skillId: allSkills[18].id }, // Cuisine Italienne
      { userId: users[30].id, skillId: allSkills[22].id }, // Guitare

      // Fanny veut apprendre
      { userId: users[31].id, skillId: allSkills[6].id }, // Photoshop
      { userId: users[31].id, skillId: allSkills[19].id }, // Yoga

      // Grégoire veut apprendre
      { userId: users[32].id, skillId: allSkills[16].id }, // Cuisine Française
      { userId: users[32].id, skillId: allSkills[22].id }, // Guitare

      // Hélène veut apprendre
      { userId: users[33].id, skillId: allSkills[23].id }, // Piano
      { userId: users[33].id, skillId: allSkills[9].id }, // SEO

      // Ivan veut apprendre
      { userId: users[34].id, skillId: allSkills[12].id }, // Anglais
      { userId: users[34].id, skillId: allSkills[20].id }, // Musculation

      // Julie veut apprendre
      { userId: users[35].id, skillId: allSkills[5].id }, // Figma
      { userId: users[35].id, skillId: allSkills[13].id }, // Espagnol

      // Kevin veut apprendre
      { userId: users[36].id, skillId: allSkills[15].id }, // Japonais
      { userId: users[36].id, skillId: allSkills[25].id }, // Menuiserie

      // Léa veut apprendre
      { userId: users[37].id, skillId: allSkills[3].id }, // TypeScript
      { userId: users[37].id, skillId: allSkills[24].id }, // Chant

      // Mathieu veut apprendre
      { userId: users[38].id, skillId: allSkills[4].id }, // Python
      { userId: users[38].id, skillId: allSkills[21].id }, // Course à pied

      // Nadia veut apprendre
      { userId: users[39].id, skillId: allSkills[13].id }, // Espagnol
      { userId: users[39].id, skillId: allSkills[20].id }, // Musculation

      // Olivier veut apprendre
      { userId: users[40].id, skillId: allSkills[25].id }, // Menuiserie
      { userId: users[40].id, skillId: allSkills[18].id }, // Cuisine Italienne
    ],
  });
  console.log('✅ User interests linked');

  // ============================================
  // 7. AVAILABLE (Créneaux standards)
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

  // ============================================
  // 8. USER HAS AVAILABLE (Disponibilités des utilisateurs)
  // ============================================
  console.log('📝 Linking users with their availabilities...');
  await prisma.userHasAvailable.createMany({
    data: [
      { userId: users[0].id, availableId: allAvailabilities[0].id },
      { userId: users[0].id, availableId: allAvailabilities[5].id },
      { userId: users[0].id, availableId: allAvailabilities[8].id },
      { userId: users[0].id, availableId: allAvailabilities[9].id },

      { userId: users[1].id, availableId: allAvailabilities[2].id },
      { userId: users[1].id, availableId: allAvailabilities[3].id },
      { userId: users[1].id, availableId: allAvailabilities[6].id },
      { userId: users[1].id, availableId: allAvailabilities[7].id },

      { userId: users[2].id, availableId: allAvailabilities[1].id },
      { userId: users[2].id, availableId: allAvailabilities[5].id },
      { userId: users[2].id, availableId: allAvailabilities[9].id },

      { userId: users[3].id, availableId: allAvailabilities[10].id },
      { userId: users[3].id, availableId: allAvailabilities[11].id },
      { userId: users[3].id, availableId: allAvailabilities[12].id },

      { userId: users[4].id, availableId: allAvailabilities[0].id },
      { userId: users[4].id, availableId: allAvailabilities[4].id },
      { userId: users[4].id, availableId: allAvailabilities[8].id },

      { userId: users[5].id, availableId: allAvailabilities[3].id },
      { userId: users[5].id, availableId: allAvailabilities[7].id },
    ],
  });
  console.log('✅ User availabilities linked');

  // ============================================
  // 9. FOLLOW (Abonnements)
  // ============================================
  console.log('📝 Creating follow relationships...');
  await prisma.follow.createMany({
    data: [
      // Alice suit Bob et Claire
      { followerId: users[0].id, followedId: users[1].id },
      { followerId: users[0].id, followedId: users[2].id },
      // Bob suit Alice et David
      { followerId: users[1].id, followedId: users[0].id },
      { followerId: users[1].id, followedId: users[3].id },
      // Claire suit Alice et Emma
      { followerId: users[2].id, followedId: users[0].id },
      { followerId: users[2].id, followedId: users[4].id },
      // David suit Claire et François
      { followerId: users[3].id, followedId: users[2].id },
      { followerId: users[3].id, followedId: users[5].id },
      // Emma suit Bob et David
      { followerId: users[4].id, followedId: users[1].id },
      { followerId: users[4].id, followedId: users[3].id },
      // François suit Alice et Emma
      { followerId: users[5].id, followedId: users[0].id },
      { followerId: users[5].id, followedId: users[4].id },
    ],
  });
  console.log('✅ Follow relationships created');

  // ============================================
  // 10. RATINGS (Évaluations)
  // ============================================
  console.log('📝 Creating ratings...');
  await prisma.rating.createMany({
    data: [
      {
        evaluatorId: users[1].id,
        evaluatedId: users[0].id,
        comments:
          'Excellente formatrice en React ! Très pédagogue et patiente.',
        score: 5,
      },
      {
        evaluatorId: users[2].id,
        evaluatedId: users[0].id,
        comments: 'Super échange, Alice explique très bien les concepts.',
        score: 5,
      },
      {
        evaluatorId: users[0].id,
        evaluatedId: users[1].id,
        comments: "Bob m'a beaucoup aidé sur Figma, je recommande !",
        score: 5,
      },
      {
        evaluatorId: users[3].id,
        evaluatedId: users[1].id,
        comments:
          'Bon designer mais parfois un peu rapide dans les explications.',
        score: 4,
      },
      {
        evaluatorId: users[0].id,
        evaluatedId: users[2].id,
        comments: "Claire m'a fait progresser en anglais, merci !",
        score: 5,
      },
      {
        evaluatorId: users[4].id,
        evaluatedId: users[3].id,
        comments: 'Les cours de pâtisserie étaient top, très pro !',
        score: 5,
      },
      {
        evaluatorId: users[2].id,
        evaluatedId: users[4].id,
        comments: 'Séances de yoga vraiment relaxantes, Emma est super !',
        score: 5,
      },
      {
        evaluatorId: users[1].id,
        evaluatedId: users[5].id,
        comments: 'Cours de guitare au top, François est très patient.',
        score: 5,
      },
    ],
  });
  console.log('✅ Ratings created');

  // ============================================
  // 11. CONVERSATIONS
  // ============================================
  console.log('📝 Creating conversations...');
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        title: 'Échange React contre Figma',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: "Cours d'anglais",
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Cours de pâtisserie',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Séances de yoga',
        status: 'Close',
      },
    }),
    // Nouvelles conversations
    prisma.conversation.create({
      data: {
        title: 'Échange Python contre SEO',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Cours de guitare',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Apprentissage du japonais',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Formation Illustrator',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Cours de cuisine italienne',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Initiation à la menuiserie',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Échange piano contre musculation',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Cours de chant',
        status: 'Close',
      },
    }),
    prisma.conversation.create({
      data: {
        title: "Aide en allemand pour l'emploi",
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Échange TypeScript contre UI/UX',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Coaching course à pied',
        status: 'Open',
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Aide en plomberie',
        status: 'Close',
      },
    }),
  ]);
  console.log(`✅ ${conversations.length} conversations created`);

  // ============================================
  // 12. USER HAS CONVERSATION
  // ============================================
  console.log('📝 Linking users to conversations...');
  await prisma.userHasConversation.createMany({
    data: [
      // Conversation 0: Alice <-> Bob (Échange React contre Figma)
      { userId: users[0].id, conversationId: conversations[0].id },
      { userId: users[1].id, conversationId: conversations[0].id },

      // Conversation 1: Alice <-> Claire (Cours d'anglais)
      { userId: users[0].id, conversationId: conversations[1].id },
      { userId: users[2].id, conversationId: conversations[1].id },

      // Conversation 2: Claire <-> David (Cours de pâtisserie)
      { userId: users[2].id, conversationId: conversations[2].id },
      { userId: users[3].id, conversationId: conversations[2].id },

      // Conversation 3: Claire <-> Emma (Séances de yoga)
      { userId: users[2].id, conversationId: conversations[3].id },
      { userId: users[4].id, conversationId: conversations[3].id },

      // Conversation 4: Gabrielle <-> Hugo (Échange Python contre SEO)
      { userId: users[6].id, conversationId: conversations[4].id },
      { userId: users[7].id, conversationId: conversations[4].id },

      // Conversation 5: Hugo <-> François (Cours de guitare)
      { userId: users[7].id, conversationId: conversations[5].id },
      { userId: users[5].id, conversationId: conversations[5].id },

      // Conversation 6: Julien <-> Lucas (Apprentissage du japonais)
      { userId: users[9].id, conversationId: conversations[6].id },
      { userId: users[11].id, conversationId: conversations[6].id },

      // Conversation 7: Tiffany <-> Marie (Formation Illustrator)
      { userId: users[19].id, conversationId: conversations[7].id },
      { userId: users[12].id, conversationId: conversations[7].id },

      // Conversation 8: Pierre <-> Nicolas (Cours de cuisine italienne)
      { userId: users[15].id, conversationId: conversations[8].id },
      { userId: users[13].id, conversationId: conversations[8].id },

      // Conversation 9: François <-> Karine (Initiation à la menuiserie)
      { userId: users[5].id, conversationId: conversations[9].id },
      { userId: users[10].id, conversationId: conversations[9].id },

      // Conversation 10: Emma <-> Isabelle (Échange piano contre musculation)
      { userId: users[4].id, conversationId: conversations[10].id },
      { userId: users[8].id, conversationId: conversations[10].id },

      // Conversation 11: Lucas <-> Ophélie (Cours de chant)
      { userId: users[11].id, conversationId: conversations[11].id },
      { userId: users[14].id, conversationId: conversations[11].id },

      // Conversation 12: Ugo <-> Rachel (Aide en allemand pour l'emploi)
      { userId: users[20].id, conversationId: conversations[12].id },
      { userId: users[17].id, conversationId: conversations[12].id },

      // Conversation 13: Alice <-> Gabrielle (Échange TypeScript contre UI/UX)
      { userId: users[0].id, conversationId: conversations[13].id },
      { userId: users[6].id, conversationId: conversations[13].id },

      // Conversation 14: Rachel <-> Julien (Coaching course à pied)
      { userId: users[17].id, conversationId: conversations[14].id },
      { userId: users[9].id, conversationId: conversations[14].id },

      // Conversation 15: Sébastien <-> Karine (Aide en plomberie)
      { userId: users[18].id, conversationId: conversations[15].id },
      { userId: users[10].id, conversationId: conversations[15].id },
    ],
  });
  console.log('✅ Users linked to conversations');

  // ============================================
  // 13. MESSAGES
  // ============================================
  console.log('📝 Creating messages...');
  await prisma.message.createMany({
    data: [
      // Conversation 0: Alice <-> Bob (Échange React contre Figma)
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        content:
          'Salut Bob ! Je serais intéressée pour apprendre Figma avec toi.',
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        conversationId: conversations[0].id,
        content:
          "Hello Alice ! Avec plaisir, et moi j'aimerais bien progresser en React !",
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        content: 'Parfait ! On peut se voir mardi prochain ?',
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        conversationId: conversations[0].id,
        content:
          'Mardi me convient parfaitement ! 14h ça te va ? On peut se retrouver dans un café avec du wifi.',
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        content:
          "14h c'est parfait ! Tu connais le café coworking près de République ? Ils ont une bonne connexion.",
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        conversationId: conversations[0].id,
        content:
          "Oui je vois ! J'y serai. J'apporterai mon ordi avec Figma installé. Tu peux préparer un petit projet React pour me montrer les bases ?",
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        content:
          "Pas de souci, je vais préparer un mini projet avec les hooks et le state management. C'est ce que tu veux apprendre en priorité ?",
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        conversationId: conversations[0].id,
        content:
          "Exactement ! Les hooks me semblent essentiels. De mon côté, je te montrerai les bases de l'auto-layout et des composants réutilisables dans Figma.",
      },

      // Conversation 1: Alice <-> Claire (Cours d'anglais)
      {
        senderId: users[0].id,
        receiverId: users[2].id,
        conversationId: conversations[1].id,
        content:
          "Bonjour Claire, je cherche quelqu'un pour pratiquer l'anglais.",
      },
      {
        senderId: users[2].id,
        receiverId: users[0].id,
        conversationId: conversations[1].id,
        content:
          'Salut Alice ! Je donne des cours, on peut organiser ça facilement.',
      },
      {
        senderId: users[0].id,
        receiverId: users[2].id,
        conversationId: conversations[1].id,
        content:
          "Super ! Quel est ton niveau d'enseignement ? Je suis B1/B2 et j'aimerais atteindre le niveau C1.",
      },
      {
        senderId: users[2].id,
        receiverId: users[0].id,
        conversationId: conversations[1].id,
        content:
          "Je peux tout à fait t'aider à progresser vers le C1 ! On peut travailler sur la conversation, la grammaire avancée et le vocabulaire professionnel.",
      },
      {
        senderId: users[0].id,
        receiverId: users[2].id,
        conversationId: conversations[1].id,
        content:
          "Parfait ! Le vocabulaire tech en anglais m'intéresse particulièrement pour mon travail de développeuse.",
      },
      {
        senderId: users[2].id,
        receiverId: users[0].id,
        conversationId: conversations[1].id,
        content:
          "Excellent choix ! Je peux adapter mes cours au vocabulaire IT. On commence quand tu veux, j'ai des disponibilités le mercredi soir.",
      },

      // Conversation 2: Claire <-> David (Cours de pâtisserie)
      {
        senderId: users[2].id,
        receiverId: users[3].id,
        conversationId: conversations[2].id,
        content:
          "Bonjour David ! J'ai vu que tu enseignes la pâtisserie, je suis intéressée !",
      },
      {
        senderId: users[3].id,
        receiverId: users[2].id,
        conversationId: conversations[2].id,
        content:
          'Bonjour Claire ! Oui, je propose des ateliers le samedi matin.',
      },
      {
        senderId: users[2].id,
        receiverId: users[3].id,
        conversationId: conversations[2].id,
        content: 'Super ! Je peux venir ce samedi ?',
      },
      {
        senderId: users[3].id,
        receiverId: users[2].id,
        conversationId: conversations[2].id,
        content:
          "Ce samedi c'est parfait ! On va faire des macarons, c'est un bon point de départ pour apprendre les bases.",
      },
      {
        senderId: users[2].id,
        receiverId: users[3].id,
        conversationId: conversations[2].id,
        content:
          "Oh génial, j'adore les macarons ! Je dois apporter quelque chose ?",
      },
      {
        senderId: users[3].id,
        receiverId: users[2].id,
        conversationId: conversations[2].id,
        content:
          "Juste un tablier si tu en as un ! J'ai tout le matériel et les ingrédients. On se retrouve à 10h chez moi ?",
      },
      {
        senderId: users[2].id,
        receiverId: users[3].id,
        conversationId: conversations[2].id,
        content:
          "Parfait, j'ai noté ! Tu peux m'envoyer ton adresse exacte ? J'ai hâte d'y être !",
      },
      {
        senderId: users[3].id,
        receiverId: users[2].id,
        conversationId: conversations[2].id,
        content:
          "Je t'envoie ça par SMS. À samedi Claire, on va bien s'amuser !",
      },

      // Conversation 3: Claire <-> Emma (Séances de yoga - CLOSED)
      {
        senderId: users[2].id,
        receiverId: users[4].id,
        conversationId: conversations[3].id,
        content:
          "Salut Emma ! J'ai vu ton profil, tu donnes des cours de yoga ?",
      },
      {
        senderId: users[4].id,
        receiverId: users[2].id,
        conversationId: conversations[3].id,
        content:
          'Oui tout à fait ! Je propose du yoga vinyasa et du hatha yoga. Tu recherches quel type de pratique ?',
      },
      {
        senderId: users[2].id,
        receiverId: users[4].id,
        conversationId: conversations[3].id,
        content:
          "Je suis débutante, donc plutôt quelque chose de doux pour commencer. J'ai beaucoup de stress au travail.",
      },
      {
        senderId: users[4].id,
        receiverId: users[2].id,
        conversationId: conversations[3].id,
        content:
          "Le hatha yoga sera parfait alors ! C'est plus doux et on travaille beaucoup sur la respiration. Idéal pour la gestion du stress.",
      },
      {
        senderId: users[2].id,
        receiverId: users[4].id,
        conversationId: conversations[3].id,
        content:
          "Super ! On s'est vues plusieurs fois maintenant et je me sens vraiment mieux. Merci pour ces séances !",
      },
      {
        senderId: users[2].id,
        receiverId: users[4].id,
        conversationId: conversations[3].id,
        content: "Merci Emma pour les séances de yoga, c'était génial !",
      },
      {
        senderId: users[4].id,
        receiverId: users[2].id,
        conversationId: conversations[3].id,
        content:
          'Avec grand plaisir Claire ! À bientôt pour une nouvelle session.',
      },

      // Conversation 4: Gabrielle <-> Hugo (Échange Python contre SEO)
      {
        senderId: users[6].id,
        receiverId: users[7].id,
        conversationId: conversations[4].id,
        content:
          "Salut Hugo ! Je vois que tu es expert SEO. J'aimerais apprendre les bases pour mon portfolio en ligne.",
      },
      {
        senderId: users[7].id,
        receiverId: users[6].id,
        conversationId: conversations[4].id,
        content:
          "Hey Gabrielle ! Oui avec plaisir ! Et toi tu fais du Python c'est ça ? J'aimerais automatiser certaines tâches SEO.",
      },
      {
        senderId: users[6].id,
        receiverId: users[7].id,
        conversationId: conversations[4].id,
        content:
          'Exactement ! Je peux te montrer comment scraper des données et créer des scripts pour analyser tes backlinks.',
      },
      {
        senderId: users[7].id,
        receiverId: users[6].id,
        conversationId: conversations[4].id,
        content:
          "Ce serait parfait ! De mon côté, je peux t'expliquer comment optimiser tes balises meta, ton sitemap et améliorer ton référencement naturel.",
      },
      {
        senderId: users[6].id,
        receiverId: users[7].id,
        conversationId: conversations[4].id,
        content:
          "Deal ! On peut faire un premier échange ce weekend ? J'ai pas mal de questions sur les mots-clés longue traîne.",
      },
      {
        senderId: users[7].id,
        receiverId: users[6].id,
        conversationId: conversations[4].id,
        content:
          'Samedi après-midi ça te va ? Je peux te faire un audit rapide de ton site en même temps.',
      },
      {
        senderId: users[6].id,
        receiverId: users[7].id,
        conversationId: conversations[4].id,
        content:
          'Parfait pour samedi ! Je prépare un notebook Jupyter avec des exemples de scripts Python pour toi.',
      },

      // Conversation 5: Hugo <-> François (Cours de guitare)
      {
        senderId: users[7].id,
        receiverId: users[5].id,
        conversationId: conversations[5].id,
        content:
          "Bonjour François ! J'ai toujours voulu apprendre la guitare. Tu donnes des cours pour les vrais débutants ?",
      },
      {
        senderId: users[5].id,
        receiverId: users[7].id,
        conversationId: conversations[5].id,
        content:
          'Salut Hugo ! Bien sûr, je travaille avec tous les niveaux. Tu as déjà une guitare ou tu pars de zéro ?',
      },
      {
        senderId: users[7].id,
        receiverId: users[5].id,
        conversationId: conversations[5].id,
        content:
          "J'ai une vieille guitare acoustique de mon père. Elle est encore jouable je pense !",
      },
      {
        senderId: users[5].id,
        receiverId: users[7].id,
        conversationId: conversations[5].id,
        content:
          'Super, les acoustiques classiques sont parfaites pour débuter. On commencera par les accords de base et quelques morceaux simples.',
      },
      {
        senderId: users[7].id,
        receiverId: users[5].id,
        conversationId: conversations[5].id,
        content:
          "Génial ! J'aimerais bien apprendre des morceaux folk/rock. C'est possible rapidement ?",
      },
      {
        senderId: users[5].id,
        receiverId: users[7].id,
        conversationId: conversations[5].id,
        content:
          "Avec 4-5 accords de base tu peux déjà jouer plein de morceaux ! Je t'enverrai une liste de chansons adaptées aux débutants.",
      },

      // Conversation 6: Julien <-> Lucas (Apprentissage du japonais)
      {
        senderId: users[9].id,
        receiverId: users[11].id,
        conversationId: conversations[6].id,
        content:
          "Salut Lucas ! Je vois que tu étudies le japonais. J'aimerais découvrir cette langue.",
      },
      {
        senderId: users[11].id,
        receiverId: users[9].id,
        conversationId: conversations[6].id,
        content:
          "Hey Julien ! Oui je l'étudie depuis 3 ans. Tu pars de zéro ou tu connais déjà les hiraganas ?",
      },
      {
        senderId: users[9].id,
        receiverId: users[11].id,
        conversationId: conversations[6].id,
        content:
          "Vraiment zéro ! Je connais juste quelques mots grâce aux anime haha. C'est dur d'apprendre ?",
      },
      {
        senderId: users[11].id,
        receiverId: users[9].id,
        conversationId: conversations[6].id,
        content:
          "Les hiraganas s'apprennent en 2-3 semaines avec de la pratique quotidienne. Après on passe aux katakanas puis aux kanjis.",
      },
      {
        senderId: users[9].id,
        receiverId: users[11].id,
        conversationId: conversations[6].id,
        content:
          "Ça me tente bien ! En échange, je peux te donner des conseils pour la course à pied si ça t'intéresse.",
      },
      {
        senderId: users[11].id,
        receiverId: users[9].id,
        conversationId: conversations[6].id,
        content:
          'Ah oui trop bien ! Je veux me mettre au running mais je sais pas par où commencer. Deal !',
      },
      {
        senderId: users[9].id,
        receiverId: users[11].id,
        conversationId: conversations[6].id,
        content:
          "Parfait ! On se fait une session cette semaine ? Tu m'apprends les hiraganas et je te fais un programme débutant.",
      },

      // Conversation 7: Tiffany <-> Marie (Formation Illustrator)
      {
        senderId: users[19].id,
        receiverId: users[12].id,
        conversationId: conversations[7].id,
        content:
          "Bonjour Marie ! Je dois créer des visuels pour les réseaux sociaux et Illustrator m'intéresse. Tu peux m'aider ?",
      },
      {
        senderId: users[12].id,
        receiverId: users[19].id,
        conversationId: conversations[7].id,
        content:
          'Salut Tiffany ! Bien sûr, Illustrator est parfait pour les visuels social media. Tu utilises quoi actuellement ?',
      },
      {
        senderId: users[19].id,
        receiverId: users[12].id,
        conversationId: conversations[7].id,
        content:
          'Principalement Canva, mais je sens que je suis limitée pour les créations plus poussées.',
      },
      {
        senderId: users[12].id,
        receiverId: users[19].id,
        conversationId: conversations[7].id,
        content:
          'Je comprends ! Illustrator te donnera beaucoup plus de liberté créative. On peut commencer par les bases : outils de dessin, calques, et export pour le web.',
      },
      {
        senderId: users[19].id,
        receiverId: users[12].id,
        conversationId: conversations[7].id,
        content:
          'Super ! Et je peux te donner des conseils sur la stratégie social media en échange si tu veux.',
      },
      {
        senderId: users[12].id,
        receiverId: users[19].id,
        conversationId: conversations[7].id,
        content:
          "Oh oui, ça m'aiderait beaucoup pour promouvoir mon travail de graphiste freelance ! C'est un bon deal.",
      },

      // Conversation 8: Pierre <-> Nicolas (Cours de cuisine italienne)
      {
        senderId: users[15].id,
        receiverId: users[13].id,
        conversationId: conversations[8].id,
        content:
          "Salut Nicolas ! Je vois que tu es spécialisé en cuisine italienne. J'adorerais apprendre à faire des pâtes fraîches !",
      },
      {
        senderId: users[13].id,
        receiverId: users[15].id,
        conversationId: conversations[8].id,
        content:
          'Ciao Pierre ! Les pâtes fraîches, y a rien de meilleur. Tu as déjà fait de la cuisine ou tu débutes ?',
      },
      {
        senderId: users[15].id,
        receiverId: users[13].id,
        conversationId: conversations[8].id,
        content:
          "Je me débrouille en cuisine basique mais les pâtes maison c'est un autre niveau !",
      },
      {
        senderId: users[13].id,
        receiverId: users[15].id,
        conversationId: conversations[8].id,
        content:
          "C'est plus simple qu'on croit ! Avec de la farine, des œufs et un peu de technique, tu vas régaler. On commence par les tagliatelles ?",
      },
      {
        senderId: users[15].id,
        receiverId: users[13].id,
        conversationId: conversations[8].id,
        content:
          "Parfait ! J'ai vu que tu cherchais à apprendre Python. Je suis électricien mais j'utilise des scripts pour automatiser des calculs au travail.",
      },
      {
        senderId: users[13].id,
        receiverId: users[15].id,
        conversationId: conversations[8].id,
        content:
          "Ah génial ! Ça pourrait m'aider pour gérer mes stocks et mes recettes. On échange nos compétences alors !",
      },

      // Conversation 9: François <-> Karine (Initiation à la menuiserie)
      {
        senderId: users[5].id,
        receiverId: users[10].id,
        conversationId: conversations[9].id,
        content:
          "Bonjour Karine ! Je cherche à fabriquer un support pour mes guitares. Tu pourrais m'aider en menuiserie ?",
      },
      {
        senderId: users[10].id,
        receiverId: users[5].id,
        conversationId: conversations[9].id,
        content:
          "Salut François ! Un support de guitare, c'est un super premier projet ! Tu as déjà travaillé le bois ?",
      },
      {
        senderId: users[5].id,
        receiverId: users[10].id,
        conversationId: conversations[9].id,
        content:
          'Très peu, quelques bricolages basiques. Mais je suis motivé pour apprendre !',
      },
      {
        senderId: users[10].id,
        receiverId: users[5].id,
        conversationId: conversations[9].id,
        content:
          'On va commencer par les bases : mesures, découpe, assemblage. Je peux te montrer dans mon atelier.',
      },
      {
        senderId: users[5].id,
        receiverId: users[10].id,
        conversationId: conversations[9].id,
        content:
          "Génial ! J'ai vu que tu voulais apprendre le piano. Je peux te donner des cours en échange !",
      },
      {
        senderId: users[10].id,
        receiverId: users[5].id,
        conversationId: conversations[9].id,
        content:
          "Oh oui, ça fait des années que je veux m'y mettre ! On fait comme ça, un cours de menuiserie contre un cours de piano !",
      },

      // Conversation 10: Emma <-> Isabelle (Échange piano contre musculation)
      {
        senderId: users[4].id,
        receiverId: users[8].id,
        conversationId: conversations[10].id,
        content:
          "Salut Isabelle ! Je rêve d'apprendre le piano. Tu serais dispo pour quelques cours ?",
      },
      {
        senderId: users[8].id,
        receiverId: users[4].id,
        conversationId: conversations[10].id,
        content:
          "Bonjour Emma ! Bien sûr, j'adore enseigner le piano. Tu as un clavier chez toi ?",
      },
      {
        senderId: users[4].id,
        receiverId: users[8].id,
        conversationId: conversations[10].id,
        content:
          "Oui, j'ai un petit synthétiseur ! En échange, je peux te coacher en musculation.",
      },
      {
        senderId: users[8].id,
        receiverId: users[4].id,
        conversationId: conversations[10].id,
        content:
          "Ah super timing, je voulais justement me renforcer ! J'ai mal au dos à force d'être assise au piano.",
      },
      {
        senderId: users[4].id,
        receiverId: users[8].id,
        conversationId: conversations[10].id,
        content:
          'Je peux te montrer des exercices de renforcement du dos parfaits pour les musiciens !',
      },
      {
        senderId: users[8].id,
        receiverId: users[4].id,
        conversationId: conversations[10].id,
        content:
          "C'est exactement ce qu'il me faut. On se voit cette semaine ? Je suis libre jeudi après-midi.",
      },
      {
        senderId: users[4].id,
        receiverId: users[8].id,
        conversationId: conversations[10].id,
        content:
          "Jeudi parfait ! On fait d'abord le piano chez toi puis la muscu à la salle ?",
      },

      // Conversation 11: Lucas <-> Ophélie (Cours de chant - CLOSED)
      {
        senderId: users[11].id,
        receiverId: users[14].id,
        conversationId: conversations[11].id,
        content:
          "Salut Ophélie ! Je chante faux mais j'adorerais m'améliorer. Tu donnes des cours ?",
      },
      {
        senderId: users[14].id,
        receiverId: users[11].id,
        conversationId: conversations[11].id,
        content:
          "Hey Lucas ! Personne ne chante vraiment 'faux', c'est souvent juste une question de technique et de confiance !",
      },
      {
        senderId: users[11].id,
        receiverId: users[14].id,
        conversationId: conversations[11].id,
        content:
          "Ah bon ? Mes amis me disent toujours d'arrêter quand je chante sous la douche haha !",
      },
      {
        senderId: users[14].id,
        receiverId: users[11].id,
        conversationId: conversations[11].id,
        content:
          'Haha, on va travailler ça ! Avec quelques exercices de respiration et de placement de voix, tu vas les épater.',
      },
      {
        senderId: users[11].id,
        receiverId: users[14].id,
        conversationId: conversations[11].id,
        content:
          "Merci beaucoup pour ces premiers cours, j'ai vraiment progressé ! Je me sens plus à l'aise.",
      },
      {
        senderId: users[14].id,
        receiverId: users[11].id,
        conversationId: conversations[11].id,
        content:
          "Tu as fait de gros progrès Lucas ! Continue à pratiquer les vocalises tous les jours. N'hésite pas si tu veux reprendre des cours !",
      },

      // Conversation 12: Ugo <-> Rachel (Aide en allemand pour l'emploi)
      {
        senderId: users[20].id,
        receiverId: users[17].id,
        conversationId: conversations[12].id,
        content:
          "Bonjour Rachel ! J'ai une opportunité de stage à Berlin et je dois améliorer mon allemand rapidement.",
      },
      {
        senderId: users[17].id,
        receiverId: users[20].id,
        conversationId: conversations[12].id,
        content:
          'Salut Ugo ! Félicitations pour cette opportunité ! Tu as quel niveau actuellement ?',
      },
      {
        senderId: users[20].id,
        receiverId: users[17].id,
        conversationId: conversations[12].id,
        content:
          "J'ai fait allemand LV2 au lycée mais j'ai tout oublié... Je dirais A2 grand maximum.",
      },
      {
        senderId: users[17].id,
        receiverId: users[20].id,
        conversationId: conversations[12].id,
        content:
          "C'est déjà une base ! On va se concentrer sur le vocabulaire professionnel et les situations de bureau.",
      },
      {
        senderId: users[20].id,
        receiverId: users[17].id,
        conversationId: conversations[12].id,
        content:
          'Super ! Je suis en design UI/UX, donc le vocabulaire tech serait idéal.',
      },
      {
        senderId: users[17].id,
        receiverId: users[20].id,
        conversationId: conversations[12].id,
        content:
          'Parfait, je vais préparer des fiches de vocabulaire design/tech en allemand. On commence demain ?',
      },
      {
        senderId: users[20].id,
        receiverId: users[17].id,
        conversationId: conversations[12].id,
        content:
          "Oui génial ! En échange je peux t'aider sur Figma si tu as des projets de design.",
      },

      // Conversation 13: Alice <-> Gabrielle (Échange TypeScript contre UI/UX)
      {
        senderId: users[0].id,
        receiverId: users[6].id,
        conversationId: conversations[13].id,
        content:
          "Salut Gabrielle ! J'ai vu que tu utilises TypeScript aussi. Tu voudrais qu'on partage nos connaissances ?",
      },
      {
        senderId: users[6].id,
        receiverId: users[0].id,
        conversationId: conversations[13].id,
        content:
          'Hey Alice ! Oui carrément ! Je suis surtout côté backend, je pourrais apprendre des trucs sur le frontend.',
      },
      {
        senderId: users[0].id,
        receiverId: users[6].id,
        conversationId: conversations[13].id,
        content:
          'Je peux te montrer comment on type les composants React et les hooks. Et toi, tu connais bien Node.js ?',
      },
      {
        senderId: users[6].id,
        receiverId: users[0].id,
        conversationId: conversations[13].id,
        content:
          'Oui, surtout avec Express et Prisma ! Je peux te montrer comment structurer une API proprement typée.',
      },
      {
        senderId: users[0].id,
        receiverId: users[6].id,
        conversationId: conversations[13].id,
        content:
          'Parfait ! Je galère toujours un peu avec les génériques TypeScript côté serveur.',
      },
      {
        senderId: users[6].id,
        receiverId: users[0].id,
        conversationId: conversations[13].id,
        content:
          'Pas de souci, on va démystifier tout ça ! On fait un call cette semaine pour commencer ?',
      },

      // Conversation 14: Rachel <-> Julien (Coaching course à pied)
      {
        senderId: users[17].id,
        receiverId: users[9].id,
        conversationId: conversations[14].id,
        content:
          'Bonjour Julien ! Je veux me mettre à la course à pied mais je ne sais pas comment commencer.',
      },
      {
        senderId: users[9].id,
        receiverId: users[17].id,
        conversationId: conversations[14].id,
        content:
          'Salut Rachel ! Super décision ! Tu as déjà une pratique sportive régulière ?',
      },
      {
        senderId: users[17].id,
        receiverId: users[9].id,
        conversationId: conversations[14].id,
        content:
          "Pas vraiment, je marche beaucoup mais c'est tout. Je veux commencer doucement.",
      },
      {
        senderId: users[9].id,
        receiverId: users[17].id,
        conversationId: conversations[14].id,
        content:
          "C'est la meilleure approche ! On va faire un programme progressif, en alternant marche et course au début.",
      },
      {
        senderId: users[17].id,
        receiverId: users[9].id,
        conversationId: conversations[14].id,
        content:
          "Super, ça me rassure ! J'aimerais bien pouvoir courir 5km d'ici quelques mois.",
      },
      {
        senderId: users[9].id,
        receiverId: users[17].id,
        conversationId: conversations[14].id,
        content:
          "C'est un objectif réaliste ! En 8-10 semaines avec de la régularité, tu peux y arriver. Je te fais un plan d'entraînement personnalisé.",
      },
      {
        senderId: users[17].id,
        receiverId: users[9].id,
        conversationId: conversations[14].id,
        content:
          'Merci beaucoup ! Et si tu veux améliorer ton allemand en échange, je suis dispo !',
      },

      // Conversation 15: Sébastien <-> Karine (Aide en plomberie - CLOSED)
      {
        senderId: users[18].id,
        receiverId: users[10].id,
        conversationId: conversations[15].id,
        content:
          "Salut Karine ! J'ai vu que tu fais de la menuiserie. J'aurais besoin d'un coup de main pour fabriquer un meuble de salle de bain.",
      },
      {
        senderId: users[10].id,
        receiverId: users[18].id,
        conversationId: conversations[15].id,
        content:
          "Hey Sébastien ! Un meuble de salle de bain, c'est un projet sympa. Tu as des contraintes de dimensions ?",
      },
      {
        senderId: users[18].id,
        receiverId: users[10].id,
        conversationId: conversations[15].id,
        content:
          "Oui, c'est une petite salle de bain donc il faut un meuble sur mesure. Je peux gérer toute la plomberie en échange !",
      },
      {
        senderId: users[10].id,
        receiverId: users[18].id,
        conversationId: conversations[15].id,
        content:
          "Ah super, justement j'ai un souci de fuite dans ma cuisine ! On peut s'entraider alors.",
      },
      {
        senderId: users[18].id,
        receiverId: users[10].id,
        conversationId: conversations[15].id,
        content:
          "J'ai réparé la fuite, c'était juste un joint à changer. Ton meuble avance bien ?",
      },
      {
        senderId: users[10].id,
        receiverId: users[18].id,
        conversationId: conversations[15].id,
        content:
          'Merci encore pour la réparation ! Oui le meuble est terminé, tu peux passer le récupérer quand tu veux.',
      },
      {
        senderId: users[18].id,
        receiverId: users[10].id,
        conversationId: conversations[15].id,
        content: 'Parfait ! Je passe demain. Merci Karine, super échange !',
      },
    ],
  });
  console.log('✅ Messages created');

  // ============================================
  // 14. REFRESH TOKENS
  // ============================================
  console.log('📝 Creating refresh tokens...');
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.createMany({
    data: users.map((user) => ({
      userId: user.id,
      token: `refreshToken_${user.id}_${Math.random()
        .toString(36)
        .substring(7)}`,
      expireAt: in30Days,
    })),
  });
  console.log('✅ Refresh tokens created');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - 1 role created`);
  console.log(`   - ${categories.count} categories created`);
  console.log(`   - ${allSkills.length} skills created`);
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${conversations.length} conversations created`);
  console.log(
    '   - User skills, interests, availabilities, follows, ratings, messages, and refresh tokens created',
  );
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
