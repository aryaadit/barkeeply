import { useState } from 'react';
import { Bug, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BugReportDialogProps {
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function BugReportDialog({ trigger, onOpenChange }: BugReportDialogProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a bug report');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('bug_reports').insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
      });

      if (error) throw error;

      toast.success('Bug report submitted', {
        description: 'Thank you for your feedback!',
      });
      
      setTitle('');
      setDescription('');
      handleOpenChange(false);
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast.error('Failed to submit bug report', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bug-title">Title</Label>
        <Input
          id="bug-title"
          placeholder="Brief description of the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bug-description">Description</Label>
        <Textarea
          id="bug-description"
          placeholder="What happened? What did you expect to happen? Steps to reproduce..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={2000}
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOpenChange(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </Button>
      </div>
    </form>
  );

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Bug className="w-4 h-4 mr-2" />
      Report Bug
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          {trigger || defaultTrigger}
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Report a Bug
            </DrawerTitle>
            <DrawerDescription>
              Found something wrong? Let us know and we'll fix it.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-4 pb-8">
              {formContent}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Report a Bug
          </DialogTitle>
          <DialogDescription>
            Found something wrong? Let us know and we'll fix it.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
