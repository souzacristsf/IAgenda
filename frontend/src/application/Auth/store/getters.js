// export const isLogged = (state) => state.token !== ''
// import { isEmpty } from 'lodash'

export const getAuthUsername = (state) => state.username

export const getAuthFullname = (state) => state.fullname

export const getAuthEmail = (state) => {
  console.log('Chamou Getters')
  return state.email
}

export const getAuthToken = (state) => state.token

// export const isLogged = (state) => !isEmpty(state.toke)

// export const currentUser = ({ user }) => user
