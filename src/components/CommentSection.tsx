import { useState } from "react";
import { useComments, useAddComment } from "../hooks/useComments";

interface CommentsSectionProps {
  descriptorId: number;
}

export default function CommentsSection({ descriptorId }: CommentsSectionProps) {
  const { data: comments, isLoading } = useComments(descriptorId);
  const addComment = useAddComment(descriptorId);
  const [newComment, setNewComment] = useState("");

  if (isLoading) return <p>Loading comments...</p>;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ content: newComment });
    setNewComment("");
  };

  const handleAddReply = (parentId: number, replyContent: string) => {
    if (!replyContent.trim()) return;
    addComment.mutate({ content: replyContent, parent_id: parentId });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Comments</h2>

      {/* New comment box */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!newComment.trim()}
          style={{ 
                  backgroundColor: newComment.trim() ? '#e65039' : '#BDC3C7', 
                  color: 'white',
                                      borderColor: newComment.trim() ? '#e65039' : '#BDC3C7'
                }}
        >
          Post
        </button>
      </div>

      {/* Comment list */}
      <div className="space-y-4">
        {comments?.map((comment: any) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply }: any) {
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Format timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // e.g., "9/20/2025, 3:45 PM"
  };

  return (
    <div className="border-b pb-2">
      {/* Comment header */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-semibold">{comment.user.username}</span>
        <span className="text-gray-400">• {formatDate(comment.created_at)}</span>
      </div>

      {/* Content */}
      <p className="mt-1">{comment.content}</p>

      {/* Reply toggle */}
      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-sm text-blue-500 hover:underline mt-1"
      >
        Reply
      </button>

      {/* Reply input */}
      {showReplyBox && (
        <div className="ml-4 mt-2 flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={() => {
              onReply(comment.id, reply);
              setReply("");
              setShowReplyBox(false);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Reply
          </button>
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {comment.replies.map((reply: any) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold">{reply.user.username}</span>
                <span className="text-gray-400">• {formatDate(reply.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

