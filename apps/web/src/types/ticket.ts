export interface TicketStatus {
  label: string;
  color: string;
}

export interface TicketUser {
  name: string | null;
  email: string | null;
}

export interface Ticket {
  _id: string;
  coperaRowId: string;
  title: string;
  details?: string;
  userId: string;
  user?: TicketUser | null;
  status?: TicketStatus | null;
  requestType?: TicketStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketParams {
  title: string;
  details?: string;
  requestType?: string;
}

export interface RequestTypeOption {
  optionId: string;
  label: string;
}

export interface Activity {
  id: string;
  type: 'created' | 'status_change' | 'comment';
  content: string;
  userName: string;
  createdAt: string;
}

export interface CommentAuthor {
  _id: string;
  name: string | null;
  picture: string | null;
  email: string | null;
}

export interface RowComment {
  _id: string;
  content: string | null;
  contentType: string;
  visibility: string;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CommentPageInfo {
  endCursor: string | null;
  startCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CommentPagination {
  items: RowComment[];
  pageInfo: CommentPageInfo;
}

export interface CreateCommentParams {
  content: string;
}
