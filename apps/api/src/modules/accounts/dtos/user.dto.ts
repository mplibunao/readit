import { id } from '@readit/utils'
import { z } from 'zod'

export * as UserDto from './user.dto'

export const findByIdInput = z.object({ id })
