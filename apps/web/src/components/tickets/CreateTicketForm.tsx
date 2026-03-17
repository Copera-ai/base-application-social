import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Textarea } from 'src/components/ui/textarea';
import { getPortalById } from 'src/data/portals';
import { useCreateTicket, useRequestTypes } from 'src/hooks/useTickets';
import type { Ticket } from 'src/types/ticket';
import { getErrorMessage } from 'src/utils/error-message';

interface CreateTicketFormValues {
  title: string;
  details: string;
}

interface CreateTicketFormProps {
  portalId?: string | null;
  onSuccess?: (ticket: Ticket) => void;
}

export function CreateTicketForm({
  portalId,
  onSuccess,
}: CreateTicketFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const { mutateAsync: createTicket, isPending } = useCreateTicket();
  const { data: requestTypes } = useRequestTypes();

  useEffect(() => {
    if (!portalId || !requestTypes?.length) return;
    const portal = getPortalById(portalId);
    if (!portal) return;
    const match = requestTypes.find((rt) => rt.label === portal.title);
    if (match) setCategory(match.optionId);
  }, [portalId, requestTypes]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    defaultValues: {
      title: '',
      details: '',
    },
  });

  const onSubmit = async (data: CreateTicketFormValues) => {
    try {
      setError(null);
      const ticket = await createTicket({
        title: data.title,
        details: data.details || undefined,
        requestType: category || undefined,
      });
      reset();
      onSuccess?.(ticket);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create ticket'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {requestTypes?.map((option) => (
              <SelectItem key={option.optionId} value={option.optionId}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Summary</Label>
        <Input
          id="title"
          placeholder="Briefly describe your request"
          {...register('title', { required: 'Summary is required' })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Description</Label>
        <Textarea
          id="details"
          placeholder="Provide more details about your request..."
          className="min-h-[140px]"
          {...register('details')}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
