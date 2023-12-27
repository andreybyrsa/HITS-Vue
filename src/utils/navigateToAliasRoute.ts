import { RouteRecordRaw } from 'vue-router'
import router from '../router/index'

function navigateToAliasRoute(
  nestedRouteName: string,
  aliasPath: string,
  aliasRoute: RouteRecordRaw,
) {
  router.addRoute(nestedRouteName, aliasRoute)
  router.push({ path: aliasPath })
}

export default navigateToAliasRoute
