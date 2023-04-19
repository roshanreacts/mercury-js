import React, { useEffect } from 'react';
import { Box } from '../components/Box/Box';
import useStore, { useServiceStore } from '../store';
import { Launcher } from '../components/Launcher/Launcher';
import { useRouter } from 'next/router';

export default function Services() {
  const { loading, loadingServices, services, fetchServices, setService } =
    useStore(useServiceStore, (state) => state);
  useEffect(() => {
    if (fetchServices) {
      fetchServices();
    }
  }, [fetchServices]);
  const router = useRouter();
  const redirect = (service) => {
    console.log('service', fetchServices, setService);
    setService(service.slug);
    router.push(`${service.slug}`);
  };
  if (loading || loadingServices) return <div></div>;

  return (
    <Launcher>
      <Box css={{ display: 'flex', flexWrap: 'wrap' }}>
        {services.map((service) => (
          <Box
            onClick={() => redirect(service)}
            key={service.id}
            p={1}
            css={{ width: '33.33%' }}
          >
            <img src={service.logo} width={50} />
            <Box>{service.name}</Box>
          </Box>
        ))}
      </Box>
    </Launcher>
  );
}

// flex to show
