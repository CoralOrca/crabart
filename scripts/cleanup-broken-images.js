#!/usr/bin/env node

/**
 * Cleanup script for broken images in the gallery
 * This checks for database records with missing images and removes them
 * 
 * Run with: npm run cleanup:images
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

const { createClient } = require('@supabase/supabase-js');

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment');
  console.error('Example: NEXT_PUBLIC_SUPABASE_URL=your-url SUPABASE_SERVICE_KEY=your-key npm run cleanup:images');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function cleanup() {
  console.log('🔍 Fetching all generations...');
  
  const { data: generations, error } = await supabase
    .from('generations')
    .select('id, image_url');
    
  if (error) {
    console.error('❌ Failed to fetch generations:', error.message);
    return;
  }
  
  console.log(`Found ${generations.length} generations`);
  
  const brokenIds = [];
  let checkedCount = 0;
  
  // Check each image
  for (const gen of generations) {
    process.stdout.write(`[${++checkedCount}/${generations.length}] Checking ${gen.id}... `);
    const exists = await checkImageExists(gen.image_url);
    
    if (!exists) {
      process.stdout.write('❌ Broken\n');
      brokenIds.push(gen.id);
    } else {
      process.stdout.write('✅ OK\n');
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (brokenIds.length === 0) {
    console.log('\n✨ No broken images found!');
    return;
  }
  
  console.log(`\n🗑️  Found ${brokenIds.length} broken images`);
  console.log('IDs:', brokenIds.join(', '));
  
  // Ask for confirmation
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\n⚠️  Delete these records from the database? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('Cancelled');
      readline.close();
      return;
    }
    
    console.log('\n🗑️  Deleting broken records...');
    
    const { error: deleteError } = await supabase
      .from('generations')
      .delete()
      .in('id', brokenIds);
      
    if (deleteError) {
      console.error('❌ Failed to delete:', deleteError.message);
    } else {
      console.log(`✅ Successfully deleted ${brokenIds.length} broken records`);
    }
    
    readline.close();
  });
}

// Run cleanup
cleanup().catch(console.error);