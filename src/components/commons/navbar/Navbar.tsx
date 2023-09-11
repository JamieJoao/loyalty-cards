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
import { FaChevronDown, FaList } from 'react-icons/fa'

import { useAuth } from "src/hooks/useAuth"
import { Outlet, useNavigate } from "react-router-dom"
import { useUser } from "src/context/UserContext"

import ProfileImage from 'assets/images/profile.jpg'
import { useEffect } from "react"
import { auth } from "src/fire/init"

export const NavbarCustom = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { user } = useUser()

  const menuItems = [
    {
      key: 'edit-user-form',
      text: 'Editar formulario de cliente',
      description: 'Edita el formulario que el cliente visualiza cuando aún no está registrado.',
      icon: <FaList className='text-blue-500' />,
      onClick: () => {
        navigate('user-form')
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
        position="static"
        isBordered>
        <NavbarBrand onClick={() => navigate('')}>
          {/* <FaLink /> */}
          <p className="font-bold text-inherit">Bocato</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-4" justify="center">
          <Dropdown>
            <NavbarItem className='hover:bg-transparent'>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  endContent={<FaChevronDown />}
                  radius="sm"
                  variant="light"
                >
                  Menú
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

          <NavbarItem isActive>

          </NavbarItem>
          <NavbarItem>

          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Jason Hughes"
                size="sm"
                src={ProfileImage}
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