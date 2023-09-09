import { useEffect } from 'react'
import {
  Tab,
  Tabs,
} from "@nextui-org/react";

import { useClient } from 'hooks/useClient'
import { useEnviroment } from 'src/hooks/useEnviroment';
import { TabCurrentsCustomers } from './TabCurrentsCustomers';
import { TabPendingCustomers } from './TabPendingCustomers';
import { ButtonGenerateLink } from 'src/components';

export const Dashboard = () => {
  const { clients, getClients, updateClient, addPossibleCustomer, deleteClient, loading: loadingClients } = useClient()
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
    <div className='bc-dashboard '>
      <Tabs
        fullWidth
        aria-label='Usuarios'>
        <Tab key='current-users' title='Registrados'>
          <TabCurrentsCustomers
            clients={clients}
            updateClient={updateClient}
            enviroments={enviroments}
            loadingClients={loadingClients}
            deleteClient={deleteClient} />
        </Tab>
        <Tab key='pending-users' title='Pendientes'>
          <TabPendingCustomers
            clients={clients}
            loadingLinks={loadingClients}
            deleteClient={deleteClient} />
        </Tab>
      </Tabs>

      <ButtonGenerateLink />
    </div >
  )
}
