// export const isLogged = (state) => state.token !== ''
// import { isEmpty } from 'lodash'

export const getAuthUsername = (state) => state.user.username

export const getAuthFullname = (state) => state.user.fullname

export const getAuthEmail = (state) => state.user.email

export const getAuthToken = (state) => state.token

export const getIdUser = (state) => state.user._id

// export const isLogged = (state) => !isEmpty(state.toke)

// export const currentUser = ({ user }) => user
