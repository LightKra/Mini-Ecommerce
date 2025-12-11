import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'ecommerce',
  password: process.env.DB_PASSWORD || 'ecommerce',
  database: process.env.DB_DATABASE || 'mini_ecommerce',
  synchronize: false,
  logging: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Create roles
    await queryRunner.query(
      `INSERT IGNORE INTO roles (id, name) VALUES (1, 'admin')`,
    );
    await queryRunner.query(
      `INSERT IGNORE INTO roles (id, name ) VALUES (2, 'customer')`,
    );
    console.log('Roles created');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await queryRunner.query(
      `
      INSERT IGNORE INTO users (name, email, password, role_id)
      VALUES ('Admin User', 'admin@example.com', ?, 1)
    `,
      [adminPassword],
    );

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    await queryRunner.query(
      `
      INSERT IGNORE INTO users (name, email, password, role_id)
      VALUES ('John Doe', 'customer@example.com', ?, 2)
    `,
      [customerPassword],
    );

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
      { name: 'Books', slug: 'books' },
      { name: 'Home & Garden', slug: 'home-garden' },
      { name: 'Sports', slug: 'sports' },
    ];

    for (const category of categories) {
      await queryRunner.query(
        `
        INSERT IGNORE INTO categories (name, slug)
        VALUES (?, ?)
      `,
        [category.name, category.slug],
      );
    }

    // Create products
    const products = [
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'The latest iPhone with A17 Pro chip and titanium design.',
        price: 999.99,
        stock: 50,
        categorySlug: 'electronics',
      },
      {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Supercharged by M3 chip. Strikingly thin design.',
        price: 1099.0,
        stock: 30,
        categorySlug: 'electronics',
      },
      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling headphones.',
        price: 349.99,
        stock: 100,
        categorySlug: 'electronics',
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description:
          'Premium 100% cotton t-shirt. Available in multiple colors.',
        price: 29.99,
        stock: 200,
        categorySlug: 'clothing',
      },
      {
        name: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic fit denim jeans. Comfortable and durable.',
        price: 79.99,
        stock: 150,
        categorySlug: 'clothing',
      },
      {
        name: 'Clean Code',
        slug: 'clean-code',
        description:
          'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
        price: 39.99,
        stock: 75,
        categorySlug: 'books',
      },
      {
        name: 'The Pragmatic Programmer',
        slug: 'the-pragmatic-programmer',
        description: 'Your Journey To Mastery, 20th Anniversary Edition.',
        price: 49.99,
        stock: 60,
        categorySlug: 'books',
      },
      {
        name: 'Garden Tool Set',
        slug: 'garden-tool-set',
        description: 'Complete set of essential gardening tools.',
        price: 89.99,
        stock: 40,
        categorySlug: 'home-garden',
      },
      {
        name: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip exercise yoga mat. Perfect for home workouts.',
        price: 34.99,
        stock: 120,
        categorySlug: 'sports',
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Lightweight running shoes with cushioned sole.',
        price: 129.99,
        stock: 80,
        categorySlug: 'sports',
      },
    ];

    const productImageUrl =
      'https://wallpapergod.com/images/hd/amazon-1440X2560-wallpaper-swwznz480jfn69dv.jpeg';

    for (const product of products) {
      const categoryResult = (await queryRunner.query(
        `SELECT id FROM categories WHERE slug = ?`,
        [product.categorySlug],
      )) as { id: number }[];

      if (categoryResult.length > 0) {
        const categoryId: number = categoryResult[0].id;
        await queryRunner.query(
          `
          INSERT IGNORE INTO products (name, slug, description, price, stock, category_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
          [
            product.name,
            product.slug,
            product.description,
            product.price,
            product.stock,
            categoryId,
          ],
        );

        // Get the product ID and add image
        const productResult = (await queryRunner.query(
          `SELECT id FROM products WHERE slug = ?`,
          [product.slug],
        )) as { id: number }[];

        if (productResult.length > 0) {
          const productId: number = productResult[0].id;
          await queryRunner.query(
            `
            INSERT IGNORE INTO product_images (product_id, url, alt)
            VALUES (?, ?, ?)
          `,
            [productId, productImageUrl, product.name],
          );
        }
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed().catch(console.error);
