import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { Box } from '../components/Box/Box';
import { Launcher } from '../components/Launcher/Launcher';

function Services({ store: { applications } }) {
  const router = useRouter();
  const navtoService = (service) => {
    applications.setSelectedApp(service.id);
    router.push(`/${service.id}`);
  };
  return (
    <Launcher>
      <Box css={{ display: 'flex', flexWrap: 'wrap' }}>
        {applications.apps.map((service) => (
          <Box
            onClick={() => navtoService(service)}
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
export default inject('store')(observer(Services));
