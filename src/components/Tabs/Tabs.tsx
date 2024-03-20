import React, { useState } from 'react';

interface Tab {
  id: number;
  title: string;
  content: JSX.Element | string;
}

interface TabComponentProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabComponentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

  return (
    <div>
      <nav className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            className={`px-4 py-2 text-sm font-medium leading-5 text-gray-700 rounded-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ${
          activeTab === tab.id ? 'bg-gray-200' : 'text-blue-600 hover:bg-gray-100'
          }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </nav>
      <div className="p-2 mt-2">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div className="text-sm text-gray-500" key={tab.id}>
                {tab.content}
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default Tabs;
