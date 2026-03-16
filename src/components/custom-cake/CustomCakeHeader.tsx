import { Tabs, ConfigProvider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface CustomCakeHeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

export const CustomCakeHeader = ({
  activeTab,
  onTabChange,
}: CustomCakeHeaderProps) => {
  const router = useRouter();

  return (
    <header className='relative flex items-center justify-center px-6 py-4 bg-white border-b border-gray-100'>
      {/* Back Button */}
      <button
        onClick={() => router.push('/cake-library')}
        className='absolute left-4 z-50 p-2 rounded-full hover:bg-gray-100 transition'
      >
        <ArrowLeftOutlined className='text-xl hover:text-[#751414]' />
      </button>

      {/* Tabs */}
      <div className='w-full max-w-md pointer-events-auto custom-cake-tabs-container'>
        <style>{`
          .custom-cake-tabs-container .ant-tabs-card .ant-tabs-tab {
            border-radius: 12px 12px 0 0 !important;
            transition: all 0.3s ease;
          }
          .custom-cake-tabs-container .ant-tabs-card .ant-tabs-tab-active {
            background-color: #7A2D2A !important;
            border-color: #7A2D2A !important;
          }
          .custom-cake-tabs-container .ant-tabs-card .ant-tabs-tab:not(.ant-tabs-tab-active) {
            background-color: #ffffff !important;
          }
        `}</style>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#7A2D2A',
              fontWeightStrong: 600,
            },
            components: {
              Tabs: {
                itemActiveColor: '#7A2D2A',
                itemHoverColor: '#923a3a',
                itemSelectedColor: '#7A2D2A',
                inkBarColor: '#7A2D2A',
                titleFontSize: 16,
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={onTabChange}
            centered
            type='card'
            size='middle'
            tabBarStyle={{ marginBottom: 0 }}
            items={[
              {
                key: 'upload',
                label: (
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: activeTab === 'upload' ? '#e3c08d' : '#7A2D2A',
                    }}
                  >
                    Upload Cake
                  </span>
                ),
              },
              {
                key: 'custom',
                label: (
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: activeTab === 'custom' ? '#e3c08d' : '#7A2D2A',
                    }}
                  >
                    Cake Studio
                  </span>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </div>
    </header>
  );
};
