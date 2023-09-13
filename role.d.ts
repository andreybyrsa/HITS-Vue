// import RolesTypes from '@Domain/Roles'
import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta {
    roles?: string[]
    isAdmin?: boolean
    isInitiator?: boolean
    isProjectOffice?: boolean
    isExpert?: boolean
  }
}
