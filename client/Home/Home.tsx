import * as React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import { Codenames } from '../Codenames/index'
import { Lobby } from '../Lobby/index'
import { Nav as el } from '../Nav/index'
import { getRandomName, titleCase } from '../../utils/data'
import { Profile } from '../Profile'
import { ProfileInformation } from '../Profile/Profile'
import { prng } from '../../utils/PRNG'

const Background = styled('div')`
  background-color: ${(props): string => props.theme.lightgray};
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid: 75px 1fr / 1fr
`

const Container = styled('div')`
  padding: ${(props): string => props.theme.pagePadding};
`

const Nav = styled(el)`
  padding: ${(props): string => props.theme.pagePadding};
  margin-bottom: 20px;
`

// NOTE: Site will fail if localStorage is not enabled...
const defaultProfile: ProfileInformation = {id: prng.getID(), user: titleCase(getRandomName())}
const createDefaultProfile = (): ProfileInformation => {
  localStorage.setItem('profile', JSON.stringify(defaultProfile))
  return defaultProfile
}

const Home = (): JSX.Element => {
  const [profile, setProfile] = React.useState<ProfileInformation>(defaultProfile)

  // Initialize the profile from localstorage or create one if one does not exist
  React.useEffect((): void => {
    let domProfile: ProfileInformation

    try {
      domProfile = JSON.parse(localStorage.getItem('profile'))

      if (!domProfile) {
        domProfile = createDefaultProfile()
      }
    } catch (err) {
      console.warn(err)
      domProfile = createDefaultProfile()
    }

    setProfile(domProfile)
  }, [])

  const onProfileSubmit = (submittedProfile: ProfileInformation): void => {
    localStorage.setItem('profile', JSON.stringify(submittedProfile))
    setProfile(submittedProfile)
  }

  return (
    <Background>
      <Nav user={profile.user} />
      <Container>
        <Switch>
          <Route path='/codenames/:gameID' exact component={Codenames} />
          <Route path='/profile' exact render={(props): React.ReactNode => {
            return <Profile {...props} profile={profile} onProfileSubmit={onProfileSubmit} />
          }} />
          <Route render={(props): React.ReactNode => {
            return <Lobby {...props} user={profile.user} />
          }} />
        </Switch>
      </Container>
    </Background>
  )
}

export {
  Home
}
