-- Add INSERT policy for user_roles table - only admins can assign roles
CREATE POLICY "Only admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));