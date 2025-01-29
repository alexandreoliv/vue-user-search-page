export interface User {
  name: {
    first: string
    last: string
  }
  gender: string
  picture: {
    large: string
    thumbnail: string
  }
  login: {
    uuid: string
  }
  location: {
    city: string
    state: string
    country: string
  }
  email: string
  phone: string
  dob: {
    date: string
    age: number
  }
  favourite: boolean
  tags: string[]
}
