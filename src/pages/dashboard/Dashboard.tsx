import { useEffect } from 'react'
import {
  Badge,
  Button,
  Tab,
  Tabs,
} from "@nextui-org/react";

import { useClient } from 'hooks/useClient'
import { useEnviroment } from 'src/hooks/useEnviroment';
import { TabCurrentsCustomers } from './TabCurrentsCustomers';
import { TabPendingCustomers } from './TabPendingCustomers';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate()
  const { clients, getClients, updateClient, deleteClient, loading } = useClient()
  const { enviroments, getEnviroments } = useEnviroment()

  useEffect(() => {
    const unsubscribe = getClients()
    const unsubscribeEnv = getEnviroments()

    return () => {
      unsubscribe()
      unsubscribeEnv()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className='bc-dashboard'>
      <Tabs
        fullWidth
        aria-label='Usuarios'
        classNames={{
          base: 'pb-1'
        }}>
        <Tab
          key='current-users'
          title='Registrados'>
          <TabCurrentsCustomers
            clients={clients}
            updateClient={updateClient}
            enviroments={enviroments}
            loadingClients={loading}
            deleteClient={deleteClient} />
        </Tab>
        <Tab key='pending-users' title='Pendientes'>
          <TabPendingCustomers
            clients={clients}
            loadingLinks={loading}
            deleteClient={deleteClient} />
        </Tab>
      </Tabs>

      <Button
        className='fixed bottom-4 right-[50%] translate-x-[50%] z-10 rounded-full'
        size='lg'
        isIconOnly
        variant="shadow"
        color="secondary"
        onClick={() => {
          navigate('generate-link')
        }}>
        <FaLink />
      </Button>
    </div >
  )
}
