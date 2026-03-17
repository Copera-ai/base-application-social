import { Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Textarea } from 'src/components/ui/textarea';
import { useCreateComment } from 'src/hooks/useTickets';

interface CommentInputProps {
  ticketId: string;
}

export function CommentInput({ ticketId }: CommentInputProps) {
  const [comment, setComment] = useState('');
  const { mutate: createComment, isPending } = useCreateComment(ticketId);

  const handleSubmit = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    createComment(
      { content: trimmed },
      {
        onSuccess: () => {
          setComment('');
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[80px] resize-none"
        disabled={isPending}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!comment.trim() || isPending}
          onClick={handleSubmit}
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
