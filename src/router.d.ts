import 'vue-router'

import RolesTypes from '@Domain/Roles'

declare module 'vue-router' {
  export interface RouteMeta {
    roles?: RolesTypes[]
  }
}
