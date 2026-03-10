import { ConfigProvider } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import { Download } from 'lucide-react';
import Button from '@/components/common/Button';

interface CustomCakeActionsProps {
  onDownload: () => void;
  onOrderNow: () => void;
}

export const CustomCakeActions = ({
  onDownload,
  onOrderNow,
}: CustomCakeActionsProps) => {
  return (
    <section className='py-12'>
      <div className='container mx-auto max-w-4xl flex justify-center items-center gap-4'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#7A2D2A',
              fontWeightStrong: 600,
            },
          }}
        >
          <Button
            size='large'
            icon={<Download size={18} />}
            onClick={onDownload}
          >
            Download Design
          </Button>
        </ConfigProvider>

        <div className='flex-1 md:flex-none flex gap-4 w-full md:w-auto'>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#25D366',
                fontWeightStrong: 600,
              },
            }}
          >
            <Button onClick={onOrderNow}>
              <WhatsAppOutlined size={20} /> Order Now
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </section>
  );
};
