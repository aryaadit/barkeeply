-- Add image_url column to bug_reports table
ALTER TABLE public.bug_reports 
ADD COLUMN image_url TEXT;

-- Create storage bucket for bug report attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('bug-attachments', 'bug-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own bug attachments
CREATE POLICY "Users can upload bug attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'bug-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to bug attachments
CREATE POLICY "Bug attachments are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'bug-attachments');