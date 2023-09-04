import { useEffect } from 'react'
import { useAuth } from 'hooks/useAuth'
import { Button, Input } from '@nextui-org/react'
import { useForm } from 'src/hooks/useForm'

interface UserData {
  email: string
  password: string
}

export const Login = () => {
  const { login, error } = useAuth()
  const { form, handleChange } = useForm<UserData>({ email: '', password: '' })

  useEffect(() => {
    if (error) alert(error)
  }, [error])

  const isDisabled = (
    !form.email ||
    !form.password
  )

  const handleLogin = () => {
    login(form.email, form.password)
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
          onChange={e => handleChange(e, 'email')}
          required />

        <Input
          className='mb-4'
          label="Contraseña"
          variant="bordered"
          placeholder="Ingresa tu contraseña"
          type="password"
          value={form.password}
          onChange={e => handleChange(e, 'password')} />

        <Button
          color='primary'
          className='w-full'
          isDisabled={isDisabled}
          onClick={handleLogin}>
          Ingresar
        </Button>
      </div>
    </div>
  )
}