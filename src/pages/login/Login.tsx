import { useEffect, useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { Button, Input, Spinner } from '@nextui-org/react'
import { useForm } from 'src/hooks/useForm'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'

interface UserData {
  email: string
  password: string
}

export const Login = () => {
  const { login, error } = useAuth()
  const { form, handleChange } = useForm<UserData>({ email: '', password: '' })
  const [showSpinners, setShowSpinners] = useState({ login: false })

  useEffect(() => {
    if (error) alert(error)
  }, [error])

  const isDisabled = (
    !form.email ||
    !form.password
  )

  const handleLogin = async () => {
    setShowSpinners({ login: true })
    await login(form.email, form.password)
    setShowSpinners({ login: false })
  }

  return (
    <div className='bc-login'>
      <div className="bc-login__form">
        <p className='bc-login__form-title mb-4'>Bocato - Login</p>

        <Input
          className='mb-4'
          variant='bordered'
          type="email"
          label="Correo"
          placeholder="Ejemplo: mi.correo@gmail.com"
          value={form.email}
          startContent={<FaEnvelope className='text-default-400' />}
          onChange={e => handleChange(e, 'email')}
          required
          isReadOnly={showSpinners.login} />

        <Input
          className='mb-4'
          label="Contraseña"
          variant="bordered"
          placeholder="Ingresa tu contraseña"
          type="password"
          value={form.password}
          startContent={<FaLock className='text-default-400' />}
          onChange={e => handleChange(e, 'password')}
          isReadOnly={showSpinners.login} />

        <Button
          color='primary'
          className='w-full'
          variant='bordered'
          isDisabled={isDisabled}
          isLoading={showSpinners.login}
          spinner={<Spinner size='sm' />}
          startContent={<FaUser />}
          onClick={handleLogin}>
          Ingresar
        </Button>
      </div>
    </div>
  )
}