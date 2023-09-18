import { FC, Key } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@nextui-org/react"
import { FaEdit, FaEllipsisV } from "react-icons/fa"

interface MenuItem {
  key: Key
  label: string
  icon: any
}

interface ActionButtonProps {
  onAction: (key: Key, item: any) => void
  item: any
  menuItems: MenuItem[]
}

export const ActionButton: FC<ActionButtonProps> = ({
  onAction,
  item,
  menuItems,
}) => {
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <FaEllipsisV className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant='faded'
          aria-labelledby='Menu de opciones'
          onAction={key => onAction(key, item)}>
          {menuItems.map(({ key, icon: Icon, label }) => (
            <DropdownItem
              key={key}
              startContent={<Icon className='text-default-400' />}>
              {label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}