import { supabase } from '../src/lib/supabaseClient';

async function seedFakeData() {
  // Example: Insert fake users
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  ];

  for (const user of users) {
    const { error } = await supabase.from('users').upsert(user);
    if (error) {
      console.error('Error inserting user:', user, error);
    } else {
      console.log('Inserted user:', user);
    }
  }

  // Add more fake data for other tables as needed
}

seedFakeData()
  .then(() => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
