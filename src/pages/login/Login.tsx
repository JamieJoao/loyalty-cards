import { useEffect, useState } from 'react'
import { useAuth } from 'hooks/useAuth'
import { Button, Input, Spinner } from '@nextui-org/react'
import { useForm } from 'src/hooks/useForm'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'

interface UserData {
  email: string
  password: string
}

export const Login = () => {
  const { login, error } = useAuth()
  const { form, handleChange } = useForm<UserData>({ email: '', password: '' })
  const [showSpinners, setShowSpinners] = useState({ login: false })
  const [showPassword, setShowPassword] = useState(false)

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
    <div className='bc-login flex items-center'>
      <div className="bc-login__form flex flex-col gap-4">
        <p className='bc-login__form-title mb-4'>Bocato - Login</p>

        <Input
          classNames={{ inputWrapper: 'shadow-none' }}
          variant='flat'
          type="email"
          label="Correo"
          placeholder="Ejemplo: mi.correo@gmail.com"
          value={form.email}
          startContent={<FaEnvelope className='text-default-400' />}
          onChange={e => handleChange(e, 'email')}
          required
          isReadOnly={showSpinners.login} />

        <Input
          classNames={{ inputWrapper: 'shadow-none' }}
          label="Contraseña"
          variant="flat"
          placeholder="Ingresa tu contraseña"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          startContent={<FaLock className='text-default-400' />}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEye className="text-xl text-default-400 pointer-events-none" />
              ) : (
                <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          onChange={e => handleChange(e, 'password')}
          isReadOnly={showSpinners.login} />

        <Button
          color='primary'
          variant='shadow'
          isDisabled={isDisabled}
          isLoading={showSpinners.login}
          startContent={<FaUser />}
          onClick={handleLogin}>
          Ingresar
        </Button>
      </div>
    </div>
  )
}