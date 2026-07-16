import {useState} from "react";

interface Props {
    tabList: string[];
    onTabChange: (tab: string) => void;
    activeTab?: string;
}

export function TabButtons({
                               tabList,
                               onTabChange,
                               activeTab: propActiveTab
                           } : Props) {

    const [internalActiveTab, setInternalActiveTab] = useState<string>(tabList[0]);
    const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;

    const handleTabChange = (tab: string) => {
        setInternalActiveTab(tab);
        onTabChange(tab); // Виправили: тепер передаємо нове значення одразу
    }

    return (
        <div className="flex gap-2 mb-4">
            {tabList.map((tab) => (
                <button
                    key={tab} // Не забудь додати key при map, щоб не було warning у консолі
                    onClick={() => handleTabChange(tab)}
                    className={`custom-tab-btn px-4 py-2 rounded-xl transition-all duration-300 font-bold ${activeTab === tab
                        ? 'bg-[#FF2D7A] text-white shadow-lg shadow-[#FF2D7A]/20'
                        : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                    }`}
                >
                    {tab}
                </button>
            ))
            }
        </div>
    );
}