import type { ProfileQuery } from '@/.nuxt/gql/default'

const getProfile = async (address: Address) => {
  const { profile }: ProfileQuery = await GqlProfile({
    id: (address || '').toLowerCase(),
  })

  return profile
}

export const useProfile = () => {
  return {
    getProfile,
  }
}
