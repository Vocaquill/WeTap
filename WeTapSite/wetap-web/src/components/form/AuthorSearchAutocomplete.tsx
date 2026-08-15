import { useState, useEffect, useRef } from 'react';
import { User, X, Search, Check, Loader2 } from 'lucide-react';
import { useSearchChannelsQuery, useGetByQuery } from '../../services/api/apiChannels';
import { APP_ENV } from '../../env';

interface AuthorSearchAutocompleteProps {
    channelId?: number;
    onChange: (channelId: number | undefined) => void;
    wrapperClassName?: string;
}

export function AuthorSearchAutocomplete({
    channelId,
    onChange,
    wrapperClassName = '',
}: AuthorSearchAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: selectedChannel } = useGetByQuery(
        { id: channelId! },
        { skip: !channelId }
    );

    useEffect(() => {
        if (channelId && selectedChannel) {
            setSearchQuery(selectedChannel.name);
        } else if (!channelId) {
            setSearchQuery('');
        }
    }, [channelId, selectedChannel]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: channelsData, isFetching } = useSearchChannelsQuery(
        { q: debouncedQuery, itemPerPage: 6, page: 1 },
        { skip: !isOpen }
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectChannel = (id: number, name: string) => {
        onChange(id);
        setSearchQuery(name);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSearchQuery('');
        onChange(undefined);
        setIsOpen(false);
    };

    const channelsList = channelsData?.items || [];

    return (
        <div className={`relative flex flex-col ${wrapperClassName}`} ref={containerRef}>
            <div className="relative w-full">
                <div
                    className={`flex items-center gap-2 w-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/40 rounded-full py-1.5 pl-3.5 pr-3 text-sm font-medium transition-all ${
                        isOpen ? 'ring-1 ring-zinc-600 bg-zinc-800 border-zinc-600' : ''
                    }`}
                >
                    <User size={15} className="shrink-0 text-zinc-400" />
                    
                    <input
                        type="text"
                        placeholder="Автор: Всі"
                        value={searchQuery}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                            if (channelId && e.target.value !== selectedChannel?.name) {
                                onChange(undefined);
                            }
                        }}
                        className="w-full bg-transparent text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none truncate"
                    />

                    {isFetching ? (
                        <Loader2 size={14} className="shrink-0 text-zinc-400 animate-spin" />
                    ) : (channelId || searchQuery) ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="shrink-0 p-0.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-700/50 rounded-full transition-colors"
                            title="Очистити автора"
                        >
                            <X size={14} />
                        </button>
                    ) : (
                        <Search size={14} className="shrink-0 text-zinc-500 pointer-events-none" />
                    )}
                </div>

                {isOpen && (
                    <div
                        className="absolute z-[200] mt-2 w-full min-w-[220px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 left-0"
                        role="listbox"
                    >
                        <div className="h-px w-full bg-gradient-to-r from-rose-500/60 via-purple-500/40 to-blue-500/40" />

                        <div className="py-1.5 max-h-64 overflow-y-auto">
                            {channelsList.length > 0 ? (
                                channelsList.map((channel) => {
                                    const isSelected = channel.id === channelId;
                                    return (
                                        <button
                                            key={channel.id}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleSelectChannel(channel.id, channel.name)}
                                            className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                                                isSelected
                                                    ? 'text-rose-400 bg-rose-500/10'
                                                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                                                    <img
                                                        src={
                                                            channel.avatarImage
                                                                ? `${APP_ENV.IMAGES_50_URL}${channel.avatarImage}`
                                                                : '/images/user/default.jpg'
                                                        }
                                                        alt={channel.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="truncate text-xs font-bold text-zinc-100">
                                                        {channel.name}
                                                    </span>
                                                    {channel.nickName && (
                                                        <span className="truncate text-[11px] text-zinc-400">
                                                            @{channel.nickName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <Check size={14} className="shrink-0 text-rose-500" />
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-xs text-zinc-400 text-center">
                                    {isFetching ? 'Пошук каналів...' : 'Каналів не знайдено'}
                                </div>
                            )}
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-rose-500/20" />
                    </div>
                )}
            </div>
        </div>
    );
}
