import { Token } from 'bumblebee-common'
import { AppRights } from '../consts'

export const checkWritePermissions = ({ rights }: Token) =>
  rights ? rights.includes(AppRights.write) : false

export const checkReadPermissions = ({ rights }: Token) =>
  rights ? rights.includes(AppRights.read) : false
