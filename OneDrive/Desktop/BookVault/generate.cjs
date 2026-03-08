const fs = require('fs');

const categories = ["Programming", "Technology", "Fiction", "Science"];
const authors = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams", "Charlie Brown"];

const books = Array.from({ length: 100 }, (_, i) => {
  const category = categories[i % categories.length];
  return {
    id: `dummy-${i + 1}`,
    volumeInfo: {
      title: `${category} Book ${i + 1} - The Ultimate Guide`,
      authors: [authors[i % authors.length]],
      categories: [category],
      averageRating: (Math.random() * 2 + 3).toFixed(1),
      description: `This is a detailed description for ${category} Book ${i + 1}. It covers various topics related to ${category.toLowerCase()} and provides great insights for readers of all levels.`,
      imageLinks: {
        thumbnail: `https://picsum.photos/seed/book${i+1}/300/400`
      },
      pageCount: Math.floor(Math.random() * 300) + 100,
      publishedDate: `202${Math.floor(Math.random() * 5)}-0${Math.floor(Math.random() * 9) + 1}-15`
    }
  };
});

fs.writeFileSync('./src/data/books.json', JSON.stringify(books, null, 2));
console.log('Generated 100 books');
