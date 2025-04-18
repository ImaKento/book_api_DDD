import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // すでにあるデータを削除
  await prisma.books.deleteMany();
  await prisma.authors.deleteMany();
  await prisma.categories.deleteMany();

  // Authors
  const authors = await prisma.$transaction([
    prisma.authors.create({ data: { name: '村上 春樹' } }),
    prisma.authors.create({ data: { name: '東野 圭吾' } }),
    prisma.authors.create({ data: { name: '湊 かなえ' } }),
    prisma.authors.create({ data: { name: '伊坂 幸太郎' } }),
    prisma.authors.create({ data: { name: '百田 尚樹' } }),
  ]);

  // Categories
  const categories = await prisma.$transaction([
    prisma.categories.create({ data: { name: '文学', description: 'フィクション中心' } }),
    prisma.categories.create({ data: { name: 'ミステリー', description: '推理・サスペンス' } }),
    prisma.categories.create({ data: { name: '歴史', description: '歴史書・時代小説' } }),
    prisma.categories.create({ data: { name: 'SF', description: 'サイエンスフィクション' } }),
  ]);

  // Books
  await prisma.books.createMany({
    data: [
      {
        title: 'ノルウェイの森',
        isbn: '9784061860253',
        author_id: authors[0].id,
        category_id: categories[0].id,
      },
      {
        title: '1Q84',
        isbn: '9784103534228',
        author_id: authors[0].id,
        category_id: categories[0].id,
      },
      {
        title: '容疑者Xの献身',
        isbn: '9784163237209',
        author_id: authors[1].id,
        category_id: categories[1].id,
      },
      {
        title: 'ガリレオの苦悩',
        isbn: '9784163237216',
        author_id: authors[1].id,
        category_id: categories[1].id,
      },
      {
        title: '告白',
        isbn: '9784575513559',
        author_id: authors[2].id,
        category_id: categories[1].id,
      },
      {
        title: '少女',
        isbn: '9784575519575',
        author_id: authors[2].id,
        category_id: categories[1].id,
      },
      {
        title: '重力ピエロ',
        isbn: '9784104596010',
        author_id: authors[3].id,
        category_id: categories[0].id,
      },
      {
        title: 'ゴールデンスランバー',
        isbn: '9784104596027',
        author_id: authors[3].id,
        category_id: categories[1].id,
      },
      {
        title: '永遠の0',
        isbn: '9784062159478',
        author_id: authors[4].id,
        category_id: categories[2].id,
      },
      {
        title: '海賊とよばれた男',
        isbn: '9784062200125',
        author_id: authors[4].id,
        category_id: categories[2].id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed data inserted successfully!');
  })
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });