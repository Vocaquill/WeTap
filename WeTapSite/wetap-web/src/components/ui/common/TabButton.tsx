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
        onTabChange(tab);
    }

    return (
        <div className="flex gap-2 mb-4">
            {tabList.map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`custom-tab-btn px-4 py-2 rounded-xl transition-all duration-300 font-bold ${activeTab === tab
                        ? 'bg-[#FF2D7A] text-white shadow-lg shadow-[#FF2D7A]/20'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
                    }`}
                >
                    {tab}
                </button>
            ))
            }
        </div>
    );
}