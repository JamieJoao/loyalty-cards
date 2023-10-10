import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import { onAuthStateChanged } from 'firebase/auth'
import { FaChevronDown, FaFileExcel, FaList } from 'react-icons/fa'

import { useAuth } from "src/hooks/useAuth"
import { Outlet, useNavigate } from "react-router-dom"
import { useUser } from "src/context/UserContext"

import { useEffect } from "react"
import { auth } from "src/fire/init"
import { FaChartSimple } from "react-icons/fa6"

import ProfileImg from 'assets/images/profile.jpg'
import BocatoImg from 'assets/images/logo.png'
import { BiSolidCategoryAlt } from "react-icons/bi"

export const NavbarCustom = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { user } = useUser()

  const menuItems = [
    {
      key: 'product',
      text: 'Gestionar productos',
      description: 'Agrega, edita y elimina productos y categorías.',
      icon: <BiSolidCategoryAlt className='text-secondary-500 text-lg' />,
      onClick: () => {
        navigate('product')
      }
    },
    {
      key: 'edit-user-form',
      text: 'Editar formulario de cliente',
      description: 'Edita el formulario que el cliente visualiza cuando aún no está registrado.',
      icon: <FaList className='text-blue-500' />,
      onClick: () => {
        navigate('user-form')
      }
    },
    {
      key: 'purchases',
      text: 'Mis ventas',
      description: 'Visualiza tus ventas diarias, mensuales y totales, además descarga el reporte si lo necesitas.',
      icon: <FaFileExcel className='text-success-500' />,
      onClick: () => {
        navigate('purchases')
      }
    },
    {
      key: 'statistics',
      text: 'Gráficos',
      description: 'Revisa tus gráficos para identificar visualmente el avance de tu negocio.',
      icon: <FaChartSimple className='text-danger-500' />,
      onClick: () => {
        navigate('statistics')
      }
    },
  ]

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) {
        logout()
      }
    })
    return () => unsub()
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <Navbar
        className="border-none shadow-md"
        classNames={{
          wrapper: 'px-4'
        }}
        position="static"
        isBordered>
        <NavbarBrand onClick={() => navigate('')}>
          {/* <FaLink /> */}
          {/* <p className="font-bold text-inherit">Bocato</p> */}
          <Dropdown
            aria-labelledby="dropdown para menu"
          >
            <NavbarItem className='hover:bg-transparent'>
              <DropdownTrigger>
                {/* <p className="font-bold text-inherit">Bocato</p> */}
                <Button
                  variant="light">
                  <img
                    src={BocatoImg}
                    className="h-6" />
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="ACME features"
              className="w-[340px]"
              itemClasses={{
                base: "gap-4",
              }}
              disabledKeys={['generate-link']}
            >
              {menuItems.map(obj => (
                <DropdownItem
                  key={obj.key}
                  description={obj.description}
                  startContent={obj.icon}
                  onClick={obj.onClick}
                >
                  {obj.text}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">

          <NavbarItem isActive>
          </NavbarItem>
          <NavbarItem>

          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform rounded"
                color="primary"
                name="Jason Hughes"
                src={ProfileImg}
                alt="imagen de foto de perfil"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Acciones de perfil"
              variant="flat"
              disabledKeys={['settings']}>
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Registrado como</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">Configuraciones</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Salir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <div className="max-w-[1024px] m-auto p-4 lg:p-0 lg:pt-4">
        <Outlet />
      </div>
    </>
  )
}