import { useState } from 'react';
import type {IMovieCommentItem} from "../../types/movie.ts";
import {useAddCommentMutation} from "../../services/api/apiMovies.ts";

interface Props {
    movieId: number;
    comments: IMovieCommentItem[];
}

export function MovieComments({ movieId, comments }: Props) {
    const [text, setText] = useState('');
    const [addComment, { isLoading }] = useAddCommentMutation();

    const handleSubmit = async () => {
        if (!text.trim()) return;

        await addComment({
            movieId,
            text,
        });

        setText('');
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-red-600 pl-4">
                Коментарі ({comments.length})
            </h3>

            <div className="space-y-3">
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишіть коментар..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-red-600"
            rows={3}
        />

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-bold disabled:opacity-50"
                >
                    Надіслати
                </button>
            </div>

            <div className="space-y-4">
                {comments.length === 0 && (
                    <p className="text-zinc-500">Коментарів поки немає</p>
                )}

                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4"
                    >
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-white">
                                {c.userName}
                            </span>
                            <span className="text-zinc-500">
                                {new Date(c.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-zinc-300">{c.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
