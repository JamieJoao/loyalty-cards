import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Input,
} from '@nextui-org/react'

import { useAuth } from 'hooks/useAuth'
import { useForm } from 'src/hooks/useForm'

import {
  FaEnvelope,
  FaLock,
  FaUser
} from 'react-icons/fa'
import {
  FaEyeSlash,
  FaEye
} from 'react-icons/fa6'
import {
  FcGoogle,
} from 'react-icons/fc'
import BocatoImage from 'assets/images/logo-circle.png'

interface UserData {
  email: string
  password: string
}

export const Login = () => {
  const { login, loginWithGoogle, error } = useAuth()
  const { form, handleChange } = useForm<UserData>({ email: '', password: '' })
  const [showSpinners, setShowSpinners] = useState({ login: false })
  const [showPassword, setShowPassword] = useState(false)

  const isDisabled = (
    !form.email ||
    !form.password
  )

  const handleLogin = async () => {
    setShowSpinners({ login: true })
    await login(form.email, form.password)
    setShowSpinners({ login: false })
  }

  const handleLoginGoogle = async () => {
    setShowSpinners({ login: true })
    await loginWithGoogle()
    setShowSpinners({ login: false })
  }

  return (
    <div className="bc-login absolute w-full h-full bg-default-200">
      <div className="flex flex-col gap-4 h-full justify-center items-center">
        {/* <img
          className='absolute z-0 h-[100px] top-[12%]'
          src={BocatoImage} /> */}

        <Card classNames={{
          base: 'sm:min-w-[400px] bc-login__card'
        }}>
          <CardHeader
            className='flex-col mt-2'>
            <p className='text-2xl text-center font-bold'>¡Hola!</p>
            <p className='text-sm text-center'>Te hemos extrañado en Bocato.</p>
            <p className='text-sm text-center font-bold'>¡Bienvenido de vuelta!</p>
          </CardHeader>
          <CardBody
            className='gap-4'>
            <Input
              classNames={{ inputWrapper: 'shadow-none bg-transparent' }}
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
              classNames={{ inputWrapper: 'shadow-none bg-transparent' }}
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

            {error && <p className='text-danger text-sm'>{error}</p>}
            {/* <p className='text-danger text-sm'>
              FirebaseError: Firebase: Error (auth/user-not-found).
            </p> */}
          </CardBody>
          <CardFooter>
            <Button
              className='bc-login__submit'
              fullWidth
              variant='solid'
              isDisabled={isDisabled}
              isLoading={showSpinners.login}
              startContent={<FaUser />}
              onClick={handleLogin}>
              Ingresar
            </Button>
          </CardFooter>
        </Card>

        {/* <span className='text-center text-xs my-8'>O continúa con</span>

        <div className="flex justify-center">
          <Button
            color='primary'
            variant='light'
            isLoading={showSpinners.login}
            startContent={<FcGoogle className='text-4xl' />}
            isIconOnly
            onClick={handleLoginGoogle}>
          </Button>
        </div> */}
      </div>
    </div>
  )
}