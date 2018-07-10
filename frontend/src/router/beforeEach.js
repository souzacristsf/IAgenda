import store from '../store'

const needAuth = auth => auth === true

const beforeEach = (to, from, next) => {
  const auth = to.meta.requiresAuth
  /**
  * Clears all global feedback message
  * that might be visible
  */

  /**
   * If route doesn't require authentication be normally accessed.
   */
  if (!needAuth(auth)) {
    next()
    return 0 // return to prevent the code from continuing in its flow
    // With this flow `else` or `else if` is not necessary
  }

  /**
   * Otherwise  if authentication is required login.
   */
  store.dispatch('checkUserToken')
    .then(() => {
      // There is a token and it is valid
      next() // can access the route
    })
    .catch(() => {
      console.log('Não tem Token')
      // No token, or it is invalid
      next({ name: 'Signin' }) // redirect to login
    })
}

export default beforeEach
