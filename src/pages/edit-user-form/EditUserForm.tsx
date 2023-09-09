import { useEffect } from 'react'
import { useEnviroment } from "src/hooks/useEnviroment"

export const EditUserForm = () => {
  const { enviroments, getEnviroments } = useEnviroment()

  console.log(enviroments)

  useEffect(() => {
    const sub = getEnviroments()

    return () => sub()
  }, [])

  return (
    <div className="bc-edit-user-form">
      <h1 className="text-5xl">Formulario de cliente</h1>
      <p className="text-default-400">En progreso...</p>
    </div>
  )
}
