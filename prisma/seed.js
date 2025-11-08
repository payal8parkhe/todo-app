const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  await prisma.todo.createMany({
    data: [
      { title: 'Learn Zero Downtime Deployment', completed: true },
      { title: 'Build amazing applications', completed: false },
      { title: 'Deploy with confidence', completed: false },
    ],
  });
  
  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
