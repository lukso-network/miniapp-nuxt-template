export type Image = {
  hash?: string
  width?: number
  height?: number
  url?: string
  src?: string
  verified?: ImageVerifiedStatus
}

export type ImageVerifiedStatus = 'VERIFIED' | 'INVALID' | 'UNVERIFIED'
