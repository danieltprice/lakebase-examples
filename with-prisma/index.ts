import { getPrisma } from "./lib/lakebase";

async function main() {
  const prisma = await getPrisma();
  await prisma.user.create({
    data: {
      name: "Alice",
      email: `alice-${new Date().getTime()}@prisma.io`,
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsers, { depth: null });
  await prisma.post.update({
    where: { id: 1 },
    data: { published: true },
  });
  const allUsersAgain = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.dir(allUsersAgain, { depth: null });
  return prisma;
}

main()
  .then(async (prisma) => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    try {
      const prisma = await getPrisma();
      await prisma.$disconnect();
    } catch (_) {}
    process.exit(1);
  });
