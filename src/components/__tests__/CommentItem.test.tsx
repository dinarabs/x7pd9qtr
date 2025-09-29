import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentItem } from '../CommentItem';

const mockNode = {
  id: '1',
  text: 'Test comment',
  parentId: null,
  createdAt: Date.now(),
  children: []
};

const mockOnReply = vi.fn();
const mockOnDelete = vi.fn();

describe('CommentItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders comment text', () => {
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('renders delete button', () => {
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders reply input and send button', () => {
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    expect(screen.getByPlaceholderText('Reply…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onReply when send button is clicked with text', async () => {
    const user = userEvent.setup();
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    
    const replyInput = screen.getByPlaceholderText('Reply…');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(replyInput, 'Test reply');
    await user.click(sendButton);
    
    expect(mockOnReply).toHaveBeenCalledWith('1', 'Test reply');
  });

  it('disables send button when reply input is empty', () => {
    render(
      <CommentItem 
        node={mockNode} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('renders nested comments', () => {
    const nodeWithChildren = {
      ...mockNode,
      children: [
        {
          id: '2',
          text: 'Nested comment',
          parentId: '1',
          createdAt: Date.now(),
          children: []
        }
      ]
    };

    render(
      <CommentItem 
        node={nodeWithChildren} 
        onReply={mockOnReply} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Nested comment')).toBeInTheDocument();
  });
});
