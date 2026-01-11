import { prisma } from "../src/lib/Prisma";

async function main() {
  console.log("🌱 Starting seed...");

  // --- Clear existing data (respect foreign key order) ---
  console.log("🧹 Deleting existing data...");
  // Delete child records first
  const deletedItems = await prisma.borrowItem.deleteMany();
  const deletedTransactions = await prisma.borrowTransaction.deleteMany();
  // Books reference authors, so delete books before authors
  const deletedBooks = await prisma.book.deleteMany();
  const deletedAuthors = await prisma.author.deleteMany();
  // Members after transactions
  const deletedMembers = await prisma.member.deleteMany();

  console.log(
    `🧹 Deleted: borrowItems=${deletedItems.count}, borrowTransactions=${deletedTransactions.count}, books=${deletedBooks.count}, authors=${deletedAuthors.count}, members=${deletedMembers.count}`
  );

  // 1. Create Authors (matches schema: affiliation)
  const author1 = await prisma.author.create({
    data: {
      firstName: "J.K.",
      lastName: "Rowling",
      affiliation: "Bloomsbury",
    },
  });

  const author2 = await prisma.author.create({
    data: {
      firstName: "George",
      lastName: "Orwell",
      affiliation: "Secker & Warburg",
    },
  });

  console.log(`✅ Created authors: ${author1.firstName}, ${author2.firstName}`);

  // 2. Create Books (matches schema: title, isbn, category, authorId)
  const booksData = [
    {
      title: "Harry Potter and the Sorcerer's Stone",
      isbn: "9780747532743",
      category: "Fantasy",
      authorId: author1.id,
    },
    {
      title: "Harry Potter and the Chamber of Secrets",
      isbn: "9780747538486",
      category: "Fantasy",
      authorId: author1.id,
    },
    {
      title: "Harry Potter and the Prisoner of Azkaban",
      isbn: "9780747542155",
      category: "Fantasy",
      authorId: author1.id,
    },
    {
      title: "1984",
      isbn: "9780451524935",
      category: "Dystopian",
      authorId: author2.id,
    },
    {
      title: "Animal Farm",
      isbn: "9780451526342",
      category: "Political Satire",
      authorId: author2.id,
    },
  ];

  const books = [] as Array<any>;
  for (const b of booksData) {
    const book = await prisma.book.create({ data: b });
    books.push(book);
  }

  console.log(`✅ Created ${books.length} books`);

  // 3. Create Members (matches schema: memberCode, firstName, lastName, phone)
  const member1 = await prisma.member.create({
    data: {
      memberCode: "M001",
      firstName: "John",
      lastName: "Doe",
      phone: "081-234-5678",
    },
  });

  const member2 = await prisma.member.create({
    data: {
      memberCode: "M002",
      firstName: "Jane",
      lastName: "Smith",
      phone: "089-987-6543",
    },
  });

  console.log(
    `✅ Created members: ${member1.firstName} (${member1.memberCode}), ${member2.firstName} (${member2.memberCode})`
  );

  // 4. Create Borrow Transactions and Items

  // Scenario A: John borrows 2 Harry Potter books in one transaction (active loan)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const transaction1 = await prisma.borrowTransaction.create({
    data: {
      memberId: member1.id,
      items: {
        create: [
          { bookId: books[0].id, dueDate: nextWeek },
          { bookId: books[1].id, dueDate: nextWeek },
        ],
      },
    },
    include: { items: true },
  });

  console.log(
    `✅ Created transaction ${transaction1.id} with ${transaction1.items.length} items`
  );

  // Scenario B: Jane borrowed 1 book and already returned it
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const returnedDate = new Date(lastMonth);
  returnedDate.setDate(returnedDate.getDate() + 5);

  const transaction2 = await prisma.borrowTransaction.create({
    data: {
      memberId: member2.id,
      items: {
        create: [
          {
            bookId: books[3].id,
            dueDate: lastMonth,
            returnedAt: returnedDate,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log(`✅ Created transaction ${transaction2.id} (returned item)`);

  console.log("🌱 Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
