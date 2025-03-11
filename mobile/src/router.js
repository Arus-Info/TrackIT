import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'
import { createResource } from 'frappe-ui'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path : '/workit',
    name : 'WorkIT',
    component : () => import('@/pages/WorkIT.vue'),
  },
  {
    path : '/projectit',
    name : 'ProjectIT',
    component : () => import('@/pages/ProjectIT.vue'),
  },
  {
    path : '/projectit/edit-instructions/:project_name',
    name : 'EditInstructions',
    component : () => import('@/pages/EditInstructions.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/trackit'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await userResource.fetch()
  } catch (error) {
    isLoggedIn = false
  }
  if (to.name === 'Login' && isLoggedIn) {
    next({ name: "Home" })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } 
  else if(to.name === 'Login' && !isLoggedIn){
    next()
  }
  else {
    const mobileModules = createResource({
      type: "POST",
      url: "trackit.api.get_modules_for_router",
      makeParams() {
        return {
          user_id: userResource.data
        }
      },
      onSuccess(data) {
        let allowed = false;
        for (let d of data){
          if(to.path.match(d)){
            allowed =  true;
            break;
          }
        }
        if(allowed === true){
            next()
        }
        else{
          next({name : "Home"})
        }
      },
    })

    await mobileModules.fetch()
  }
})

// router.beforeEach(async (to, from, next) => {
//   let isLoggedIn = session.isLoggedIn
//   try {
//     await userResource.promise
//   } catch (error) {
//     isLoggedIn = false
//   }

//   if (to.name === 'Login' && isLoggedIn) {
//     next({ name: 'Home' })
//   } else if (to.name !== 'Login' && !isLoggedIn) {
//     next({ name: 'Login' })
//   } else {
//     next()
//   }
// })

export default router
