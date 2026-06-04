import {useState} from "react";

interface Props {
    tabList: string[];
    onTabChange: (tab: string) => void;
}

export function TabButtons({
                              tabList,
                              onTabChange
                          } : Props) {

    const [activeTab, setActiveTab] = useState<string>(tabList[0]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        onTabChange(activeTab);
    }

    return (
        <div className="flex gap-2 mb-4">
            {tabList.map((tab) => (
                <button
                    onClick={() => handleTabChange(tab)}
                    className={`custom-tab-btn ${activeTab === tab
                        ? 'bg-[#FF2D7A] text-white shadow-lg shadow-[#FF2D7A]/20'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                >
                    {tab}
                </button>
                ))
            }
        </div>
    );
}