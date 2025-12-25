/*
  # Add News View Increment Function

  1. Function
    - `increment_article_views(article_id uuid)` - Atomic view counter update

  2. Security
    - SECURITY DEFINER for proper permissions
    - Grants execute to anon and authenticated roles

  3. Purpose
    - Prevents race conditions in view counting
    - Efficient single-query update
    - Automatically updates updated_at timestamp
*/

-- Function to increment article views atomically
CREATE OR REPLACE FUNCTION increment_article_views(article_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE news_articles
  SET views = views + 1,
      updated_at = now()
  WHERE id = article_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_article_views(uuid) TO anon, authenticated;
