const PrismaClient = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  try {
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

main();
