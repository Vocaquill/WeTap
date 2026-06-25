import React, { useState } from "react";
import {
    MessageSquare,
    Send,
    Edit2,
    Trash2,
    MessageCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../form/Button";
import { Pagination } from "../ui/common/Pagination";
import DeleteModal from "../modal/common/DeleteModal";
import {
    useGetVideoCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useLazyGetCommentRepliesQuery,
} from "../../services/api/apiComments";
import type { ICommentItemResponse } from "../../types/Comment/ICommentItemResponse";
import { APP_ENV } from "../../env";

interface CommentsSectionProps {
    videoId: number;
    currentUser: {
        id?: number;
        name: string;
        image: string;
    } | null;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ videoId, currentUser }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [commentText, setCommentText] = useState("");

    // Load main video comments (paginated)
    const { data: commentsData, isLoading } = useGetVideoCommentsQuery({
        videoId,
        params: { page: currentPage, itemPerPage: 10 },
    });

    const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await createComment({
                videoId,
                content: commentText.trim(),
                parentId: null,
            }).unwrap();
            setCommentText("");
            // Reset to first page to see the new comment
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    return (
        <div className="mt-8 border-t border-zinc-800 pt-6">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-[#FF2D7A]" size={22} />
                <h3 className="text-lg font-bold">
                    Коментарі ({commentsData?.pagination.totalCount ?? 0})
                </h3>
            </div>

            {/* Comment Form */}
            {currentUser ? (
                <form onSubmit={handleCreateComment} className="flex gap-3 items-start mb-8">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                        <img
                            src={currentUser.image ? `${APP_ENV.IMAGES_200_URL}${currentUser.image}` : "/images/user/default.jpg"}
                            alt={currentUser.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Залишити коментар..."
                            rows={2}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF2D7A] transition-all resize-none pr-12"
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !commentText.trim()}
                            className="absolute right-3 bottom-3 text-zinc-400 hover:text-[#FF2D7A] disabled:text-zinc-700 disabled:hover:text-zinc-700 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-zinc-900/50 border border-zinc-850 rounded-xl p-4 text-center mb-8">
                    <p className="text-sm text-zinc-400">
                        Будь ласка,{" "}
                        <Link to="/login" className="text-[#FF2D7A] font-bold hover:underline">
                            увійдіть
                        </Link>{" "}
                        або{" "}
                        <Link to="/register" className="text-[#FF2D7A] font-bold hover:underline">
                            зареєструйтеся
                        </Link>
                        , щоб залишати коментарі.
                    </p>
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-10 h-10 bg-zinc-800 rounded-full" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-zinc-800 rounded w-1/4" />
                                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : commentsData?.items.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-6">Коментарів поки немає. Будьте першим!</p>
            ) : (
                <div className="space-y-6 mb-8">
                    {commentsData?.items.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            videoId={videoId}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}

            {/* Pagination for main comments */}
            {commentsData && commentsData.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={commentsData.pagination.totalPages}
                        onChange={(page) => {
                            setCurrentPage(page);
                            // Scroll to comments header smoothly
                            document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                    />
                </div>
            )}
        </div>
    );
};

interface CommentItemProps {
    comment: ICommentItemResponse;
    videoId: number;
    currentUser: {
        id?: number;
        name: string;
        image: string;
    } | null;
    onModified?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, videoId, currentUser, onModified }) => {
    const isOwner = currentUser && currentUser.id === comment.userId;
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Replies state
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<ICommentItemResponse[]>([]);
    const [repliesPage, setRepliesPage] = useState(1);
    const [hasMoreReplies, setHasMoreReplies] = useState(false);

    // Queries & Mutations
    const [triggerGetReplies, { isFetching: isFetchingReplies }] = useLazyGetCommentRepliesQuery();
    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [createComment, { isLoading: isCreatingReply }] = useCreateCommentMutation();

    const fetchReplies = async (page: number) => {
        try {
            const res = await triggerGetReplies({
                parentId: comment.id,
                params: { page, itemPerPage: 5 },
            }).unwrap();

            if (page === 1) {
                setReplies(res.items);
            } else {
                setReplies((prev) => [...prev, ...res.items]);
            }

            setRepliesPage(page);
            setHasMoreReplies(res.pagination.currentPage < res.pagination.totalPages);
        } catch (error) {
            console.error("Failed to load replies", error);
        }
    };

    const handleToggleReplies = () => {
        if (!showReplies) {
            setShowReplies(true);
            if (replies.length === 0) {
                fetchReplies(1);
            }
        } else {
            setShowReplies(false);
        }
    };

    const handleShowMoreReplies = () => {
        fetchReplies(repliesPage + 1);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            await updateComment({ id: comment.id, content: editText.trim() }).unwrap();
            setIsEditing(false);
            // Notify parent to refresh its local replies list
            onModified?.();
        } catch (error) {
            console.error("Failed to edit comment", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(comment.id).unwrap();
            setIsDeleteModalOpen(false);
            // Notify parent to refresh its local replies list
            onModified?.();
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const newReply = await createComment({
                videoId,
                content: replyText.trim(),
                parentId: comment.id,
            }).unwrap();

            setReplyText("");
            setIsReplying(false);
            setShowReplies(true);

            // Fetch first page again or append reply locally
            // We append the new reply directly to the end of the replies list if we already loaded some
            setReplies((prev) => [...prev, newReply]);
        } catch (error) {
            console.error("Failed to reply", error);
        }
    };

    // Format date string beautifully (simple reader-friendly format)
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex gap-3 group/item">
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                <img
                    src={comment.userImage ? `${APP_ENV.IMAGES_200_URL}${comment.userImage}` : "/images/user/default.jpg"}
                    alt={comment.userName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Comment Body */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold text-zinc-100">{comment.userName}</span>
                    <span className="text-xs text-zinc-500">{formatDate(comment.dateCreated)}</span>
                    {comment.isEdited && (
                        <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded font-medium">Редаговано</span>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleEdit} className="mt-2 mb-3">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF2D7A] resize-none"
                            rows={2}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(comment.content);
                                }}
                            >
                                Скасувати
                            </Button>
                            <Button size="sm" type="submit" disabled={isUpdating || !editText.trim()}>
                                Зберегти
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                        {comment.content}
                    </p>
                )}

                {/* Comment Actions */}
                {!isEditing && (
                    <div className="flex items-center gap-4 mt-2">
                        {currentUser && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#FF2D7A] transition-colors"
                            >
                                <MessageCircle size={14} />
                                <span>Відповісти</span>
                            </button>
                        )}

                        {isOwner && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                                >
                                    <Edit2 size={12} />
                                    <span>Редагувати</span>
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={isDeleting}
                                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={12} />
                                    <span>Видалити</span>
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Reply Form */}
                {isReplying && (
                    <form onSubmit={handleReply} className="flex gap-3 items-start mt-4 mb-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                            <img
                                src={currentUser?.image ? `${APP_ENV.IMAGES_200_URL}${currentUser.image}` : "/images/user/default.jpg"}
                                alt={currentUser?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Написати відповідь..."
                                rows={1}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF2D7A] transition-all resize-none pr-12"
                            />
                            <button
                                type="submit"
                                disabled={isCreatingReply || !replyText.trim()}
                                className="absolute right-3 bottom-2 text-zinc-400 hover:text-[#FF2D7A] disabled:text-zinc-700 disabled:hover:text-zinc-700 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 mt-2"
                        >
                            Скасувати
                        </button>
                    </form>
                )}

                {/* Show/Hide Replies Toggle */}
                {comment.repliesCount > 0 && (
                    <button
                        onClick={handleToggleReplies}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#FF2D7A] hover:underline mt-3"
                    >
                        {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        <span>
                            {showReplies ? "Сховати відповіді" : `Показати відповіді (${comment.repliesCount})`}
                        </span>
                    </button>
                )}

                {/* Replies Container */}
                {showReplies && (
                    <div className="mt-4 pl-4 border-l-2 border-zinc-800 space-y-4">
                        {replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                videoId={videoId}
                                currentUser={currentUser}
                                onModified={() => fetchReplies(1)}
                            />
                        ))}

                        {isFetchingReplies && replies.length === 0 && (
                            <div className="text-xs text-zinc-500 animate-pulse">Завантаження відповідей...</div>
                        )}

                        {hasMoreReplies && (
                            <button
                                onClick={handleShowMoreReplies}
                                disabled={isFetchingReplies}
                                className="text-xs font-bold text-zinc-400 hover:text-white transition-colors py-1 flex items-center gap-1"
                            >
                                {isFetchingReplies ? "Завантаження..." : "Подивитися більше відповідей"}
                                <ChevronDown size={12} className={isFetchingReplies ? "animate-bounce" : ""} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Видалити коментар?"
                description="Цю дію не можна скасувати. Коментар буде видалено назавжди."
                isLoading={isDeleting}
            />
        </div>
    );
};
