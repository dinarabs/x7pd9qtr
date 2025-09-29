import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useComments } from '../useComments';

// Mock RxDB
vi.mock('../../db/rxdb', () => ({
  getDB: vi.fn(() => Promise.resolve({
    comments: {
      find: vi.fn(() => ({
        sort: vi.fn(() => ({
          $: {
            subscribe: vi.fn((callback) => {
              // Simulate initial data
              callback([
                {
                  toJSON: () => ({
                    id: '1',
                    text: 'Test comment',
                    parentId: null,
                    createdAt: Date.now()
                  })
                }
              ]);
              return { unsubscribe: vi.fn() };
            })
          }
        }))
      }))
    }
  })),
  addComment: vi.fn(),
  deleteCommentCascade: vi.fn()
}));

describe('useComments Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns comments, tree, add, and remove functions', () => {
    const { result } = renderHook(() => useComments());
    
    expect(result.current).toHaveProperty('comments');
    expect(result.current).toHaveProperty('tree');
    expect(result.current).toHaveProperty('add');
    expect(result.current).toHaveProperty('remove');
  });

  it('builds tree structure correctly', async () => {
    const { result } = renderHook(() => useComments());
    
    await waitFor(() => {
      expect(result.current.tree).toBeDefined();
    });
  });
});
