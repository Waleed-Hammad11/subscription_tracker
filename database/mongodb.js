import mongoose from 'mongoose';

import { DB_URI } from '../config/env.js';

if (!DB_URI) {
	throw new Error(
		'please define the MONGODB_URL environment variable inside .env.<developement/production> local ',
	);
}

const connectToDatabase = async () => {
	try {
		await mongoose.connect(DB_URI);
	} catch (error) {
		console.log('error connecting to database', error);
		process.exit(1);
	}
};

export default connectToDatabase;
