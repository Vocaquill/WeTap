import { motion } from 'framer-motion';
import {
  Star,
  Calendar,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toYoutubeEmbed } from '../utils/toYoutubeEmbed.ts';
import PageTransition from '../components/PageTransition';
import { useGetBySlugQuery, useReactMovieMutation } from '../services/api/apiMovies';
import { MoviePlayer } from "../components/movie/MoviePlayer.tsx";
import { APP_ENV } from "../env";
import { MovieComments } from "../components/movie/MovieComments.tsx";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

function MoviePage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const { data: movie, isLoading } = useGetBySlugQuery(
      { slug: slug! },
      { skip: !slug }
  );

  const [reactMovie] = useReactMovieMutation();

  if (isLoading) return <LoadingOverlay />;
  if (!movie) return null;

  const releaseYear = new Date(movie.releaseDate).getFullYear();

  const handleReaction = async (isLike: boolean) => {
    try {
      await reactMovie({ movieId: movie.id, isLike }).unwrap();
    } catch (error) {
      console.error('Помилка при відправці реакції', error);
    }
  };

  return (
      <PageTransition>
        <div className="min-h-screen bg-zinc-950 text-white pb-20">

          <div className="relative h-[60vh] overflow-hidden">
            <img
                src={
                  movie.image
                      ? APP_ENV.IMAGES_1200_URL + movie.image
                      : '/placeholder.jpg'
                }
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                alt={movie.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

            <div className="relative z-10 p-6">
              <button
                  onClick={() => navigate(-1)}
                  className="p-3 bg-zinc-900/60 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
              <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4 max-w-4xl"
              >
                <div className="flex gap-2 flex-wrap">
                  {movie.genres.map((g) => (
                      <span
                          key={g.id}
                          className="px-3 py-1 text-xs font-bold rounded-full border border-red-600/40 text-red-500 bg-red-600/10"
                      >
                  {g.name}
                </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase italic">
                  {movie.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-zinc-400">
                  {movie.imdbRating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-white font-bold">{movie.imdbRating}</span>
                      </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {releaseYear}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleReaction(true)}
                        className="flex items-center gap-2 hover:text-green-400 transition-colors bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-zinc-800"
                    >
                      <ThumbsUp size={16} />
                      <span className="font-bold text-white">{movie.likesCount}</span>
                    </button>
                    <button
                        onClick={() => handleReaction(false)}
                        className="flex items-center gap-2 hover:text-red-400 transition-colors bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-zinc-800"
                    >
                      <ThumbsDown size={16} />
                      <span className="font-bold text-white">{movie.dislikesCount}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-20">
            <div className="lg:col-span-2 space-y-10">

              {movie.video && (
                  <MoviePlayer src={APP_ENV.VIDEO_URL + movie.video} />
              )}

              {movie.description && (
                  <div>
                    <h2 className="text-xl font-bold border-l-4 border-red-600 pl-4 mb-3">
                      Про фільм
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      {movie.description}
                    </p>
                  </div>
              )}

              <MovieComments movieId={movie.id} comments={movie.comments} />
            </div>

            <div className="space-y-8">
              {movie.trailerUrl && (
                  <div>
                    <h3 className="font-bold uppercase text-sm mb-3 text-zinc-500 tracking-wider">Трейлер</h3>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                      <iframe
                          src={toYoutubeEmbed(movie.trailerUrl) ?? undefined}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                      />
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
  );
}

export default MoviePage;