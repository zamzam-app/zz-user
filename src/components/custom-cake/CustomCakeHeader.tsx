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
      <div className='w-full max-w-md pointer-events-auto'>
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
                  <span style={{ fontWeight: 'bold' }}>Upload Reference</span>
                ),
              },
              {
                key: 'custom',
                label: <span style={{ fontWeight: 'bold' }}>Build Custom</span>,
              },
            ]}
          />
        </ConfigProvider>
      </div>
    </header>
  );
};
