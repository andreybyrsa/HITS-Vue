import { RouteRecordRaw } from 'vue-router'
import router from '../router/index'

function navigateToAliasRoute(aliasPath: string, aliasRoute: RouteRecordRaw) {
  const nestedRouteName = router.currentRoute.value.name

  if (nestedRouteName) {
    router.addRoute(nestedRouteName, aliasRoute)
    router.push({ path: aliasPath })
  }
}

export default navigateToAliasRoute
