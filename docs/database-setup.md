# Database Setup for CrabArt

## Recommended Supabase Configuration

To maintain data integrity between storage and database records, consider these options:

### Option 1: Database Triggers (Recommended)

Set up a PostgreSQL trigger to automatically delete storage files when a database record is deleted:

```sql
-- Function to delete storage file when generation is deleted
CREATE OR REPLACE FUNCTION delete_generation_storage()
RETURNS TRIGGER AS $$
DECLARE
  storage_path TEXT;
BEGIN
  -- Extract path from image_url
  -- Assuming URL format: https://xxx.supabase.co/storage/v1/object/public/generations/xxx.png
  storage_path := regexp_replace(OLD.image_url, '^.*/storage/v1/object/public/', '');
  
  -- Delete from storage
  PERFORM storage.delete(storage_path);
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on delete
CREATE TRIGGER on_generation_delete
BEFORE DELETE ON generations
FOR EACH ROW
EXECUTE FUNCTION delete_generation_storage();
```

### Option 2: Storage Bucket Policies

Configure your storage bucket to auto-delete orphaned files:

1. In Supabase Dashboard → Storage → Policies
2. Add a policy that checks if a corresponding database record exists
3. Set up a periodic cleanup job

### Option 3: Manual Cleanup

Use the provided cleanup script:

```bash
# Set your Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_KEY="your-service-key"

# Run cleanup
npm run cleanup:images
```

## Database Schema

Ensure your `generations` table has proper constraints:

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expression TEXT NOT NULL,
  outfit TEXT NOT NULL,
  accessory TEXT NOT NULL,
  image_url TEXT NOT NULL,
  
  -- Add constraints
  CONSTRAINT valid_image_url CHECK (image_url LIKE 'https://%')
);

-- Index for faster queries
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
```

## Best Practices

1. **Always delete from database first** - This ensures triggers can clean up storage
2. **Use transactions** - Wrap deletions in transactions for consistency
3. **Regular backups** - Keep backups of both database and storage
4. **Monitor orphaned files** - Run cleanup script periodically

## Security Note

Never expose admin functionality directly in a public web app. Instead:

- Use environment variables for authentication
- Create separate admin scripts
- Use Supabase Row Level Security (RLS)
- Implement proper authentication if needed