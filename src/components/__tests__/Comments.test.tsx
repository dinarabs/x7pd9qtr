import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Comments from '../Comments';

// Mock the useComments hook
vi.mock('../../hooks/useComments', () => ({
  useComments: () => ({
    tree: [
      {
        id: '1',
        text: 'First comment',
        parentId: null,
        createdAt: Date.now(),
        children: [
          {
            id: '2',
            text: 'Reply to first comment',
            parentId: '1',
            createdAt: Date.now(),
            children: []
          }
        ]
      }
    ],
    add: vi.fn(),
    remove: vi.fn()
  })
}));

describe('Comments Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the comments title', () => {
    render(<Comments />);
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('renders the input field and add button', () => {
    render(<Comments />);
    expect(screen.getByPlaceholderText('Write a comment…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('disables add button when input is empty', () => {
    render(<Comments />);
    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeDisabled();
  });

  it('enables add button when input has text', async () => {
    const user = userEvent.setup();
    render(<Comments />);
    
    const input = screen.getByPlaceholderText('Write a comment…');
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(input, 'Test comment');
    expect(addButton).toBeEnabled();
  });

  it('renders existing comments', () => {
    render(<Comments />);
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Reply to first comment')).toBeInTheDocument();
  });
});
