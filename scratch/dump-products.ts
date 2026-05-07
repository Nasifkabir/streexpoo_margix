import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import Product from '../models/Product';
import connectToDatabase from '../lib/db';

async function dump() {
  await connectToDatabase();
  const products = await Product.find({});
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}

dump();
